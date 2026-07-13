import type { AnalyticsProvider } from "../types";

/**
 * The default.
 *
 * No measurement id configured means nothing is loaded, nothing is sent, and no
 * cookie is written. Privacy by default is not a setting here — it is what
 * happens when nobody configures anything.
 */
export const noopProvider: AnalyticsProvider = {
  name: "noop",
  init: async () => {},
  track: () => {},
};
