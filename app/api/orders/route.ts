import { NextResponse } from "next/server";
import { ACTIVITIES, type ActivityId } from "@/lib/activities";
import { readWhatsAppNumber } from "@/lib/env";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { VARIANTS, type VariantId } from "@/lib/identity-direction";
import { buildOrderRequest, validateDraft, type OrderDraft } from "@/lib/order";
import { PACKAGES, type PackageId } from "@/lib/packages";
import { PERSONALITIES, type PersonalityId } from "@/lib/personalities";
import { captureException, captureMessage, setPlace } from "@/lib/monitoring";
import { insertOrder } from "@/lib/repositories/order-repository";
import { failure } from "@/lib/services/result";
import { STYLES, type StyleId } from "@/lib/styles";
import { buildOrderMessage } from "@/lib/whatsapp/message";

/**
 * The write endpoint.
 *
 * The client already validated. We validate again, because the client is not a
 * trusted party — anyone can POST this route. Only after the payload has been
 * re-checked and re-normalised on the server does it reach the repository.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** An order is a considered act. Five a minute from one address is already generous. */
const RATE = { limit: 5, windowMs: 60_000 };

/** The largest legitimate order is a few hundred bytes. 8 KB is charity. */
const MAX_BODY_BYTES = 8 * 1024;

const NO_STORE = { "Cache-Control": "no-store" } as const;

const ACTIVITY_IDS = new Set(ACTIVITIES.map((a) => a.id));
const PERSONALITY_IDS = new Set(PERSONALITIES.map((p) => p.id));
const STYLE_IDS = new Set(STYLES.map((s) => s.id));
const PACKAGE_IDS = new Set(PACKAGES.map((p) => p.id));
const VARIANT_IDS = new Set(VARIANTS.map((v) => v.id));

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

/** A write this simple has no business taking longer than this. */
const SLOW_REQUEST_MS = 2_500;

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId =
    request.headers.get("x-request-id") ??
    crypto.randomUUID().replace(/-/g, "");
  setPlace({ requestId });

  try {
    return await handle(request, requestId, startedAt);
  } catch (error) {
    // Nothing below is supposed to throw. If it did, the founder still gets a
    // typed failure, and we get told.
    captureException(error, {
      message: "Unhandled exception in POST /api/orders",
      severity: "fatal",
      extra: { request_id: requestId },
    });

    return NextResponse.json(
      {
        error: failure("server", "تعذّر إرسال الطلب. حاول مرة أخرى بعد قليل.", {
          retryable: true,
        }),
      },
      { status: 500, headers: { ...NO_STORE, "x-request-id": requestId } },
    );
  }
}

async function handle(request: Request, requestId: string, startedAt: number) {
  const limit = rateLimit(clientKey(request), RATE);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: failure(
          "server",
          "عدد كبير من المحاولات. انتظر قليلًا ثم أعد المحاولة.",
          { retryable: true },
        ),
      },
      {
        status: 429,
        headers: {
          ...NO_STORE,
          "Retry-After": String(limit.retryAfterSeconds),
        },
      },
    );
  }

  // Reject an oversized body before reading it into memory.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        error: failure("validation", "الطلب أكبر من المسموح.", {
          retryable: false,
        }),
      },
      { status: 413, headers: NO_STORE },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: failure("validation", "تعذّرت قراءة الطلب.", {
          retryable: false,
        }),
      },
      { status: 400, headers: NO_STORE },
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const context = (body.context ?? {}) as Record<string, unknown>;

  const draft: OrderDraft = {
    projectName: text(body.projectName, 120),
    fullName: text(body.fullName, 120),
    phone: text(body.phone, 24),
    notes: text(body.notes, 2000),
  };

  const fields = validateDraft(draft);
  if (Object.keys(fields).length) {
    return NextResponse.json(
      {
        error: failure("validation", "راجع الحقول المطلوبة ثم أعد المحاولة.", {
          fields,
          retryable: false,
        }),
      },
      { status: 422, headers: NO_STORE },
    );
  }

  // Every choice must be one we actually offer. An unknown id is not a typo — it
  // is someone poking at the endpoint, and it stops here rather than in the table.
  const activity = String(context.activity ?? "") as ActivityId;
  const personality = String(context.personality ?? "") as PersonalityId;
  const style = String(context.style ?? "") as StyleId;
  const direction = String(context.direction ?? "") as VariantId;
  const packageId = String(context.packageId ?? "") as PackageId;

  const known =
    ACTIVITY_IDS.has(activity) &&
    PERSONALITY_IDS.has(personality) &&
    STYLE_IDS.has(style) &&
    VARIANT_IDS.has(direction) &&
    PACKAGE_IDS.has(packageId);

  if (!known) {
    return NextResponse.json(
      {
        error: failure(
          "validation",
          "بعض الاختيارات غير معروفة. أعد المحاولة من البداية.",
          {
            retryable: false,
          },
        ),
      },
      { status: 422, headers: NO_STORE },
    );
  }

  // Rebuilt on the server: the phone is normalised and the timestamp is ours, not theirs.
  const order = buildOrderRequest(draft, {
    activity,
    personality,
    style,
    direction,
    packageId,
  });

  const result = await insertOrder(order, {
    userAgent: request.headers.get("user-agent"),
  });

  if (!result.ok) {
    const status = result.error.code === "validation" ? 422 : 502;
    return NextResponse.json(
      { error: result.error },
      { status, headers: NO_STORE },
    );
  }

  // The conversation is opened from the row the database accepted, never from
  // the payload the browser sent. A missing number does not fail the order:
  // Supabase is the source of truth, WhatsApp is only the channel.
  const number = readWhatsAppNumber();

  const whatsapp = number
    ? {
        number,
        reference: result.data.reference,
        message: buildOrderMessage(result.data.stored),
      }
    : null;

  const elapsed = Date.now() - startedAt;
  if (elapsed > SLOW_REQUEST_MS) {
    captureMessage("Slow order write", {
      severity: "warning",
      extra: { duration_ms: elapsed, request_id: requestId },
    });
  }

  return NextResponse.json(
    {
      order: {
        id: result.data.id,
        reference: result.data.reference,
        createdAt: result.data.createdAt,
        status: result.data.status,
      },
      whatsapp,
    },
    { status: 201, headers: { ...NO_STORE, "x-request-id": requestId } },
  );
}
