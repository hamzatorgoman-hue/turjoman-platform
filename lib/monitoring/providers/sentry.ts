import { redactString } from "../redact";
import type { CapturedEvent, MonitoringProvider } from "../types";

/**
 * Sentry, without the SDK.
 *
 * The official SDK is ~40 kB on the client, installs its own webpack plugin,
 * patches fetch, XHR, history and console, and captures a great deal we have
 * spent two tasks deciding *not* to collect. What we actually need is one HTTP
 * POST of an envelope we control, line by line, after redaction. So that is what
 * this is.
 *
 * The trade is real and worth stating: no automatic breadcrumbs, no session
 * tracking, no performance tracing out of the box. If you later want those, this
 * file is the one thing that changes — swap it for `@sentry/nextjs` behind the
 * same `MonitoringProvider` interface and nothing else in the codebase moves.
 *
 * Stack frames are parsed and sent in Sentry's frame format, so uploaded source
 * maps resolve them back to the original TypeScript. See docs/monitoring.md.
 */

type Dsn = {
  envelopeUrl: string;
  publicKey: string;
};

function parseDsn(dsn: string): Dsn | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, "");
    if (!url.username || !projectId) return null;

    return {
      publicKey: url.username,
      envelopeUrl: `${url.protocol}//${url.host}/api/${projectId}/envelope/?sentry_key=${url.username}&sentry_version=7`,
    };
  } catch {
    return null;
  }
}

/** `at fn (https://host/path.js:12:34)` → one frame Sentry can symbolicate. */
function parseStack(stack: string | undefined) {
  if (!stack) return [];

  const frames = stack
    .split("\n")
    .slice(1, 26)
    .map((line) => {
      const match =
        /at (?:(.+?) )?\(?((?:https?|file):\/\/[^\s)]+?):(\d+):(\d+)\)?/.exec(
          line,
        ) ?? /at ()\(?([^\s)]+?):(\d+):(\d+)\)?/.exec(line);

      if (!match) return null;

      return {
        function: match[1]?.trim() || "?",
        filename: match[2],
        lineno: Number(match[3]),
        colno: Number(match[4]),
        in_app: !String(match[2]).includes("/node_modules/"),
      };
    })
    .filter(Boolean);

  // Sentry expects oldest frame first.
  return frames.reverse();
}

function eventId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function createSentryProvider(dsn: string): MonitoringProvider | null {
  const parsed = parseDsn(dsn);
  if (!parsed) return null;

  return {
    name: "sentry",

    init: async () => {},

    capture: (event: CapturedEvent) => {
      const id = eventId();
      const timestamp = Date.now() / 1000;

      const payload = {
        event_id: id,
        timestamp,
        platform: "javascript",
        level: event.severity,
        release: event.context.release,
        environment: event.context.environment,
        logger: "turjoman",
        message: { formatted: redactString(event.message) },
        dist: event.context.build_id,
        tags: {
          build_id: event.context.build_id,
          commit_sha: event.context.commit_sha,
          runtime: event.context.runtime,
          scene: event.context.scene,
          journey_step: event.context.journey_step,
          device: event.context.device,
          browser: event.context.browser,
          os: event.context.os,
          reference: event.context.reference,
          request_id: event.context.request_id,
        },
        contexts: {
          app: {
            app_version: event.context.release,
            app_build: event.context.build_id,
            build_time: event.context.build_time,
            commit_sha: event.context.commit_sha,
          },
          browser: { name: event.context.browser },
          os: { name: event.context.os },
        },
        extra: {
          ...event.extra,
          route: event.context.route,
          viewport: event.context.viewport,
          language: event.context.language,
        },
        exception: event.error
          ? {
              values: [
                {
                  type: event.error.name || "Error",
                  value: redactString(event.error.message || event.message),
                  stacktrace: { frames: parseStack(event.error.stack) },
                },
              ],
            }
          : undefined,
      };

      const envelope =
        JSON.stringify({ event_id: id, sent_at: new Date().toISOString() }) +
        "\n" +
        JSON.stringify({ type: "event" }) +
        "\n" +
        JSON.stringify(payload) +
        "\n";

      // One attempt. No retry, no queue, no backoff: a monitoring provider that
      // is down must not turn into traffic of its own.
      void fetch(parsed.envelopeUrl, {
        method: "POST",
        body: envelope,
        headers: { "Content-Type": "application/x-sentry-envelope" },
        keepalive: true,
        cache: "no-store",
      }).catch(() => {});
    },
  };
}
