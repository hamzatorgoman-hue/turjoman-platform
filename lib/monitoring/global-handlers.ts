"use client";

import { captureException, captureMessage } from "./service";

/**
 * The failures nobody wrote a `catch` for.
 *
 * React's error boundaries only see errors thrown during render. An exception in
 * an event handler, a rejected promise nobody awaited, a long task that freezes
 * the phone in the founder's hand — none of those reach a boundary, and all of
 * them are how a journey actually breaks.
 */

let installed = false;

/** A frame is 16ms. Anything over 200ms is a stutter the founder can feel. */
const LONG_TASK_MS = 200;

export function installGlobalHandlers() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (event) => {
    captureException(event.error ?? event.message, {
      message: "Unhandled error",
      extra: {
        source: event.filename,
        line: event.lineno,
        column: event.colno,
      },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    captureException(event.reason, { message: "Unhandled promise rejection" });
  });

  observeLongTasks();
}

function observeLongTasks() {
  if (typeof PerformanceObserver === "undefined") return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration < LONG_TASK_MS) continue;

        captureMessage("Long task blocked the main thread", {
          severity: "warning",
          extra: { duration_ms: Math.round(entry.duration) },
        });
      }
    });

    observer.observe({ type: "longtask", buffered: true });
  } catch {
    // Safari has no longtask observer. That is not an error worth reporting.
  }
}
