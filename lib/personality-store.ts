"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, track } from "./analytics";
import { rememberChoice } from "./analytics/journey";
import type { PersonalityId } from "./personalities";

/**
 * Same contract as the activity store, deliberately: every scene in the flow
 * ends the same way — a choice, a confirm beat, then `handoff`. The stage and
 * any later scene only ever need to know about that one word.
 */
export type PersonalityPhase = "idle" | "selecting" | "handoff";

export type PersonalityState = {
  selected: PersonalityId | null;
  phase: PersonalityPhase;
};

export const PERSONALITY_HANDOFF_DELAY_MS = 520;

const INITIAL: PersonalityState = { selected: null, phase: "idle" };

let state: PersonalityState = INITIAL;
const listeners = new Set<() => void>();
let handoffTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function set(next: PersonalityState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): PersonalityState {
  return state;
}

function getServerSnapshot(): PersonalityState {
  return INITIAL;
}

export function usePersonality(): PersonalityState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Store the choice, hold the confirm beat, then hand off to the next scene. */
export function selectPersonality(
  id: PersonalityId,
  options?: { reduceMotion?: boolean },
) {
  if (handoffTimer) clearTimeout(handoffTimer);
  set({ selected: id, phase: "selecting" });

  rememberChoice({ personality: id });
  track(EVENTS.personalitySelected, { personality: id });

  const delay = options?.reduceMotion ? 0 : PERSONALITY_HANDOFF_DELAY_MS;
  handoffTimer = setTimeout(() => {
    set({ selected: id, phase: "handoff" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<PersonalityId>("turjoman:personality-selected", {
          detail: id,
        }),
      );
    }
  }, delay);
}

export function resetPersonality() {
  if (handoffTimer) clearTimeout(handoffTimer);
  set(INITIAL);
}
