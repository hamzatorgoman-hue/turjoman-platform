# Data layer

## Rule

**No component imports Supabase. No component imports the repository. No component imports `fetch`.**

The UI talks to exactly one thing: the store. The store talks to exactly one thing: the service.

```
OrderScene  ──►  lib/order-store.ts
                      │  (the only place that knows an order can be sent)
                      ▼
              lib/services/order-service.ts        ← client. validates, times out, returns typed results
                      │  POST /api/orders
                      ▼
              app/api/orders/route.ts              ← server. re-validates everything. trusts nothing.
                      │
                      ▼
              lib/repositories/order-repository.ts ← server-only. the only file that knows the table.
                      │
                      ▼
              lib/supabase/server-client.ts        ← server-only. holds the service role key.
                      │
                      ▼
                  Supabase / Postgres
```

`lib/supabase/server-client.ts` and `lib/repositories/order-repository.ts` both `import "server-only"`. Importing either from a client component is a **build error**, not a runtime surprise — the architecture is enforced by the compiler, not by discipline.

## Why the browser never talks to Supabase

The obvious approach is the anon key plus an insert policy. It works, and it means anyone who opens devtools can write to the table directly, as fast as they can loop.

Instead the browser posts to our own route handler, which holds the **service role key server-side** and re-validates the payload before the database sees it. Three consequences:

1. No Supabase key of any kind reaches the client bundle.
2. The phone number is normalised **on the server** (`+9665XXXXXXXX`), so the table has one shape, not the founder's.
3. The activity, personality, style, direction and package are checked against the ids we actually offer. An unknown id is not a typo — it's someone poking the endpoint, and it stops at the route, not in the table.

## Errors

Nothing throws into the UI. Every failure is a value:

```ts
{ code, message, fields?, retryable }
```

| code | when | retryable |
| --- | --- | --- |
| `validation` | the input is incomplete or malformed | no |
| `offline` | `navigator.onLine === false` — we don't spend the founder's connection on a request that can't leave | yes |
| `timeout` | 12s abort. A request that hangs is worse than one that fails | yes |
| `network` | the request couldn't be made or completed | yes |
| `server` | we reached the server and it failed | yes |
| `config` | the environment is misconfigured — **our** fault, not theirs | no |
| `unknown` | anything else | yes |

Postgres speaks in codes (`23514`, `23505`, `42501`). The founder should not have to: the repository translates them and logs the raw message server-side. A Postgres error string never crosses the wire.

## Confirmation is never optimistic

`order-store` does **not** set `request` until the insert succeeds. The scene shows its confirmation panel when `request` exists — so the panel can only appear after the order is genuinely in the database.

A failed send returns the founder to a form they can fix and retry, and the typed failure is held in `state.failure`. **Nothing in the UI reads it yet** — see "Approval needed" below.

A second submit while one is in flight is ignored by the store, so a double click cannot create two orders.

## Schema

`supabase/migrations/20260713000000_orders.sql`

| column | type | notes |
| --- | --- | --- |
| `id` | uuid pk | `gen_random_uuid()` |
| `project_name` | text | 2–120 chars, trimmed |
| `customer_name` | text | 2–120 chars, trimmed |
| `mobile` | text | must match `^\+9665[0-9]{8}$` |
| `notes` | text | nullable, ≤ 2000 |
| `activity` | text | checked against the six we offer |
| `personality` | text | checked against the eight |
| `style` | text | checked against the six |
| `package` | text | `starter` / `professional` / `launch` |
| `direction` | text | `core` / `warm` / `quiet` |
| `status` | `order_status` enum | **defaults to `new`** |
| `created_at` | timestamptz | `now()` |
| `updated_at` | timestamptz | maintained by trigger |
| `source`, `user_agent` | text | provenance, for support — not analytics |

The check constraints deliberately mirror the application's rules. If the two ever drift, the database wins, and the row is rejected rather than quietly stored wrong.

Indexes: `(status, created_at desc)` and `(created_at desc)` — the two questions the studio actually asks the table: *what is new*, and *what arrived when*.

**RLS is enabled with no policies, and `force row level security` is on.** Only the service role — the server — can read or write. `anon` and `authenticated` are explicitly revoked. A leaked public key exposes nothing, because there is no public key.

## Environment

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Server-only: no `NEXT_PUBLIC_` prefix, so they cannot enter the client bundle. Read at call time, not import time — a missing key returns a typed `config` failure instead of crashing the build.

## Setup

1. Run `supabase/migrations/20260713000000_orders.sql` against the project (SQL editor, or `supabase db push`).
2. Put the two variables in `.env.local` (local) and in the Vercel project (production).
3. Nothing else. The flow already submits through the service layer.
