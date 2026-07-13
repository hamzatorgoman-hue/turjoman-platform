# Production

## Build gates

`next.config.ts` refuses to build on a type error or a lint error. A build that ships a type error is not a build.

```bash
npm run typecheck   # tsc --noEmit, strict + noUnusedLocals + noUnusedParameters
npm run lint        # eslint . — no-console (warn/error only), no-explicit-any
npm run build
```

All three are clean.

## Security

### Content Security Policy

Nonce-based, generated per request in `middleware.ts`. Next stamps the nonce into its own bootstrap scripts; anything injected into the page does not have it and does not run.

```
script-src 'self' 'nonce-…' 'strict-dynamic'
style-src  'self' 'unsafe-inline'
default-src 'self'; img-src 'self' data: blob:; font-src 'self' data:
connect-src 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'
```

**`style-src` keeps `unsafe-inline`, deliberately.** Framer Motion animates by writing inline styles every frame, and there is no nonce for a style attribute. An inline *style* cannot execute code, so the exposure is defacement rather than takeover. Everything that *can* execute is nonced.

A nonce cannot be baked into a statically prerendered document — it would be the same nonce for every visitor, which is the same as having none. So `app/page.tsx` is `force-dynamic`. There is nothing to cache anyway: the page is a client-side flow with no per-request data.

### Static headers (`next.config.ts`)

`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy` (camera, mic, geolocation, payment, usb all denied) · `Strict-Transport-Security` (2 years, subdomains, preload). `X-Powered-By` is off.

### The order endpoint

- **Rate limited**: 5 requests per minute per address. In-memory and per-instance — see `lib/rate-limit.ts`, which says so out loud. Enough to stop a bored script; not enough to stop a distributed flood. That is the seam to swap for Vercel KV when it matters.
- **Body capped** at 8 KB, rejected on `content-length` before it is read into memory.
- **`Cache-Control: no-store`** on every response, including the failures.
- **Re-validated server-side**: the client is not a trusted party. An unknown activity id is a 422, not a row.

### Secrets

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WHATSAPP_BUSINESS_NUMBER` — none prefixed `NEXT_PUBLIC_`, so none can enter the client bundle. `lib/supabase/server-client.ts` and `lib/repositories/order-repository.ts` are `import "server-only"`: importing either from a component is a **build error**, not a code review.

## Performance

| | Before | After |
| --- | --- | --- |
| `/` page JS | 72.6 kB | **50.5 kB** |
| First Load JS | 175 kB | **153 kB** |

The scene map moved into `components/scene/FlowStage.tsx`, a client boundary, so `next/dynamic` can do its job. When a *server* component creates `<PersonalityScene />` and passes it down as a prop, the client reference travels in the RSC payload and the chunk loads at hydration — whether or not the scene is ever seen. Declared in a client component instead, each scene is a real lazy boundary: **verified in the browser, one chunk per scene, fetched on first render**.

The transition never waits on the network: the outgoing scene takes 500ms to leave, and a chunk arrives in a fraction of that.

`optimizePackageImports: ["framer-motion"]` trims the largest dependency. The hero plate is served `immutable` for a year — it is content-addressed by name and never changes in place.

## What was checked and found clean

- **Hydration**: every store has a `getServerSnapshot`; no `Math.random`, no `Date.now()` in render. Zero hydration warnings in a production run.
- **Listeners and timers**: the pointer listener in `HeroPlate`, the resize listener in `SharedActivitySlot`, and the `requestAnimationFrame` in `SharedElementLayer` all clean up on unmount. Store timers are cleared before being replaced.
- **Accessibility**: axe re-run against the production build across all scenes and viewports — **0 violations**, no regressions from Task 10.5.
- **Dependencies**: no unused runtime dependencies.
- **Logging**: no `console.log` anywhere; `no-console` enforces it. The repository logs Postgres codes server-side and never returns them.
