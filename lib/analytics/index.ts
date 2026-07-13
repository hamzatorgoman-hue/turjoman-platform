/**
 * The analytics layer's public surface.
 *
 * Stores import from here. Components import nothing at all — the UI has no
 * knowledge that analytics exists, let alone which provider is behind it.
 */
export { track, trackOnce, startAnalytics } from "./service";
export {
  EVENTS,
  EVENT_PREFIX,
  type EventName,
  type EventProperties,
} from "./types";
