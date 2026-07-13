"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig } from "framer-motion";
import { useActivity } from "@/lib/activity-store";
import {
  advanceScene,
  registerScene,
  useScene,
  type SceneId,
} from "@/lib/scene-store";
import SceneTransition from "./SceneTransition";

type Props = {
  /**
   * The scenes that exist right now. A later task adds one key — nothing else
   * in the app changes, and if the flow was already waiting on that scene, the
   * transition fires the moment it appears.
   */
  scenes: Partial<Record<SceneId, React.ReactNode>>;
};

/**
 * The stage. One scene occupies it at a time. There is no router, no URL change
 * and no page navigation anywhere in this flow — only this element swapping its
 * contents, in and out of focus.
 *
 * Three jobs:
 *   1. Listen for the handoff Task 02 already produces, and advance the flow.
 *   2. Run exit → enter through <SceneTransition> in `mode="wait"`, so the
 *      outgoing scene finishes leaving before the next one arrives. AnimatePresence
 *      holds the outgoing subtree, so it exits as itself, not as the new scene.
 *   3. Hold the <LayoutGroup>, so any element carrying a shared `layoutId`
 *      (see `SHARED` in lib/scene-motion.ts) morphs across the change rather
 *      than cross-fading.
 */
export default function SceneStage({ scenes }: Props) {
  const { phase } = useActivity();
  const { active, direction } = useScene();

  const available = useMemo(
    () =>
      Object.keys(scenes).filter((id) => scenes[id as SceneId]) as SceneId[],
    [scenes],
  );

  // Registration is the plug-in point: registering a pending scene promotes it.
  useEffect(() => {
    const cleanups = available.map((id) => registerScene(id));
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [available]);

  // The activity handoff is the cue. The stage doesn't care which card was
  // chosen — only that the flow asked to move on.
  useEffect(() => {
    if (phase === "handoff") advanceScene();
  }, [phase]);

  const current = scenes[active] ?? scenes.hero ?? null;

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="turjoman-flow">
        <div className="relative isolate min-h-[100svh] w-full overflow-x-hidden bg-ink-900">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <SceneTransition
              key={active}
              sceneKey={active}
              direction={direction}
              className="min-h-[100svh] w-full"
            >
              {current}
            </SceneTransition>
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
