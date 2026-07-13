# Hero plate — canonical, locked

The hero environment is one photograph: the Turjoman office at blue hour — Riyadh skyline through the glass, walnut joinery and lit shelving, pendant and desk lamps on the right, the walnut desk in the foreground with the notebook, pens, stamp, card tray and mug.

**This plate is canonical.** It is not redesigned, regenerated, replaced, reinterpreted or repainted. It is the environment only — never part of the interface, and nothing is ever baked into it.

## Shipped assets (`public/hero/`)

| Frame | Size | Crop | WebP | AVIF |
| --- | --- | --- | --- | --- |
| `atelier-desktop` | 1896 × 1264 | full frame, 3:2 (composition untouched) | 140 KB | 87 KB |
| `atelier-tablet` | 1400 × 1050 | 4:3, anchored 55% | 110 KB | 70 KB |
| `atelier-mobile` | 1080 × 1440 | 3:4, anchored 50% — keeps the tower, the joinery and the desk objects | 90 KB | 54 KB |

Every crop preserves the four things the layout depends on: **left negative space** for the copy, **skyline visibility**, **right-hand visual richness** (lamps, shelving, marble), and **desk visibility**.

`lqip.txt` holds the 20px LQIP, already inlined as `HERO_PLATE_LQIP` in `lib/hero-plate.ts`.

Delivery: one request per breakpoint via `<picture>` — AVIF where supported, WebP otherwise — `fetchpriority="high"`, intrinsic dimensions declared, no layout shift. Focal points per breakpoint live in `--plate-pos` (`app/globals.css`).

Regenerate (same crops, same encoding):

```bash
npm run plate -- ./assets/atelier-master.png
```

## Grading (`components/hero/HeroPlate.tsx`)

Only what readability requires:

1. **Warm lamp bloom** — screen-blended radial over the desk lamp, drifting on a 24s cycle.
2. **Copy scrim** — left-to-right from `sm` up (the column sits over the glass); top-to-bottom on mobile, where the content stacks and a left scrim would have crushed the skyline. Headline contrast: **13.3:1** desktop / **15.1:1** mobile, worst case **9.7:1** / **11.4:1** against the brightest pixels behind it. Description: **7.1:1**.
3. **Top and bottom gradient** — nav headroom above, trust-bar legibility below; the desk stays visible.
4. **Soft vignette** — falloff starts at 44%.
5. **Film grain** — 4.5% overlay.

Nothing else touches the plate. No crop or overlay hides the skyline, the lamps, the joinery or the desk.

## Motion

Luxury, not spectacle: the plate drifts ~10px with the pointer, the bloom ~20px (parallax by depth), and a 32s breathing scale (1.02 → 1.045) keeps the still alive. All of it stops under `prefers-reduced-motion`.
