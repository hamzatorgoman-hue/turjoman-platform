"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, track } from "./analytics";
import { rememberChoice } from "./analytics/journey";
import type { VariantId } from "./identity-direction";

/**
 * Same lifecycle as every other scene. What is "selected" here is the direction
 * the founder commits to — the board they want to carry into the next step.
 */
export type IdentityPhase = "idle" | "selecting" | "handoff";

export type IdentityState = {
  selected: VariantId | null;
  phase: IdentityPhase;
};

export const IDENTITY_HANDOFF_DELAY_MS = 640;

const INITIAL: IdentityState = { selected: null, phase: "idle" };

let state: IdentityState = INITIAL;
const listeners = new Set<() => void>();
let handoffTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function set(next: IdentityState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): IdentityState {
  return state;
}

function getServerSnapshot(): IdentityState {
  return INITIAL;
}

export function useIdentity(): IdentityState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Commit to a direction, hold the confirm beat, then hand off. */
export function selectIdentity(
  id: VariantId,
  options?: { reduceMotion?: boolean },
) {
  if (handoffTimer) clearTimeout(handoffTimer);
  set({ selected: id, phase: "selecting" });

  rememberChoice({ direction: id });
  track(EVENTS.identityConfirmed, { direction: id });

  const delay = options?.reduceMotion ? 0 : IDENTITY_HANDOFF_DELAY_MS;
  handoffTimer = setTimeout(() => {
    set({ selected: id, phase: "handoff" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<VariantId>("turjoman:identity-selected", {
          detail: id,
        }),
      );
    }
  }, delay);
}

export function resetIdentity() {
  if (handoffTimer) clearTimeout(handoffTimer);
  set(INITIAL);
}
