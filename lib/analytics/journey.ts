"use client";

import type { EventProperties } from "./types";

/**
 * The funnel, carried on every event.
 *
 * The business question is never "how many people clicked مطعم" — it is "how many
 * people who chose مطعم reached the order form". Answering that in a dashboard
 * means every event needs to know where the founder has already been.
 *
 * So each store records its choice here as it is made, and the service merges
 * this into every payload. Only the allowlisted dimensions live here — never a
 * name, a number, or a note.
 */
type Journey = {
  activity?: string;
  personality?: string;
  style?: string;
  direction?: string;
  package?: string;
};

let journey: Journey = {};

export function rememberChoice(patch: Journey) {
  journey = { ...journey, ...patch };
}

export function journeyContext(): EventProperties {
  return { ...journey };
}

/** Test seam. Not used by the application. */
export function __resetJourney() {
  journey = {};
}
