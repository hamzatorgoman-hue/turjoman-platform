import type { MonitoringProvider } from "../types";

/**
 * The default. No DSN configured means nothing is loaded, nothing is sent, and
 * no request leaves the browser or the server.
 */
export const noopMonitoringProvider: MonitoringProvider = {
  name: "noop",
  init: async () => {},
  capture: () => {},
};
