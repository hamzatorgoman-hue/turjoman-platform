"use client";

import { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Style } from "@/lib/styles";
import { EASE_LUX } from "@/lib/motion";
import StyleTile from "./StyleTile";

type Props = {
  style: Style;
  selected: boolean;
  /** Roving tabindex: one tab stop for the whole group. */
  tabbable: boolean;
  onSelect: (style: Style) => void;
  onFocus: (style: Style) => void;
};

const StyleCard = forwardRef<HTMLButtonElement, Props>(function StyleCard(
  { style, selected, tabbable, onSelect, onFocus },
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
      onClick={() => onSelect(style)}
      onFocus={() => onFocus(style)}
      whileHover={reduced ? undefined : { y: -6 }}
      whileTap={reduced ? undefined : { y: -2, scale: 0.99 }}
      transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.75 }}
      data-selected={selected || undefined}
      className={[
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border text-start",
        "bg-[linear-gradient(180deg,rgba(22,16,11,0.85)_0%,rgba(9,6,4,0.94)_100%)]",
        "shadow-panel backdrop-blur-[6px] transition-[border-color,box-shadow] duration-500 ease-out",
        selected
          ? "border-gold-300/75 shadow-[0_0_0_1px_rgba(212,168,83,0.35),0_36px_80px_-40px_rgba(212,168,83,0.45)]"
          : "border-gold-500/[0.22] hover:border-gold-300/[0.5]",
      ].join(" ")}
    >
      {/* the board itself */}
      <span className="relative block aspect-[16/10] w-full overflow-hidden">
        <StyleTile
          id={style.id}
          className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
        />
        {/* warm light rakes across the board on hover */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_78%_0%,rgba(244,196,116,0.22),transparent_70%)]",
            "transition-opacity duration-[700ms] ease-out",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          ].join(" ")}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(9,6,4,0.92))]"
        />
      </span>

      <span className="relative flex flex-1 flex-col gap-2 px-5 pb-5 pt-4">
        <span
          className={[
            "font-display text-lg font-bold transition-colors duration-500",
            selected ? "text-sand-100" : "text-sand-200",
          ].join(" ")}
        >
          {style.label}
        </span>
        <span className="font-body text-[0.82rem] font-light leading-[1.9] text-sand-400">
          {style.line}
        </span>

        <span
          aria-hidden
          className={[
            "mt-2 block h-[2px] rounded-full bg-gold-bar transition-all duration-500 ease-out",
            selected ? "w-16 opacity-100" : "w-7 opacity-60 group-hover:w-11",
          ].join(" ")}
        />
      </span>

      <AnimatePresence>
        {selected ? (
          <>
            {/* confirmation: a single ring, expanding once, then gone */}
            {!reduced ? (
              <motion.span
                key="pulse"
                aria-hidden
                initial={{ opacity: 0.55, scale: 0.7 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 0.85, ease: EASE_LUX }}
                className="pointer-events-none absolute end-3 top-3 h-8 w-8 rounded-full border border-gold-200"
              />
            ) : null}

            <motion.span
              key="check"
              aria-hidden
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gold-bar text-ink-900 shadow-[0_8px_20px_-8px_rgba(212,168,83,0.95)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
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

            {/* soft glow that stays while chosen */}
            <motion.span
              key="glow"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_LUX }}
              className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(60%_50%_at_50%_100%,rgba(212,168,83,0.14),transparent_70%)]"
            />
          </>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
});

export default StyleCard;
