# Monitoring

## The rule

**No component talks to a monitoring provider.** Stores, services, the route handler and the two error boundaries call `lib/monitoring`; that layer decides where — or whether — anything is sent.

```
error boundaries ─┐
stores, services ─┼─► lib/monitoring (captureException / captureMessage)
route handler   ──┘         │
                            ├─► redact.ts        ← nothing personal survives this
                            ├─► context.ts       ← where it broke, never who for
                            └─► provider         ← Sentry · console · noop
```

## What is captured

| Source | Event |
| --- | --- |
| `app/error.tsx` | React render error (`fatal`) |
| `app/global-error.tsx` | Root layout error (`fatal`) |
| `global-handlers.ts` | `window.onerror` — errors no boundary sees |
| `global-handlers.ts` | Unhandled promise rejections |
| `global-handlers.ts` | Long tasks > 200ms — a stutter the founder can feel |
| `app/api/orders/route.ts` | Any unhandled server exception (`fatal`) + slow writes > 2.5s |
| `order-repository.ts` | Supabase insert failures, with the Postgres code |
| `order-repository.ts` | An insert that returned neither error nor row — supposedly impossible |
| `order-service.ts` | Timeouts, network failures, submissions slower than 4s |
| `whatsapp-service.ts` | WhatsApp blocked by the browser; no number configured |
| `analytics/service.ts` | An analytics provider that failed to load or throw |
| `scene-store.ts` | Advance requested past the end of the flow — an impossible transition |

## What is attached

**Build identity** — on every event, browser and server:

| field | source | example |
| --- | --- | --- |
| `release` | commit sha (12), or `dev` | `9f2c1ab77e01` |
| `build_id` | the id Next stamps into the artefact | `9f2c1ab77e01` |
| `build_time` | stamped at build | `2026-07-13T09:00:00.000Z` |
| `commit_sha` | full sha, omitted when there is no VCS | `9f2c1ab77e0134bd…` |
| `environment` | `production` / `development` | |

`next.config.ts` resolves these **once** and feeds both `generateBuildId` and the runtime `env`, so the id baked into the artefact is the id a crash report carries. Without that, a stack trace points at "a build" and there is no way to tell which one. On Sentry the build id is also sent as `dist`, which is the field it uses to match an uploaded source map to the code that actually ran.

**Place** — `runtime` (browser/server) · `route` · `scene` · `journey_step` · `browser` · `os` · `device` · `viewport` · `language` · `request_id` · `reference`

Browser and OS are read as **names** — "Chrome", "iOS" — never the full user-agent string, which is a fingerprint. Viewport is a size, not an identity.

## What is never captured

Customer name. Phone number. Notes. Project name. Email. Tokens.

This is not a promise, it is a mechanism. `redact.ts` scrubs **every string on the way out** — messages, exception values, extras — not just the ones expected to be dangerous:

| in | out |
| --- | --- |
| `boom while calling 0551234567` | `boom while calling [phone]` |
| `contact +966551234567 now` | `contact [phone] now` |
| `mail founder@example.com` | `mail [email]` |
| `{ fullName, phone, notes, pg_code }` | `{ pg_code }` |

Verified: an envelope built from an error whose message *contained* a phone number carried **zero** occurrences of it.

## Failure policy

**Monitoring never interrupts the journey.**

- Every capture is wrapped. A provider that throws is swallowed and disabled for the session.
- Sends are fire-and-forget: one attempt, `keepalive`, **no retry, no backoff, no queue**. A reporter that is down must not become traffic of its own.
- **Rate limited**: 20 events/minute, with identical failures deduped inside a 10s window. A render loop that throws 200 times sends **3** requests, not 200 — measured. That matters most at exactly the moment the founder can least afford a self-inflicted outage.

Verified: `captureException` with a `fetch` that throws returns normally.

## Disabled by default

No DSN configured → the provider is `noop`. Nothing loads, nothing is sent, no request leaves the process. Verified: **0 requests** with no DSN, **1** with one.

```
NEXT_PUBLIC_SENTRY_DSN=      # browser
SENTRY_DSN=                  # server (falls back to the public one)
NEXT_PUBLIC_MONITORING_DEBUG=true   # prints events instead of sending them
```

## Sentry without the SDK

`providers/sentry.ts` POSTs an envelope we build ourselves. The official SDK is ~40 kB on the client, installs a webpack plugin, patches `fetch`, `XHR`, `history` and `console`, and collects a great deal we spent two tasks deciding **not** to collect.

The trade is real: no automatic breadcrumbs, no session tracking, no performance tracing out of the box. If you want those, **this one file changes** — swap it for `@sentry/nextjs` behind the same `MonitoringProvider` interface. Nothing else in the codebase moves.

## Source maps

`productionBrowserSourceMaps: true`. Stack frames are parsed into Sentry's frame format (`filename`, `function`, `lineno`, `colno`, `in_app`), so an uploaded map resolves them back to the original TypeScript.

Upload on deploy, tagging the same release the app reports (`NEXT_PUBLIC_RELEASE`, the commit sha on Vercel):

```bash
npx @sentry/cli sourcemaps inject .next/static/chunks
npx @sentry/cli sourcemaps upload --release "$VERCEL_GIT_COMMIT_SHA" .next/static/chunks
```

**The maps are served publicly**, which means the client source is readable. That is a knowing trade: this is a client-rendered intake flow, every secret it could leak is already server-side, and a legible crash beats an obfuscated one. If that calculus changes, set `hidden-source-map` and upload the maps without shipping them.

## Adding a provider

```ts
export const myProvider: MonitoringProvider = {
  name: "my-provider",
  init: async () => {},
  capture: (event) => { /* send it. never throw. never retry. */ },
};
```

Add one branch to `resolveProvider()` in `lib/monitoring/service.ts`. That is the entire change — redaction, context, rate limiting and the failure policy already happened before your provider is handed the event.
