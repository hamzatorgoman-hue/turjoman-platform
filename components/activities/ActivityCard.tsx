"use client";

import { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Activity } from "@/lib/activities";
import { EASE_LUX } from "@/lib/motion";
import ActivityIcon from "./ActivityIcon";

type Props = {
  activity: Activity;
  selected: boolean;
  /** Roving tabindex: exactly one card in the group is tabbable. */
  tabbable: boolean;
  onSelect: (activity: Activity) => void;
  onFocus: (activity: Activity) => void;
};

const ActivityCard = forwardRef<HTMLButtonElement, Props>(function ActivityCard(
  { activity, selected, tabbable, onSelect, onFocus },
  ref,
) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabbable ? 0 : -1}
      onClick={() => onSelect(activity)}
      onFocus={() => onFocus(activity)}
      whileHover={reduced ? undefined : { y: -6 }}
      whileTap={reduced ? undefined : { y: -2, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.7 }}
      data-selected={selected || undefined}
      className={[
        "group relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-2xl",
        "border bg-[linear-gradient(180deg,rgba(26,19,13,0.86)_0%,rgba(9,6,4,0.94)_100%)]",
        "px-3 pb-4 pt-5 text-center shadow-panel backdrop-blur-[6px]",
        "transition-colors duration-500 ease-out",
        selected
          ? "border-gold-300/70 bg-[linear-gradient(180deg,rgba(48,34,18,0.90)_0%,rgba(14,9,5,0.95)_100%)]"
          : "border-gold-500/30 hover:border-gold-300/[0.55]",
      ].join(" ")}
    >
      {/* warm wash that lifts on hover and stays lit when chosen */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_28%,rgba(212,168,83,0.16),transparent_72%)]",
          "transition-opacity duration-500 ease-out",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-90",
        ].join(" ")}
      />

      {/* hairline sheen along the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(246,227,184,0.55),transparent)] opacity-60"
      />

      <span
        aria-hidden
        className={[
          "relative grid flex-1 place-items-center transition-colors duration-500",
          selected
            ? "text-gold-100"
            : "text-gold-300 group-hover:text-gold-200",
        ].join(" ")}
      >
        <ActivityIcon id={activity.id} className="h-11 w-11 sm:h-12 sm:w-12" />
      </span>

      <span className="relative mt-3 block w-full">
        <span
          className={[
            "block font-body text-sm transition-colors duration-500 sm:text-[0.95rem]",
            selected ? "text-sand-100" : "text-sand-200",
          ].join(" ")}
        >
          {activity.label}
        </span>

        {/* the underline is the state, not decoration: short at rest, full when chosen */}
        <span
          aria-hidden
          className={[
            "mx-auto mt-2.5 block h-[2px] rounded-full bg-gold-bar transition-all duration-500 ease-out",
            selected ? "w-12 opacity-100" : "w-6 opacity-70 group-hover:w-9",
          ].join(" ")}
        />

        {/* the hint is the accessible name's detail; revealed on hover, never a layout jump */}
        <span
          aria-hidden
          className="mt-2 hidden max-h-0 overflow-hidden font-body text-[0.7rem] font-light leading-4 text-sand-400 opacity-0 transition-all duration-500 ease-out group-hover:max-h-8 group-hover:opacity-100 group-focus-visible:max-h-8 group-focus-visible:opacity-100 lg:block"
        >
          {activity.hint}
        </span>
      </span>

      <span className="sr-only">{activity.hint}</span>

      <AnimatePresence>
        {selected ? (
          <motion.span
            key="check"
            aria-hidden
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.32, ease: EASE_LUX }}
            className="absolute end-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-gold-bar text-ink-900 shadow-[0_6px_16px_-6px_rgba(212,168,83,0.9)]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
              <path
                d="m5 12.6 4.4 4.4L19 7.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
});

export default ActivityCard;
