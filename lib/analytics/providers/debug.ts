import type { AnalyticsProvider, EventName, EventProperties } from "../types";

/**
 * Development only. Prints exactly what a real provider would have received —
 * after the allowlist has run — so what you see locally is what would leave the
 * browser in production.
 */
export const debugProvider: AnalyticsProvider = {
  name: "debug",
  init: async () => {},
  track: (event: EventName, properties: EventProperties) => {
    console.warn("[analytics]", event, properties);
  },
};
