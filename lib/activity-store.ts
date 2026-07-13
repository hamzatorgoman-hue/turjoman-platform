"use client";

import { useSyncExternalStore } from "react";
import type { ActivityId } from "./activities";
import { EVENTS, track } from "./analytics";
import { rememberChoice } from "./analytics/journey";

/**
 * Selection state lives outside the component tree, so the Hero never has to
 * host a provider and Task 03 can subscribe from anywhere.
 *
 * phase:
 *   idle      → nothing chosen
 *   selecting → a card was clicked; the card plays its confirm beat
 *   handoff   → the transition that Task 03 will hang the next step off
 */
export type ActivityPhase = "idle" | "selecting" | "handoff";

export type ActivityState = {
  selected: ActivityId | null;
  phase: ActivityPhase;
};

/** Time the chosen card holds its confirm state before the handoff fires. */
export const HANDOFF_DELAY_MS = 420;

let state: ActivityState = { selected: null, phase: "idle" };
const listeners = new Set<() => void>();
let handoffTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function set(next: ActivityState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ActivityState {
  return state;
}

/** Server render always starts idle — selection is a client interaction. */
const SERVER_STATE: ActivityState = { selected: null, phase: "idle" };
function getServerSnapshot(): ActivityState {
  return SERVER_STATE;
}

/**
 * Select an activity and schedule the handoff.
 * Task 03 hangs off `phase === "handoff"` — nothing else in the app needs to change.
 */
export function selectActivity(
  id: ActivityId,
  options?: { reduceMotion?: boolean },
) {
  if (handoffTimer) clearTimeout(handoffTimer);
  set({ selected: id, phase: "selecting" });

  rememberChoice({ activity: id });
  track(EVENTS.activitySelected, { activity: id });

  const delay = options?.reduceMotion ? 0 : HANDOFF_DELAY_MS;
  handoffTimer = setTimeout(() => {
    set({ selected: id, phase: "handoff" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<ActivityId>("turjoman:activity-selected", {
          detail: id,
        }),
      );
    }
  }, delay);
}

/** Clears the selection — used when the next step is dismissed (Task 03). */
export function resetActivity() {
  if (handoffTimer) clearTimeout(handoffTimer);
  set({ selected: null, phase: "idle" });
}

export function useActivity(): ActivityState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
