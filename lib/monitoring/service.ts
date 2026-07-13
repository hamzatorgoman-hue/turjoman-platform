import { buildContext } from "./context";
import { consoleMonitoringProvider } from "./providers/console";
import { noopMonitoringProvider } from "./providers/noop";
import { createSentryProvider } from "./providers/sentry";
import { redactExtra, redactString } from "./redact";
import { setPlace } from "./state";
import type { CapturedEvent, MonitoringProvider, Severity } from "./types";

/**
 * The monitoring service. The one door.
 *
 * Failure policy, in full: **monitoring never interrupts the journey.** Every
 * capture is wrapped, every send is fire-and-forget, nothing is retried, and a
 * provider that throws is replaced with the no-op for the rest of the session.
 * A crash reporter that crashes the app is worse than no crash reporter.
 *
 * It is also rate-limited. A render loop that throws sixty times a second must
 * not become sixty requests a second — that is a self-inflicted outage, and it is
 * exactly the moment the founder can least afford one.
 */

const MAX_EVENTS_PER_MINUTE = 20;
/** Identical failures collapse: one report of a thing that happened 400 times. */
const DEDUPE_WINDOW_MS = 10_000;

let provider: MonitoringProvider | null = null;
let starting = false;
let disabled = false;

let sent: number[] = [];
const recent = new Map<string, number>();

function resolveProvider(): MonitoringProvider | null {
  const dsn =
    typeof window === "undefined"
      ? process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
      : process.env.NEXT_PUBLIC_SENTRY_DSN;

  // Statically imported, deliberately. Both providers together are ~2 kB — far
  // less than the cost of a dynamic import boundary, and unlike analytics, a
  // crash reporter that loads lazily misses the crashes that happen early, which
  // are the ones worth having.
  if (process.env.NEXT_PUBLIC_MONITORING_DEBUG === "true") {
    return consoleMonitoringProvider;
  }

  if (!dsn) return null; // Nothing configured → nothing sent. Disabled by default.

  return createSentryProvider(dsn) ?? null;
}

function ensureProvider(): MonitoringProvider | null {
  if (disabled) return null;
  if (provider) return provider;
  if (starting) return null;

  starting = true;

  try {
    const resolved = resolveProvider();
    provider = resolved ?? noopMonitoringProvider;
    if (!resolved) disabled = true;
    void provider.init().catch(() => {});
  } catch {
    provider = noopMonitoringProvider;
    disabled = true;
  } finally {
    starting = false;
  }

  return provider;
}

function allowed(key: string): boolean {
  const now = Date.now();

  const last = recent.get(key);
  if (last && now - last < DEDUPE_WINDOW_MS) return false;
  recent.set(key, now);

  sent = sent.filter((at) => now - at < 60_000);
  if (sent.length >= MAX_EVENTS_PER_MINUTE) return false;
  sent.push(now);

  if (recent.size > 200) recent.clear();

  return true;
}

function send(event: CapturedEvent) {
  try {
    const active = ensureProvider();
    if (!active || disabled) return;

    if (!allowed(`${event.severity}:${event.message}`)) return;

    active.capture(event);
  } catch {
    // The reporter failed. That is the end of the matter — for the reporter.
    disabled = true;
  }
}

export function captureException(
  error: unknown,
  options: {
    message?: string;
    extra?: Record<string, unknown>;
    severity?: Severity;
  } = {},
) {
  const real = error instanceof Error ? error : new Error(String(error));

  send({
    severity: options.severity ?? "error",
    message: redactString(options.message ?? real.message ?? "Unknown error"),
    error: real,
    extra: redactExtra(options.extra),
    context: buildContext(),
  });
}

export function captureMessage(
  message: string,
  options: { extra?: Record<string, unknown>; severity?: Severity } = {},
) {
  send({
    severity: options.severity ?? "warning",
    message: redactString(message),
    extra: redactExtra(options.extra),
    context: buildContext(),
  });
}

/** Tells a crash report where in the product it happened. Never who it happened to. */
export { setPlace };

/** Test seam. Not used by the application. */
export function __resetMonitoring() {
  provider = null;
  starting = false;
  disabled = false;
  sent = [];
  recent.clear();
}
