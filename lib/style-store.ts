"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, track } from "./analytics";
import { rememberChoice } from "./analytics/journey";
import type { StyleId } from "./styles";

/**
 * Identical lifecycle to the activity and personality stores. Every scene in
 * the flow ends the same way, so the stage never needs to learn a new word.
 */
export type StylePhase = "idle" | "selecting" | "handoff";

export type StyleState = {
  selected: StyleId | null;
  phase: StylePhase;
};

export const STYLE_HANDOFF_DELAY_MS = 560;

const INITIAL: StyleState = { selected: null, phase: "idle" };

let state: StyleState = INITIAL;
const listeners = new Set<() => void>();
let handoffTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function set(next: StyleState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StyleState {
  return state;
}

function getServerSnapshot(): StyleState {
  return INITIAL;
}

export function useStyle(): StyleState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Store the choice, hold the confirm beat, then hand off to the next scene. */
export function selectStyle(id: StyleId, options?: { reduceMotion?: boolean }) {
  if (handoffTimer) clearTimeout(handoffTimer);
  set({ selected: id, phase: "selecting" });

  rememberChoice({ style: id });
  track(EVENTS.styleSelected, { style: id });

  const delay = options?.reduceMotion ? 0 : STYLE_HANDOFF_DELAY_MS;
  handoffTimer = setTimeout(() => {
    set({ selected: id, phase: "handoff" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<StyleId>("turjoman:style-selected", { detail: id }),
      );
    }
  }, delay);
}

export function resetStyle() {
  if (handoffTimer) clearTimeout(handoffTimer);
  set(INITIAL);
}
