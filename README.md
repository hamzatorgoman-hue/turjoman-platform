# ترجمان · Turjoman

**بداية تليق بطموحك**

An Arabic-first business launch platform. A founder arrives with an idea and leaves with a brand direction, a package, and a conversation with the studio — in one continuous, cinematic flow. No pages, no router, no page loads: a single stage, and one scene on it at a time.

```
Hero → Activity → Personality → Style → Identity → Mockups → Deliverables → Packages → Order
```

---

## Stack

| | |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS 3 |
| Motion | Framer Motion 11 |
| Data | Supabase (Postgres) — server-only |
| Channel | WhatsApp Business |
| Hosting | Vercel |

RTL throughout. Arabic only.

---

## Quick start

```bash
git clone <your-repo-url> turjoman
cd turjoman
npm install
cp .env.example .env.local     # then fill in the two Supabase values
npm run dev                    # http://localhost:3000
```

The flow runs end to end with **no** environment variables at all — every scene, every transition, every selection. Only the final submit needs Supabase. See [Environment](#environment) below.

---

## Scripts

| | |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` — must be 0 errors |
| `npm run lint` | ESLint — must be clean |
| `npm run check` | Both of the above |
| `npm run plate` | Regenerate the hero plate crops from a master render |

The build **fails** on a type error or a lint error, deliberately. A build that ships a type error is not a build.

> `next build` downloads the three fonts from Google at build time (`next/font` then self-hosts them, so the running site never calls Google). Your build machine needs outbound network access — Vercel has it. See [DEPLOYMENT.md](DEPLOYMENT.md#one-build-time-dependency-worth-knowing-about).

---

## Structure

```
app/
  page.tsx              the one page: mounts the stage
  layout.tsx            RTL shell, fonts, metadata
  error.tsx             React error boundary  → reports to monitoring
  global-error.tsx      root boundary
  not-found.tsx
  api/orders/route.ts   the only write endpoint. re-validates everything.

components/
  hero/                 scene 1 — the plate, the lockup, the trust bar
  activities/           the six activity cards
  personality/          scene 2
  style/                scene 3 — six material boards
  identity/             scene 4 — the derived direction board + Direction Symbol
  mockups/              scene 5 — nine surfaces, drawn from the direction
  deliverables/         scene 6
  packages/             scene 7
  order/                scene 8
  scene/                the transition engine + shared-element flight layer

lib/
  *-store.ts            one store per decision. all with the same lifecycle.
  services/             the only layer that talks to the network
  repositories/         the only layer that knows the database exists  (server-only)
  supabase/             the only Supabase client                        (server-only)
  whatsapp/             message + link builders
  analytics/            event contract, allowlist, providers
  monitoring/           capture, redaction, providers
  identity-direction.ts three answers → one board. deterministic, no AI.

supabase/migrations/    run these before the first order
public/hero/            the hero plate: desktop / tablet / mobile, AVIF + WebP
docs/                   how each layer works, and why
scripts/                the plate pipeline
```

**Architecture in one line:** components talk to stores, stores talk to services, services talk to the network. No component imports Supabase, an analytics provider, a monitoring provider, or `fetch`. The `server-only` imports make a violation a **build error**, not a code review.

---

## Environment

Copy `.env.example` → `.env.local`. Nothing here is required to run the flow; each variable turns one thing on.

| Variable | Required | What it does |
| --- | --- | --- |
| `SUPABASE_URL` | for orders | Server-only. |
| `SUPABASE_SERVICE_ROLE_KEY` | for orders | Server-only. **Never** `NEXT_PUBLIC_`. |
| `WHATSAPP_BUSINESS_NUMBER` | for the hand-off | E.164, no `+`. Missing → the order still saves. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | no | Empty → no script, no beacon, no cookie. |
| `NEXT_PUBLIC_GTM_ID` | no | Wins over GA4 if both are set. |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` | no | Empty → monitoring is a no-op. |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | no | Prints events instead of sending them. |
| `NEXT_PUBLIC_MONITORING_DEBUG` | no | Prints crashes instead of sending them. |

Privacy is the default state, not a setting: with nothing configured, nothing is loaded and nothing is sent.

---

## Database

Two migrations, run in order, before the first order:

```
supabase/migrations/20260713000000_orders.sql        the orders table
supabase/migrations/20260713010000_order_reference.sql  TRJ-XXXXXXXX references
```

Paste into the Supabase SQL editor, or `supabase db push`. RLS is on with **no policies** — only the server (service role) can read or write.

---

## Documentation

| | |
| --- | --- |
| [`docs/transitions.md`](docs/transitions.md) | The scene engine and the shared-element flight |
| [`docs/data-layer.md`](docs/data-layer.md) | Service → route → repository → Postgres |
| [`docs/whatsapp.md`](docs/whatsapp.md) | The hand-off, and why the window is reserved during the click |
| [`docs/analytics.md`](docs/analytics.md) | 15 events, the property allowlist, adding a provider |
| [`docs/monitoring.md`](docs/monitoring.md) | What is captured, what never is, the failure policy |
| [`docs/production.md`](docs/production.md) | CSP, headers, rate limiting, code splitting |
| [`docs/hero-plate.md`](docs/hero-plate.md) | The hero photograph and its crops |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | GitHub → Vercel, step by step |

---

## License

Proprietary. All rights reserved.
