import { currentPlace } from "./state";
import type { MonitoringContext } from "./types";

/**
 * Everything a crash report is allowed to know.
 *
 * Browser and OS are read as *classes* — "Chrome", "iOS" — not as the full user
 * agent string, which is a fingerprint. Viewport is a size, not an identity.
 */

export const RELEASE = process.env.NEXT_PUBLIC_RELEASE || "dev";
export const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "unknown";
export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || "unknown";
export const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA || "";
export const ENVIRONMENT = process.env.NODE_ENV || "development";

/** The identity of the artefact, attached to every event, browser or server. */
const BUILD = {
  release: RELEASE,
  build_id: BUILD_ID,
  build_time: BUILD_TIME,
  ...(COMMIT_SHA ? { commit_sha: COMMIT_SHA } : {}),
  environment: ENVIRONMENT,
} as const;

export function buildContext(): MonitoringContext {
  const place = currentPlace();

  if (typeof window === "undefined") {
    return {
      ...BUILD,
      runtime: "server",
      ...place,
      journey_step: place.journeyStep,
      request_id: place.requestId,
    };
  }

  const width = window.innerWidth;

  return {
    ...BUILD,
    runtime: "browser",
    route: window.location?.pathname,
    scene: place.scene,
    journey_step: place.journeyStep,
    browser: browserName(navigator.userAgent),
    os: osName(navigator.userAgent),
    device: width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop",
    viewport: `${width}x${window.innerHeight}`,
    language: navigator.language?.slice(0, 12),
    reference: place.reference,
    request_id: place.requestId,
  };
}

/** A name, not a signature. */
function browserName(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  return "Other";
}

function osName(ua: string): string {
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}
