"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/monitoring";

/**
 * The last line of defence for a client exception.
 *
 * It is deliberately plain: no motion, no photography, nothing that could itself
 * fail. A founder who reaches this screen is already having a bad time — the one
 * thing they need is a way back into the flow.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logged, not displayed: a stack trace tells the founder nothing and tells an
    // attacker something. It is reported, though — silence is the failure mode
    // this whole layer exists to prevent.
    console.error("[turjoman] unhandled error", error.digest ?? error.message);
    captureException(error, {
      message: "React render error",
      severity: "fatal",
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <main className="flex min-h-[100svh] w-full flex-col items-center justify-center gap-6 bg-ink-900 px-[var(--edge)] text-center">
      <h1 className="font-display text-2xl font-bold text-sand-100">
        حدث خطأ غير متوقع
      </h1>
      <p className="max-w-[28rem] font-body text-sm font-light leading-7 text-sand-300">
        لم نتمكّن من إكمال العملية. يمكنك المحاولة مرة أخرى، ولن تفقد ما اخترته.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-[3.2rem] items-center justify-center rounded-full bg-gold-bar px-8 font-body text-[0.95rem] font-semibold text-ink-900 shadow-cta"
      >
        إعادة المحاولة
      </button>
    </main>
  );
}
