# Transition engine

Turjoman is one continuous experience. There is no router, no URL change, no page navigation: a single **stage**, and one **scene** on it at a time.

## Pieces

| File | Role |
| --- | --- |
| `lib/scene-store.ts` | Which scene is on stage, the direction of the last move, the history, and any scene the flow is *waiting* for. External store — no provider, no context, nothing to thread through the Hero. |
| `lib/scene-motion.ts` | The motion language: one easing, one pair of durations, the enter/center/exit variants, the reduced-motion fallback, and the shared-element id contract (`SHARED`). |
| `components/scene/SceneTransition.tsx` | The reusable camera move: fade + depth blur + a slight push in Z. Direction-aware. Usable anywhere the same grammar is wanted, not just at the stage. |
| `components/scene/SceneStage.tsx` | The stage: watches the activity handoff, runs `AnimatePresence mode="wait"`, holds the `LayoutGroup` for shared layout animations. |
| `app/page.tsx` | Mounts the stage with the scene map. |

## How a scene change feels

The outgoing scene defocuses (blur 0 → 12px), falls back (scale 0.975) and drifts up; only once it has finished does the incoming scene arrive — forward (scale 1.04 → 1), settling down and resolving out of blur. Backward moves mirror the depth, so retreating never feels like advancing.

`mode="wait"` is deliberate: two half-transparent scenes on top of each other reads as a page swap. One leaving, then one arriving, reads as a cut in a film.

## How the flow advances

Task 02 already ends a selection in `phase === "handoff"`. The stage listens for exactly that and calls `advanceScene()`. It never inspects *which* activity was chosen — that stays in the activity store, where the next scene can read it.

## How the next scene plugs in (Task 04, when approved)

```tsx
// app/page.tsx
<SceneStage
  scenes={{
    hero: <Hero />,
    personality: <Personality />,
  }}
/>
```

That is the entire wiring. If a card was selected before that scene existed, the request was held as `pending` and fires the moment the scene registers — the stage never cuts to an empty frame.

## Shared element: the travelling card

The chosen activity card leaves the Hero and arrives in the next scene as the same object.

A plain `layoutId` pair cannot do this here. The stage swaps in `mode="wait"` — the Hero is unmounted *before* the next scene mounts — so the two ends never coexist, and Framer has nothing to morph between. Keeping both on screen at once would have meant a crossfade, which is exactly the page-swap feeling the engine exists to avoid.

So the card is lifted instead:

| File | Role |
| --- | --- |
| `lib/shared-flight.ts` | The flight plan: which activity, the rect it left, the rect it is going to, and the status (`idle → lifted → flying → landed`). |
| `components/scene/SharedElementLayer.tsx` | Mounted *outside* the stage, so it survives the swap. Measures the chosen card straight from the DOM (it already carries `data-selected`, so Task 02 needs no changes), rebuilds it from data in a fixed layer, and flies it to the destination. |
| `components/scene/SharedActivitySlot.tsx` | Dropped into any scene that wants the card. It measures itself, hands its rect to the flight layer, and stays empty until the card lands — so the card is never on screen twice. |

Sequence: card clicked → lifted the next frame, still at its original rect → Hero defocuses and leaves → next scene mounts and its slot offers a rect → the card flies (780ms, scene easing) → on arrival the slot takes over rendering it and the flight layer unmounts.

Under `prefers-reduced-motion` the flight duration is zero: the card is simply already there.

The `SHARED` ids in `lib/scene-motion.ts` remain the contract for in-scene morphs (`lockup`, `ctaSurface`, `sceneTitle`) where both ends *do* coexist.

## Accessibility

`MotionConfig reducedMotion="user"` wraps the stage, and `SceneTransition` swaps to a plain crossfade under `prefers-reduced-motion`. No blur, no scale, no drift.
