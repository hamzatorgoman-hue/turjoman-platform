"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SceneDirection } from "@/lib/scene-motion";
import { sceneVariants, sceneVariantsReduced } from "@/lib/scene-motion";

type Props = {
  /** Identity of the scene on stage — drives AnimatePresence. */
  sceneKey: string;
  direction: SceneDirection;
  className?: string;
  children: React.ReactNode;
};

/**
 * The camera move. One scene defocuses and falls back; the next settles forward
 * into focus. Reusable on its own — any part of the app that needs the same
 * grammar (a step inside a scene, a panel swap) can wrap content in it.
 *
 * `filter` carries the depth: the scene leaving goes soft, the scene arriving
 * resolves. Under prefers-reduced-motion it degrades to a plain crossfade.
 */
export default function SceneTransition({
  sceneKey,
  direction,
  className,
  children,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={sceneKey}
      custom={direction}
      variants={reduced ? sceneVariantsReduced : sceneVariants}
      initial="enter"
      animate="center"
      exit="exit"
      style={{ willChange: reduced ? "opacity" : "opacity, transform, filter" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
