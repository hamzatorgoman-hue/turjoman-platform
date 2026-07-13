"use client";

import { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Personality } from "@/lib/personalities";
import { EASE_LUX } from "@/lib/motion";
import PersonalityGlyph from "./PersonalityGlyph";

type Props = {
  personality: Personality;
  selected: boolean;
  /** Roving tabindex: one tab stop for the whole group. */
  tabbable: boolean;
  onSelect: (personality: Personality) => void;
  onFocus: (personality: Personality) => void;
};

const PersonalityCard = forwardRef<HTMLButtonElement, Props>(
  function PersonalityCard(
    { personality, selected, tabbable, onSelect, onFocus },
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
        onClick={() => onSelect(personality)}
        onFocus={() => onFocus(personality)}
        whileHover={reduced ? undefined : { y: -5 }}
        whileTap={reduced ? undefined : { y: -1, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 250, damping: 26, mass: 0.7 }}
        data-selected={selected || undefined}
        className={[
          "group relative flex h-full w-full flex-col items-start gap-3 overflow-hidden rounded-2xl border",
          "bg-[linear-gradient(180deg,rgba(26,19,13,0.82)_0%,rgba(9,6,4,0.92)_100%)]",
          "p-5 text-start shadow-panel backdrop-blur-[6px] transition-colors duration-500 ease-out",
          selected
            ? "border-gold-300/70 bg-[linear-gradient(180deg,rgba(48,34,18,0.90)_0%,rgba(14,9,5,0.95)_100%)]"
            : "border-gold-500/[0.22] hover:border-gold-300/[0.5]",
        ].join(" ")}
      >
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(212,168,83,0.14),transparent_70%)]",
            "transition-opacity duration-500 ease-out",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-90",
          ].join(" ")}
        />

        <span
          aria-hidden
          className={[
            "relative grid h-11 w-11 place-items-center rounded-xl border transition-colors duration-500",
            selected
              ? "border-gold-300/60 bg-ink-700/80 text-gold-100"
              : "border-gold-500/[0.26] bg-ink-700/60 text-gold-300 group-hover:text-gold-200",
          ].join(" ")}
        >
          <PersonalityGlyph id={personality.id} className="h-6 w-6" />
        </span>

        <span className="relative flex flex-col gap-1.5">
          <span
            className={[
              "font-display text-lg font-bold transition-colors duration-500",
              selected ? "text-sand-100" : "text-sand-200",
            ].join(" ")}
          >
            {personality.label}
          </span>
          <span className="font-body text-[0.8rem] font-light leading-6 text-sand-400">
            {personality.description}
          </span>
        </span>

        <span className="relative mt-auto flex flex-wrap gap-1.5 pt-1">
          {personality.keywords.map((keyword) => (
            <span
              key={keyword}
              className={[
                "rounded-full border px-2.5 py-1 font-body text-[0.68rem] font-light transition-colors duration-500",
                selected
                  ? "border-gold-300/45 text-gold-100"
                  : "border-gold-500/[0.2] text-sand-400 group-hover:text-sand-300",
              ].join(" ")}
            >
              {keyword}
            </span>
          ))}
        </span>

        <AnimatePresence>
          {selected ? (
            <motion.span
              key="check"
              aria-hidden
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.32, ease: EASE_LUX }}
              className="absolute end-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-gold-bar text-ink-900 shadow-[0_6px_16px_-6px_rgba(212,168,83,0.9)]"
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
  },
);

export default PersonalityCard;
