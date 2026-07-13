import type { NextConfig } from "next";

/**
 * Headers that do not depend on the request live here; the nonce-based CSP is
 * per-request and lives in middleware.ts.
 */
const securityHeaders = [
  // The browser must not guess at content types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy sibling of frame-ancestors, for the browsers that still read it.
  { key: "X-Frame-Options", value: "DENY" },
  // Referrers leak journeys. Send an origin, and only over TLS.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // We ask for none of these. Say so, so an injected script cannot either.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Two years, subdomains included. Only ever served over HTTPS in production.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * The identity of this build, resolved once and used everywhere.
 *
 * `generateBuildId` and the runtime `env` read the same values, so the id Next
 * stamps into the artefact is the id a crash report carries. Without that, a
 * stack trace points at "a build" — and there is no way to tell which one.
 */
const COMMIT_SHA =
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT_SHA ?? "";

const BUILD_ID =
  process.env.NEXT_PUBLIC_BUILD_ID ??
  (COMMIT_SHA ? COMMIT_SHA.slice(0, 12) : `local-${Date.now().toString(36)}`);

const BUILD_TIME = new Date().toISOString();

const RELEASE =
  process.env.NEXT_PUBLIC_RELEASE ??
  (COMMIT_SHA ? COMMIT_SHA.slice(0, 12) : "dev");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // The artefact and the telemetry agree on what this build is called.
  generateBuildId: async () => BUILD_ID,

  /**
   * Source maps in production.
   *
   * Without them a Sentry stack trace is a wall of `a.b.c` from a minified chunk,
   * which tells you a crash happened and nothing else. With them, the frames
   * resolve to the original TypeScript — the file, the line, the variable name.
   *
   * The maps are served publicly, which means the source is readable. That is a
   * real trade and it is made knowingly: this is a client-rendered marketing and
   * intake flow, every secret it could leak is already server-side, and a legible
   * crash beats an obfuscated one. See docs/monitoring.md for the hidden-source-map
   * alternative if that calculus ever changes.
   */
  productionBrowserSourceMaps: true,

  env: {
    // The release a crash belongs to. Vercel provides the commit; local is "dev".
    NEXT_PUBLIC_RELEASE: RELEASE,
    // The artefact it came from — the same id Next stamped into the build.
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
    // When that artefact was made, so a report can be placed in time.
    NEXT_PUBLIC_BUILD_TIME: BUILD_TIME,
    // The exact source it was made from, when a VCS was involved at all.
    NEXT_PUBLIC_COMMIT_SHA: COMMIT_SHA,
  },

  // A build that ships type errors or lint errors is not a build. Fail loudly.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // Framer Motion is the largest dependency in the bundle: import only what is used.
    optimizePackageImports: ["framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // The plate is content-addressed by name and never changes in place.
        source: "/hero/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
