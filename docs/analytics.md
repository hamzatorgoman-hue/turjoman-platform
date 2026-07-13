# Analytics

## The rule

**No component knows analytics exists.** Not the name of the provider, not the name of an event, not that anything is being measured at all.

Events are emitted from the **stores** — the layer that already knows when a choice is made — and every one of them goes through a single service.

```
stores ──► lib/analytics (track) ──► sanitize (allowlist) ──► provider ──► GA4 / GTM / nothing
```

## Every event

All fifteen carry the same prefix, so a dashboard filter of `turjoman.` is the whole product and nothing else.

| Event | Fired from | When |
| --- | --- | --- |
| `turjoman.hero_viewed` | `scene-store` | The app is on screen |
| `turjoman.activity_selected` | `activity-store` | A sector card is chosen |
| `turjoman.personality_selected` | `personality-store` | A tone is chosen |
| `turjoman.style_selected` | `style-store` | A direction is chosen |
| `turjoman.identity_variant_changed` | *(not wired — see below)* | A board variant is previewed |
| `turjoman.identity_confirmed` | `identity-store` | The direction is committed |
| `turjoman.mockups_viewed` | `scene-store` | The gallery is reached |
| `turjoman.deliverables_viewed` | `scene-store` | The delivery list is reached |
| `turjoman.packages_viewed` | `scene-store` | The packages are reached |
| `turjoman.package_selected` | `package-store` | A package is chosen |
| `turjoman.order_submitted` | `order-store` | A valid form is sent |
| `turjoman.order_saved` | `order-store` | The row exists in Postgres |
| `turjoman.whatsapp_opened` | `order-store` | The conversation opened |
| `turjoman.order_failed` | `order-store` | The send, or the hand-off, failed |
| `turjoman.validation_failed` | `order-store` | Submit was pressed on an invalid form |

View events fire **once per session**: a founder who steps back and forward has not discovered the packages twice.

## Payloads

Every event carries the **funnel so far**, not just its own dimension — because the business question is never "how many chose مطعم", it is "how many who chose مطعم reached the order form".

```json
{
  "device": "desktop", "viewport_width": 1440, "viewport_height": 900, "language": "ar-SA",
  "activity": "store", "personality": "modern", "style": "luxury", "direction": "core",
  "package": "starter", "package_price": 300, "reference": "TRJ-7C70EC06",
  "platform": "desktop", "failure_code": "timeout", "invalid_fields": "phone", "scene": "packages"
}
```

That is the complete vocabulary. `lib/analytics/types.ts` holds it as an **allowlist**, and `sanitize.ts` drops everything else on the way out.

## Privacy

- **Allowlist, not blocklist.** A blocklist has to imagine every mistake in advance. There is no key for a name, a phone number or a note — so a future task cannot leak one by accident.
- Strings are capped at 64 characters: a long string is not a category, it is a sentence somebody typed.
- `invalid_fields` sends field **names** (`"phone,fullName"`), never their contents. Which fields founders get wrong is a design signal; what they typed is none of our business.
- **Privacy by default:** with no measurement id configured, the provider is `noop` — no script loads, no beacon is sent, no cookie is written.
- No fingerprinting, no session replay, no recording, no id of our own.
- **Verified:** a full scripted run with a real name, phone and note in the form produced 13 events and **zero** occurrences of any of them.

## Performance

Nothing loads at first paint. The service starts on `requestIdleCallback` (3s ceiling), and events fired before then are **queued, not dropped**, then flushed in order. The provider modules are dynamic imports, so an unconfigured build ships none of them.

Cost to the critical path: **+1.1 kB** (51.6 kB page JS, 154 kB First Load).

## Failure

Every path is wrapped. A provider that throws, a script blocked by an extension, a missing global — all of it is swallowed and logged as a warning. **Tracking is best effort; an order is not.**

## Adding a provider

Implement three things:

```ts
export const myProvider: AnalyticsProvider = {
  name: "my-provider",
  init: async () => { /* load whatever you need */ },
  track: (event, properties) => { /* send it. never throw. */ },
};
```

Then add one branch to `resolveProvider()` in `lib/analytics/service.ts`. That is the entire change: no store, no component, no event definition moves.

**Provider quirks stay inside the provider.** GA4 rejects dots in event names, so `providers/ga4.ts` rewrites `turjoman.order_saved` → `turjoman_order_saved` on the way out. GTM takes the dotted name unchanged. Nothing else in the codebase learns that GA4 has an opinion about punctuation.

## Adding an event

1. Name it in `EVENTS` (`lib/analytics/types.ts`), with the prefix.
2. If it needs a new property, add it to `ALLOWED_PROPERTIES` — deliberately, because that list is the privacy boundary.
3. Call `track(EVENTS.yourEvent, { … })` **from the store that already knows it happened**. Never from a component.

## Configuration

```
NEXT_PUBLIC_GA4_MEASUREMENT_ID=      # GA4
NEXT_PUBLIC_GTM_ID=                  # GTM (wins if both are set)
NEXT_PUBLIC_ANALYTICS_DEBUG=         # prints events to the console instead of sending them
```

The CSP in `middleware.ts` allows Google's beacon endpoints in `connect-src` and `img-src`. The script itself is injected by our own nonced code, which `strict-dynamic` already covers.

## Consent

There is none, and this needs your decision.

With no id configured, nothing is tracked and no consent is required. **The moment you set a GA4 or GTM id, Google writes a cookie**, and under PDPL (and GDPR for any EU visitor) that normally requires consent. A consent banner is a UI surface, and the UI is frozen — so I have not built one. Flag it when you're ready and it becomes a task.
