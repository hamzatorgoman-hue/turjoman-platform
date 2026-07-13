import "server-only";

import { captureException, captureMessage } from "@/lib/monitoring";
import { getSupabase } from "@/lib/supabase/server-client";
import {
  err,
  failure,
  ok,
  type Failure,
  type Result,
} from "@/lib/services/result";
import type { OrderRequest } from "@/lib/order";
import type { StoredOrder } from "@/lib/whatsapp/message";

/**
 * The only place in the codebase that knows the shape of the `orders` table.
 *
 * Nothing above it knows about Postgres, PostgREST, or Supabase — the repository
 * takes a domain object in and gives a domain object back, and every database
 * failure is translated into one of our own typed failures on the way out.
 */

export type OrderRecord = {
  id: string;
  reference: string;
  createdAt: string;
  status: string;
  /** The row as Postgres accepted it — the only version anything downstream trusts. */
  stored: StoredOrder;
};

/** Domain object → table row. The only place snake_case exists. */
function toRow(request: OrderRequest, meta: { userAgent?: string | null }) {
  return {
    project_name: request.projectName,
    customer_name: request.fullName,
    mobile: request.phone,
    notes: request.notes || null,
    activity: request.context.activity,
    personality: request.context.personality,
    style: request.context.style,
    package: request.context.packageId,
    direction: request.context.direction,
    source: "web",
    user_agent: meta.userAgent ?? null,
  };
}

/**
 * Postgres speaks in codes. The founder should not have to.
 * 23514 = check constraint, 23505 = unique violation, 42501 = permission.
 */
function translate(code: string | undefined, message: string): Failure {
  switch (code) {
    case "23514":
      return failure(
        "validation",
        "بعض البيانات غير صالحة. راجع الحقول ثم أعد المحاولة.",
        {
          retryable: false,
        },
      );
    case "23505":
      return failure("validation", "يبدو أن هذا الطلب أُرسل بالفعل.", {
        retryable: false,
      });
    case "42501":
    case "42P01":
      return failure(
        "config",
        "تعذّر إرسال الطلب الآن. يرجى المحاولة لاحقًا.",
        {
          retryable: false,
        },
      );
    default:
      // The raw message is logged and reported, never returned to the browser.
      console.error("[orders] insert failed", { code, message });
      captureException(new Error(message), {
        message: "Supabase insert failed",
        severity: "error",
        extra: { pg_code: code ?? "unknown" },
      });
      return failure("server", "تعذّر إرسال الطلب. حاول مرة أخرى بعد قليل.", {
        retryable: true,
      });
  }
}

export async function insertOrder(
  request: OrderRequest,
  meta: { userAgent?: string | null } = {},
): Promise<Result<OrderRecord, Failure>> {
  const client = getSupabase();
  if (!client.ok) return err(client.error);

  const { data, error } = await client.data
    .from("orders")
    .insert(toRow(request, meta))
    .select(
      "id, reference, created_at, status, project_name, customer_name, mobile, notes, activity, personality, style, package, direction",
    )
    .single();

  if (error) return err(translate(error.code, error.message));

  if (!data) {
    // An insert that neither errored nor returned a row should be impossible.
    captureMessage("Supabase insert returned no row", { severity: "error" });

    return err(
      failure("server", "تعذّر إرسال الطلب. حاول مرة أخرى بعد قليل.", {
        retryable: true,
      }),
    );
  }

  return ok({
    id: data.id as string,
    reference: data.reference as string,
    createdAt: data.created_at as string,
    status: data.status as string,
    stored: {
      reference: data.reference as string,
      projectName: data.project_name as string,
      customerName: data.customer_name as string,
      mobile: data.mobile as string,
      notes: (data.notes as string | null) ?? null,
      activity: data.activity as string,
      personality: data.personality as string,
      style: data.style as string,
      package: data.package as string,
      direction: data.direction as string,
    },
  });
}
