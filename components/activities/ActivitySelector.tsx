"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ACTIVITIES, type Activity } from "@/lib/activities";
import { selectActivity, useActivity } from "@/lib/activity-store";
import { riseIn, stage } from "@/lib/motion";
import ActivityCard from "./ActivityCard";

/**
 * The activity strip: six cards, one choice.
 *
 * Semantics are a radio group — six options, exactly one answer — so the whole
 * strip is a single tab stop and the arrows move between cards, which is what a
 * keyboard user expects here and what a list of six buttons would get wrong.
 *
 * RTL is the default reading order: `store` is the right-most card. The arrow
 * keys are mapped to what the eye sees, not to the array index, so ArrowLeft
 * always moves the focus ring left.
 */
export default function ActivitySelector() {
  const { selected, phase } = useActivity();
  const reduced = useReducedMotion();
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const tabbableIndex = selected
    ? ACTIVITIES.findIndex((activity) => activity.id === selected)
    : focusedIndex;

  const focusCard = useCallback((index: number) => {
    const bounded = (index + ACTIVITIES.length) % ACTIVITIES.length;
    setFocusedIndex(bounded);
    cardRefs.current[bounded]?.focus();
  }, []);

  const handleSelect = useCallback(
    (activity: Activity) => {
      // Stores the choice, then fires the handoff the next step hangs off.
      selectActivity(activity.id, { reduceMotion: Boolean(reduced) });
    },
    [reduced],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = tabbableIndex;

    switch (event.key) {
      // In RTL the next card is to the left, so the visual mapping is inverted.
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        focusCard(current + 1);
        break;
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        focusCard(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusCard(0);
        break;
      case "End":
        event.preventDefault();
        focusCard(ACTIVITIES.length - 1);
        break;
      default:
        break;
    }
  };

  const chosen = ACTIVITIES.find((activity) => activity.id === selected);

  return (
    <>
      {/* the choice is announced, not just shown */}
      <p aria-live="polite" className="sr-only">
        {chosen && phase !== "idle"
          ? `تم اختيار ${chosen.label}. جارٍ فتح الخطوة التالية.`
          : ""}
      </p>

      <motion.div
        variants={stage}
        role="radiogroup"
        aria-label="اختر نشاطك"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:flex lg:flex-nowrap lg:gap-4"
      >
        {ACTIVITIES.map((activity, index) => (
          <motion.div
            key={activity.id}
            variants={riseIn}
            className="h-[9.5rem] sm:h-[10.5rem] lg:h-[10.5rem] lg:w-[7.6rem] lg:shrink-0"
          >
            <ActivityCard
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              activity={activity}
              selected={selected === activity.id}
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
