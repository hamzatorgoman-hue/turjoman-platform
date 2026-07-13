"use client";

import { useSyncExternalStore } from "react";
import type { ActivityId } from "./activities";

/**
 * The shared element's flight plan.
 *
 * The stage swaps scenes with `mode="wait"` — the outgoing scene is gone before
 * the incoming one mounts — so the travelling card cannot be a plain `layoutId`
 * pair: at no point do both ends exist at once. Instead the card is lifted out
 * of the flow into a layer that outlives the swap, and flies from the rect it
 * left to the rect the next scene offers.
 *
 * Origin is measured from the live DOM (the chosen card already carries
 * `data-selected`), so Task 02 needs no changes. Destination is reported by
 * whatever slot the next scene puts on stage.
 */
export type FlightStatus = "idle" | "lifted" | "flying" | "landed";

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type FlightState = {
  activity: ActivityId | null;
  origin: Rect | null;
  destination: Rect | null;
  status: FlightStatus;
};

const INITIAL: FlightState = {
  activity: null,
  origin: null,
  destination: null,
  status: "idle",
};

let state: FlightState = INITIAL;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function set(next: FlightState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): FlightState {
  return state;
}

function getServerSnapshot(): FlightState {
  return INITIAL;
}

export function useFlight(): FlightState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Lift the chosen card out of the scene, holding the rect it occupied. */
export function liftActivity(activity: ActivityId, origin: Rect) {
  set({ activity, origin, destination: null, status: "lifted" });
}

/** The next scene offers a rect for the card to land in. */
export function setFlightDestination(destination: Rect) {
  // Only a lifted or in-flight card accepts a destination — a resize after
  // landing must not put the card back in the air.
  if (!state.origin) return;
  if (state.status !== "lifted" && state.status !== "flying") return;
  set({ ...state, destination, status: "flying" });
}

/** The card has arrived; the destination slot takes over rendering it. */
export function completeFlight() {
  if (state.status !== "flying") return;
  set({ ...state, status: "landed" });
}

export function resetFlight() {
  set(INITIAL);
}

export function rectOf(element: Element): Rect {
  const box = element.getBoundingClientRect();
  return {
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
  };
}
