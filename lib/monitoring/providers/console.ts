import type { CapturedEvent, MonitoringProvider } from "../types";

/**
 * Development. Prints exactly what a real provider would have received — after
 * redaction — so what you read locally is what would leave the process in
 * production.
 */
export const consoleMonitoringProvider: MonitoringProvider = {
  name: "console",
  init: async () => {},
  capture: (event: CapturedEvent) => {
    console.error(
      `[monitoring:${event.severity}]`,
      event.message,
      { context: event.context, extra: event.extra },
      event.error?.stack ?? "",
    );
  },
};
