import Link from "next/link";

/** There is one page in this application. Anything else is a wrong turn. */
export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] w-full flex-col items-center justify-center gap-6 bg-ink-900 px-[var(--edge)] text-center">
      <h1 className="font-display text-2xl font-bold text-sand-100">الصفحة غير موجودة</h1>
      <p className="max-w-[28rem] font-body text-sm font-light leading-7 text-sand-300">
        الرابط الذي فتحته لا يقود إلى شيء.
      </p>
      <Link
        href="/"
        className="inline-flex h-[3.2rem] items-center justify-center rounded-full bg-gold-bar px-8 font-body text-[0.95rem] font-semibold text-ink-900 shadow-cta"
      >
        العودة إلى البداية
      </Link>
    </main>
  );
}
