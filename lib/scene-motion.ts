import type { Variants } from "framer-motion";

/** One easing across the whole flow, so every scene change feels like the same hand. */
export const SCENE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SCENE_DURATION = {
  exit: 0.5,
  enter: 0.85,
} as const;

export type SceneDirection = "forward" | "back";

/**
 * The scene change is a camera move, not a page load: the outgoing scene falls
 * back and defocuses, the incoming one settles forward into focus.
 *
 * `custom` carries the direction so backward moves mirror the depth.
 */
export const sceneVariants: Variants = {
  enter: (direction: SceneDirection = "forward") => ({
    opacity: 0,
    scale: direction === "forward" ? 1.04 : 0.97,
    y: direction === "forward" ? 18 : -12,
    filter: "blur(14px)",
  }),
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: SCENE_DURATION.enter,
      ease: SCENE_EASE,
      filter: { duration: SCENE_DURATION.enter * 0.8, ease: SCENE_EASE },
    },
  },
  exit: (direction: SceneDirection = "forward") => ({
    opacity: 0,
    scale: direction === "forward" ? 0.975 : 1.03,
    y: direction === "forward" ? -14 : 16,
    filter: "blur(12px)",
    transition: {
      duration: SCENE_DURATION.exit,
      ease: SCENE_EASE,
    },
  }),
};

/** Motion-reduced fallback: the cut still reads, it just doesn't move. */
export const sceneVariantsReduced: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.25, ease: "linear" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "linear" } },
};

/**
 * Shared-element contract. Any element that should morph across a scene change
 * carries one of these as its `layoutId`, inside the stage's <LayoutGroup>.
 * Framer matches them by id and animates the geometry between scenes.
 */
export const SHARED = {
  lockup: "turjoman:lockup",
  ctaSurface: "turjoman:cta-surface",
  activityCard: (id: string) => `turjoman:activity-card:${id}`,
  sceneTitle: "turjoman:scene-title",
} as const;
