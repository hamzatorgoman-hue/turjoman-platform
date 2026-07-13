"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PERSONALITIES, type Personality } from "@/lib/personalities";
import { selectPersonality, usePersonality } from "@/lib/personality-store";
import { riseIn, stage } from "@/lib/motion";
import PersonalityCard from "./PersonalityCard";

const COLUMNS = { base: 1, sm: 2, lg: 4 };

/**
 * Eight tones, one answer — so it is a radio group, one tab stop, arrows to
 * move. RTL is the reading order: ArrowLeft always moves the ring left, which
 * in this direction means forward through the list.
 *
 * Up/Down step by a row, so the grid is navigable as a grid rather than a
 * flattened list. The row width is read from the viewport, not assumed.
 */
export default function PersonalitySelector() {
  const { selected, phase } = usePersonality();
  const reduced = useReducedMotion();
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const tabbableIndex = selected
    ? PERSONALITIES.findIndex((personality) => personality.id === selected)
    : focusedIndex;

  const columns = useCallback(() => {
    if (typeof window === "undefined") return COLUMNS.lg;
    if (window.matchMedia("(min-width: 1024px)").matches) return COLUMNS.lg;
    if (window.matchMedia("(min-width: 640px)").matches) return COLUMNS.sm;
    return COLUMNS.base;
  }, []);

  const focusCard = useCallback((index: number) => {
    const bounded = (index + PERSONALITIES.length) % PERSONALITIES.length;
    setFocusedIndex(bounded);
    cardRefs.current[bounded]?.focus();
  }, []);

  const handleSelect = useCallback(
    (personality: Personality) => {
      selectPersonality(personality.id, { reduceMotion: Boolean(reduced) });
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
        focusCard(PERSONALITIES.length - 1);
        break;
      default:
        break;
    }
  };

  const chosen = PERSONALITIES.find(
    (personality) => personality.id === selected,
  );

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {chosen && phase !== "idle"
          ? `تم اختيار الشخصية ${chosen.label}. جارٍ فتح الخطوة التالية.`
          : ""}
      </p>

      <motion.div
        variants={stage}
        role="radiogroup"
        aria-label="اختر شخصية علامتك"
        onKeyDown={onKeyDown}
        className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PERSONALITIES.map((personality, index) => (
          <motion.div key={personality.id} variants={riseIn} className="h-full">
            <PersonalityCard
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              personality={personality}
              selected={selected === personality.id}
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
