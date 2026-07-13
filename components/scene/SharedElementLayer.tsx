"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ActivityIcon from "@/components/activities/ActivityIcon";
import { getActivity } from "@/lib/activities";
import { useActivity } from "@/lib/activity-store";
import { SCENE_EASE } from "@/lib/scene-motion";
import {
  liftActivity,
  rectOf,
  completeFlight,
  useFlight,
} from "@/lib/shared-flight";

const SELECTED_CARD = '[role="radio"][data-selected]';

/**
 * Renders the one element that survives the scene change: the chosen activity
 * card, lifted into a fixed layer and flown from where it sat in the Hero to
 * where the next scene wants it.
 *
 * Mounted as a sibling of the stage, so it is untouched by AnimatePresence.
 */
export default function SharedElementLayer() {
  const { selected, phase } = useActivity();
  const { activity, origin, destination, status } = useFlight();
  const reduced = useReducedMotion();

  // Lift the card the frame after it is marked selected, while it is still on
  // screen and measurable. No changes to the card component are needed — it
  // already announces itself with `data-selected`.
  useEffect(() => {
    if (!selected || phase === "idle" || status !== "idle") return;

    const frame = requestAnimationFrame(() => {
      const node = document.querySelector(SELECTED_CARD);
      if (node) liftActivity(selected, rectOf(node));
    });

    return () => cancelAnimationFrame(frame);
  }, [selected, phase, status]);

  if (!activity || !origin || status === "landed") return null;

  const chosen = getActivity(activity);
  const target = destination ?? origin;

  return (
    <AnimatePresence>
      <motion.div
        key="shared-activity"
        aria-hidden
        className="pointer-events-none fixed z-50"
        initial={{
          top: origin.top,
          left: origin.left,
          width: origin.width,
          height: origin.height,
        }}
        animate={{
          top: target.top,
          left: target.left,
          width: target.width,
          height: target.height,
        }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: destination ? 0.78 : 0.4, ease: SCENE_EASE }
        }
        onAnimationComplete={() => {
          if (destination) completeFlight();
        }}
      >
        {/* the card, rebuilt from data — same language, no cloned DOM */}
        <div className="flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-gold-300/70 bg-[linear-gradient(180deg,rgba(48,34,18,0.92)_0%,rgba(14,9,5,0.96)_100%)] px-3 pb-4 pt-5 text-center shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-[6px]">
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_28%,rgba(212,168,83,0.18),transparent_72%)]" />
          <span className="relative grid flex-1 place-items-center text-gold-100">
            <ActivityIcon
              id={chosen.id}
              className="h-11 w-11 sm:h-12 sm:w-12"
            />
          </span>
          <span className="relative mt-3 block w-full">
            <span className="block font-body text-sm text-sand-100 sm:text-[0.95rem]">
              {chosen.label}
            </span>
            <span className="mx-auto mt-2.5 block h-[2px] w-12 rounded-full bg-gold-bar" />
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
