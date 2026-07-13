/**
 * The monitoring layer's public surface.
 *
 * Stores, services and the two error boundaries import from here. Nothing else
 * in the codebase knows a monitoring provider exists, let alone which one.
 */
export { captureException, captureMessage, setPlace } from "./service";
export {
  RELEASE,
  BUILD_ID,
  BUILD_TIME,
  COMMIT_SHA,
  ENVIRONMENT,
} from "./context";
export type { Severity, MonitoringProvider, CapturedEvent } from "./types";
export { installGlobalHandlers } from "./global-handlers";
