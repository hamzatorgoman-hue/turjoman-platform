"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ActivityId } from "@/lib/activities";
import type { Direction } from "@/lib/identity-direction";
import type { MockupItem } from "@/lib/mockups";
import type { PersonalityId } from "@/lib/personalities";
import type { StyleId } from "@/lib/styles";
import MockupSurface from "./MockupSurface";

type Props = {
  item: MockupItem;
  direction: Direction;
  style: StyleId;
  activity: ActivityId;
  personality: PersonalityId;
};

/** A single frame in the gallery. Presentation quality, and nothing claimed beyond it. */
export default function MockupCard({
  item,
  direction,
  style,
  activity,
  personality,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.figure
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.75 }}
      className="group relative overflow-hidden rounded-2xl border border-gold-500/[0.22] bg-ink-800/50 shadow-panel"
    >
      <div className="relative aspect-[400/260] w-full overflow-hidden">
        <MockupSurface
          kind={item.kind}
          direction={direction}
          style={style}
          activity={activity}
          personality={personality}
          className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_0%,rgba(244,196,116,0.16),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
      </div>

      <figcaption className="flex items-baseline justify-between gap-3 px-5 py-4">
        <span className="font-body text-sm text-sand-200">{item.label}</span>
        <span className="text-end font-body text-[0.68rem] font-light leading-4 text-sand-400">
          {item.note}
        </span>
      </figcaption>
    </motion.figure>
  );
}
