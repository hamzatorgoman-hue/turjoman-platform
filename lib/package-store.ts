"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, track } from "./analytics";
import { rememberChoice } from "./analytics/journey";
import { getPackage, type PackageId } from "./packages";

/**
 * Same lifecycle as every scene before it. What is selected here is the package
 * the founder commits to; the order scene picks it up from the store.
 */
export type PackagePhase = "idle" | "selecting" | "handoff";

export type PackageState = {
  selected: PackageId | null;
  phase: PackagePhase;
};

export const PACKAGE_HANDOFF_DELAY_MS = 600;

const INITIAL: PackageState = { selected: null, phase: "idle" };

let state: PackageState = INITIAL;
const listeners = new Set<() => void>();
let handoffTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function set(next: PackageState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): PackageState {
  return state;
}

function getServerSnapshot(): PackageState {
  return INITIAL;
}

export function usePackage(): PackageState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Commit to a package, hold the confirm beat, then hand off. */
export function selectPackage(
  id: PackageId,
  options?: { reduceMotion?: boolean },
) {
  if (handoffTimer) clearTimeout(handoffTimer);
  set({ selected: id, phase: "selecting" });

  rememberChoice({ package: id });
  track(EVENTS.packageSelected, {
    package: id,
    package_price: getPackage(id).price,
  });

  const delay = options?.reduceMotion ? 0 : PACKAGE_HANDOFF_DELAY_MS;
  handoffTimer = setTimeout(() => {
    set({ selected: id, phase: "handoff" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<PackageId>("turjoman:package-selected", { detail: id }),
      );
    }
  }, delay);
}

export function resetPackage() {
  if (handoffTimer) clearTimeout(handoffTimer);
  set(INITIAL);
}
