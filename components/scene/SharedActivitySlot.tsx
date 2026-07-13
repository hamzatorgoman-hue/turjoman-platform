"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import ActivityIcon from "@/components/activities/ActivityIcon";
import { getActivity } from "@/lib/activities";
import { rectOf, setFlightDestination, useFlight } from "@/lib/shared-flight";

/**
 * Where the travelling card lands. A scene drops this anywhere in its layout;
 * the slot measures itself, hands the rect to the flight layer, and stays empty
 * until the card arrives — so the card is never on screen twice.
 */
export default function SharedActivitySlot({
  className,
}: {
  className?: string;
}) {
  const { activity, status } = useFlight();
  const ref = useRef<HTMLDivElement | null>(null);

  const report = useCallback(() => {
    if (ref.current) setFlightDestination(rectOf(ref.current));
  }, []);

  useLayoutEffect(() => {
    report();
    window.addEventListener("resize", report);
    return () => window.removeEventListener("resize", report);
  }, [report]);

  const landed = status === "landed" && activity;
  const chosen = landed ? getActivity(activity) : null;

  return (
    <div
      ref={ref}
      className={["h-[10.5rem] w-[7.6rem]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {chosen ? (
        <div className="flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-gold-300/70 bg-[linear-gradient(180deg,rgba(48,34,18,0.92)_0%,rgba(14,9,5,0.96)_100%)] px-3 pb-4 pt-5 text-center shadow-panel">
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
      ) : null}
    </div>
  );
}
