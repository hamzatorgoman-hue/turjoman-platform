"use client";

import { captureException } from "../monitoring";
import { baseContext } from "./context";
import { journeyContext } from "./journey";
import { sanitize } from "./sanitize";
import { noopProvider } from "./providers/noop";
import type { AnalyticsProvider, EventName, EventProperties } from "./types";

/**
 * The analytics service. The one door.
 *
 * Three promises it keeps:
 *
 * 1. **It never breaks the journey.** Every path through this file is wrapped.
 *    A provider that throws, a script that 404s, an ad blocker that removes the
 *    global — none of it reaches the founder. Tracking is best effort, and an
 *    order is not.
 *
 * 2. **It costs nothing at first paint.** Nothing loads until the browser is
 *    idle. Events fired before then are queued, not dropped, and flushed in
 *    order once a provider exists. The hero renders on a network that has not
 *    been asked for a single analytics byte.
 *
 * 3. **It cannot leak.** Every payload passes the allowlist in sanitize.ts on
 *    the way out. There is no path around it, because `track` is the only
 *    exported way to send anything.
 */

const QUEUE_LIMIT = 50;
const IDLE_TIMEOUT_MS = 3_000;

type QueuedEvent = { event: EventName; properties: EventProperties };

let provider: AnalyticsProvider | null = null;
let starting = false;
let queue: QueuedEvent[] = [];

/** View events describe a place, not an action: once per session is the truth. */
const seenOnce = new Set<EventName>();

function safely(work: () => void) {
  try {
    work();
  } catch (error) {
    // Analytics failing is a bad day for a dashboard, not for a founder — but a
    // dashboard that has quietly stopped reporting is worse than one that never
    // existed, so monitoring is told.
    console.warn("[analytics] suppressed", error);
    captureException(error, {
      message: "Analytics provider failed",
      severity: "warning",
    });
  }
}

async function resolveProvider(): Promise<AnalyticsProvider> {
  const ga4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const debug = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

  // Nothing configured → nothing loaded, nothing sent, no cookie written.
  if (debug) {
    const { debugProvider } = await import("./providers/debug");
    return debugProvider;
  }

  if (gtm) {
    const { createGtmProvider } = await import("./providers/gtm");
    return createGtmProvider(gtm);
  }

  if (ga4) {
    const { createGa4Provider } = await import("./providers/ga4");
    return createGa4Provider(ga4);
  }

  return noopProvider;
}

function whenIdle(work: () => void) {
  if (typeof window === "undefined") return;

  const idle = window.requestIdleCallback;
  if (typeof idle === "function") {
    idle(() => work(), { timeout: IDLE_TIMEOUT_MS });
    return;
  }

  window.setTimeout(work, 1_200);
}

/**
 * Starts the provider. Called automatically by the first `track`, so nothing in
 * the app has to remember to do it.
 */
export function startAnalytics() {
  if (starting || provider || typeof window === "undefined") return;
  starting = true;

  whenIdle(() => {
    void (async () => {
      try {
        const resolved = await resolveProvider();
        await resolved.init();
        provider = resolved;
        flush();
      } catch (error) {
        console.warn("[analytics] provider failed to start", error);
        captureException(error, {
          message: "Analytics provider failed to start",
          severity: "warning",
        });
        provider = noopProvider;
        queue = [];
      } finally {
        starting = false;
      }
    })();
  });
}

function flush() {
  if (!provider) return;

  const pending = queue;
  queue = [];

  for (const item of pending) {
    safely(() => provider?.track(item.event, item.properties));
  }
}

/**
 * The only way to send an event. Named, allowlisted, best effort.
 */
export function track(event: EventName, properties: EventProperties = {}) {
  safely(() => {
    const payload = {
      ...baseContext(),
      ...sanitize(journeyContext()),
      ...sanitize(properties),
    };

    if (!provider) {
      startAnalytics();
      if (queue.length < QUEUE_LIMIT)
        queue.push({ event, properties: payload });
      return;
    }

    provider.track(event, payload);
  });
}

/** For events that describe arriving somewhere: fire once, not on every re-entry. */
export function trackOnce(event: EventName, properties: EventProperties = {}) {
  if (seenOnce.has(event)) return;
  seenOnce.add(event);
  track(event, properties);
}

/** Test seam. Not used by the application. */
export function __resetAnalytics() {
  provider = null;
  starting = false;
  queue = [];
  seenOnce.clear();
}
