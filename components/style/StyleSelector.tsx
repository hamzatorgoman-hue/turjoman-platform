"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { STYLES, type Style } from "@/lib/styles";
import { selectStyle, useStyle } from "@/lib/style-store";
import { riseIn, stage } from "@/lib/motion";
import StyleCard from "./StyleCard";

/**
 * Six directions, one answer — a radio group: a single tab stop, arrows to move.
 * RTL is the reading order, so ArrowLeft moves the ring left, which is forward.
 * Up/Down step by a row, with the row width read from the viewport rather than
 * assumed, so the grid navigates as a grid at every breakpoint.
 */
export default function StyleSelector() {
  const { selected, phase } = useStyle();
  const reduced = useReducedMotion();
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const tabbableIndex = selected
    ? STYLES.findIndex((style) => style.id === selected)
    : focusedIndex;

  const columns = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 640px)").matches) return 2;
    return 1;
  }, []);

  const focusCard = useCallback((index: number) => {
    const bounded = (index + STYLES.length) % STYLES.length;
    setFocusedIndex(bounded);
    cardRefs.current[bounded]?.focus();
  }, []);

  const handleSelect = useCallback(
    (style: Style) => {
      selectStyle(style.id, { reduceMotion: Boolean(reduced) });
    },
    [reduced],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = tabbableIndex;
    const step = columns();

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        focusCard(current + 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        focusCard(current - 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusCard(current + step);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusCard(current - step);
        break;
      case "Home":
        event.preventDefault();
        focusCard(0);
        break;
      case "End":
        event.preventDefault();
        focusCard(STYLES.length - 1);
        break;
      default:
        break;
    }
  };

  const chosen = STYLES.find((style) => style.id === selected);

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {chosen && phase !== "idle"
          ? `تم اختيار الأسلوب ${chosen.label}. جارٍ فتح الخطوة التالية.`
          : ""}
      </p>

      <motion.div
        variants={stage}
        role="radiogroup"
        aria-label="اختر أسلوب هويتك"
        onKeyDown={onKeyDown}
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      >
        {STYLES.map((style, index) => (
          <motion.div key={style.id} variants={riseIn} className="h-full">
            <StyleCard
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              style={style}
              selected={selected === style.id}
              tabbable={index === tabbableIndex}
              onSelect={handleSelect}
              onFocus={() => setFocusedIndex(index)}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
