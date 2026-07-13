import { NextResponse, type NextRequest } from "next/server";

/**
 * Security headers, per request.
 *
 * The Content Security Policy is nonce-based rather than `unsafe-inline`: Next's
 * bootstrap scripts get the nonce, and anything injected into the page does not.
 * That is the difference between a policy that stops an XSS and a policy that
 * merely files a report about one.
 *
 * `style-src` keeps `unsafe-inline`, and that is not laziness: Framer Motion
 * animates by writing inline styles on every frame, and there is no nonce for a
 * style attribute. Inline *styles* cannot execute code, so the exposure is
 * defacement, not takeover — an acceptable trade for the motion this product is
 * built on. Everything that can execute is nonced.
 */
export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const isDev = process.env.NODE_ENV !== "production";

  const csp = [
    "default-src 'self'",
    // strict-dynamic: scripts Next loads from the nonced bootstrap inherit trust.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    // Google's measurement pixel, when a measurement id is configured.
    "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
    "font-src 'self' data:",
    // The analytics script is injected by our own nonced code, so strict-dynamic
    // covers loading it. Its *beacons* still need a destination.
    // Analytics beacons and the crash reporter. Both are POST-only destinations;
    // neither can execute anything here.
    `connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.ingest.sentry.io https://*.ingest.de.sentry.io${isDev ? " ws: http://localhost:* http://127.0.0.1:*" : ""}`,
    // The WhatsApp hand-off is a navigation, not a form post or a frame.
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  // Next reads this from the *request* to nonce its own script tags.
  headers.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Everything except static assets, which are immutable and carry no scripts.
    "/((?!_next/static|_next/image|favicon.ico|hero/|fonts/).*)",
  ],
};
