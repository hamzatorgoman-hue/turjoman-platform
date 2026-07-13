"use client";

/**
 * The root boundary: if the layout itself fails, this replaces the whole
 * document, so it must not depend on the layout, the fonts, or the design tokens.
 * Inline styles only.
 */
import { captureException } from "@/lib/monitoring";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Logged, never rendered: a digest helps us, a stack trace helps an attacker.
  console.error("[turjoman] root error", error.digest ?? error.message);
  captureException(error, {
    message: "Root layout error",
    severity: "fatal",
    extra: { digest: error.digest },
  });

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          background: "#070503",
          color: "#F7EFE3",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
          حدث خطأ غير متوقع
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            opacity: 0.75,
            margin: 0,
            maxWidth: "28rem",
            lineHeight: 1.9,
          }}
        >
          لم نتمكّن من تحميل الصفحة. حاول مرة أخرى.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "0.9rem 2rem",
            background:
              "linear-gradient(100deg,#9A6A28,#D4A853 26%,#F6E3B8 52%,#D4A853 74%,#9A6A28)",
            color: "#120C05",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
