"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, trackOnce } from "./analytics";
import type { EventName } from "./analytics";
import { captureMessage, installGlobalHandlers, setPlace } from "./monitoring";
import type { SceneDirection } from "./scene-motion";

/**
 * The flow is one continuous experience. There is no router, no URL change and
 * no page: a single stage, and one scene on it at a time.
 *
 * Scenes are declared here in order, so `advance()` and `back()` are meaningful
 * before the later scenes exist. A scene only takes the stage once it has been
 * registered by a mounted <Scene>; until then the request is held as `pending`
 * and fires the moment that scene lands. Nothing ever cuts to an empty stage.
 */
export type SceneId =
  | "hero"
  | "personality"
  | "style"
  | "identity"
  | "mockups"
  | "deliverables"
  | "packages"
  | "order";

export const SCENE_ORDER: SceneId[] = [
  "hero",
  "personality",
  "style",
  "identity",
  "mockups",
  "deliverables",
  "packages",
  "order",
];

export type SceneState = {
  active: SceneId;
  /** Requested but not yet mounted — the stage holds until it registers. */
  pending: SceneId | null;
  direction: SceneDirection;
  history: SceneId[];
};

const INITIAL: SceneState = {
  active: "hero",
  pending: null,
  direction: "forward",
  history: [],
};

let state: SceneState = INITIAL;
const registered = new Set<SceneId>(["hero"]);
const listeners = new Set<() => void>();

/**
 * The scenes worth counting. A view is "the founder arrived here", so it fires
 * once per session — a founder who steps back and forward has not discovered the
 * packages twice.
 */
const VIEW_EVENTS: Partial<Record<SceneId, EventName>> = {
  hero: EVENTS.heroViewed,
  mockups: EVENTS.mockupsViewed,
  deliverables: EVENTS.deliverablesViewed,
  packages: EVENTS.packagesViewed,
};

function announce(scene: SceneId) {
  setPlace({ scene, journeyStep: scene });
  const event = VIEW_EVENTS[scene];
  if (event) trackOnce(event, { scene });
}

// The hero is on stage the moment this module runs in the browser. Nothing else
// has to remember to say so — and this is the earliest point at which the global
// error handlers can exist, which is where they belong.
if (typeof window !== "undefined") {
  installGlobalHandlers();
  setPlace({ scene: "hero", journeyStep: "hero" });
  announce("hero");
}

function emit() {
  for (const listener of listeners) listener();
}

function set(next: SceneState) {
  const changed = next.active !== state.active;
  state = next;
  if (changed) announce(next.active);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): SceneState {
  return state;
}

function getServerSnapshot(): SceneState {
  return INITIAL;
}

export function useScene(): SceneState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Called by <Scene> on mount. If the stage was waiting on this scene, it takes
 * over immediately — which is how a later task plugs in with no wiring.
 */
export function registerScene(id: SceneId): () => void {
  registered.add(id);

  if (state.pending === id) {
    set({
      active: id,
      pending: null,
      direction: "forward",
      history: [...state.history, state.active],
    });
  }

  return () => {
    registered.delete(id);
  };
}

/** Move the stage to a scene. Holds as `pending` if that scene isn't mounted yet. */
export function goToScene(id: SceneId, direction: SceneDirection = "forward") {
  if (id === state.active) return;

  if (!registered.has(id)) {
    set({ ...state, pending: id });
    return;
  }

  set({
    active: id,
    pending: null,
    direction,
    history:
      direction === "forward"
        ? [...state.history, state.active]
        : state.history,
  });
}

/** Next scene in the flow. */
export function advanceScene() {
  const index = SCENE_ORDER.indexOf(state.active);
  const next = SCENE_ORDER[index + 1];

  if (!next) {
    // The flow asked to move past its own end. Nothing breaks — the stage simply
    // stays — but it means a scene handed off when it should not have, and that
    // is worth knowing before a founder tells us.
    captureMessage("Advance requested past the end of the flow", {
      severity: "warning",
      extra: { scene: state.active },
    });
    return;
  }

  goToScene(next, "forward");
}

/** Back one step, mirroring the depth of the move that brought us here. */
export function backScene() {
  const previous = state.history[state.history.length - 1];
  if (!previous) return;

  set({
    active: previous,
    pending: null,
    direction: "back",
    history: state.history.slice(0, -1),
  });
}
