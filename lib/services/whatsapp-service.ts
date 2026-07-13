"use client";

import { captureMessage } from "@/lib/monitoring";
import { buildWhatsAppUrl, detectPlatform } from "@/lib/whatsapp/link";
import { err, failure, ok, type Failure, type Result } from "./result";

/**
 * WhatsApp, isolated.
 *
 * The message and the number are built on the server from the stored order; this
 * file only decides *how* to open the conversation on the device in front of us,
 * and reports honestly when it cannot.
 *
 * The hard part is not the URL — it is the pop-up blocker. A window opened after
 * an `await` is no longer attributable to the founder's click, and every browser
 * blocks it. So the window is reserved *during* the click, while the gesture is
 * still live, and pointed at WhatsApp once the order is safely stored. If the
 * order fails, the reserved window is closed again and the founder never sees it.
 */

export type WhatsAppHandoff = {
  number: string;
  message: string;
  reference: string;
};

export type WhatsAppWindow = Window | null;

/** Call this synchronously inside the click. Not after. */
export function reserveWhatsAppWindow(): WhatsAppWindow {
  if (typeof window === "undefined") return null;

  try {
    // No `noopener` here: that would return null and leave us nothing to steer.
    // The opener is severed below, once the window is pointed at WhatsApp.
    return window.open("about:blank", "_blank");
  } catch {
    return null;
  }
}

export function releaseWhatsAppWindow(reserved: WhatsAppWindow) {
  try {
    if (reserved && !reserved.closed) reserved.close();
  } catch {
    // A window we cannot close is a window we can ignore.
  }
}

export function openWhatsApp(
  handoff: WhatsAppHandoff | null,
  reserved: WhatsAppWindow,
): Result<{ url: string }, Failure<never>> {
  if (!handoff?.number || !handoff.message) {
    // The order is saved and the studio has no way to be told about it.
    captureMessage("WhatsApp hand-off missing: no number configured", {
      severity: "error",
    });

    releaseWhatsAppWindow(reserved);
    return err(
      failure("config", "تم حفظ طلبك. سنتواصل معك قريبًا لمراجعة التفاصيل.", {
        retryable: false,
      }),
    );
  }

  const url = buildWhatsAppUrl({
    number: handoff.number,
    message: handoff.message,
    platform: detectPlatform(),
  });

  try {
    if (reserved && !reserved.closed) {
      reserved.opener = null;
      reserved.location.replace(url);
      return ok({ url });
    }

    // The reservation failed (or was never made). One honest second attempt.
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened) return ok({ url });

    captureMessage("WhatsApp blocked by the browser", {
      severity: "warning",
      extra: { platform: detectPlatform() },
    });

    return err(
      failure<never>(
        "blocked",
        "تم حفظ طلبك، لكن المتصفح منع فتح واتساب. اسمح بالنوافذ المنبثقة ثم أعد المحاولة.",
        { retryable: true },
      ),
    );
  } catch {
    releaseWhatsAppWindow(reserved);
    return err(
      failure("blocked", "تم حفظ طلبك، لكن تعذّر فتح واتساب على هذا الجهاز.", {
        retryable: true,
      }),
    );
  }
}
