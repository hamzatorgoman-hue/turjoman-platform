/**
 * Analytics: the contract.
 *
 * Every event in the product is named here, and every name carries the same
 * prefix. A stray `button_click` from a future task is a compile error, not a
 * mystery in a dashboard six months later.
 */

export const EVENT_PREFIX = "turjoman." as const;

export const EVENTS = {
  heroViewed: "turjoman.hero_viewed",
  activitySelected: "turjoman.activity_selected",
  personalitySelected: "turjoman.personality_selected",
  styleSelected: "turjoman.style_selected",
  identityVariantChanged: "turjoman.identity_variant_changed",
  identityConfirmed: "turjoman.identity_confirmed",
  mockupsViewed: "turjoman.mockups_viewed",
  deliverablesViewed: "turjoman.deliverables_viewed",
  packagesViewed: "turjoman.packages_viewed",
  packageSelected: "turjoman.package_selected",
  orderSubmitted: "turjoman.order_submitted",
  orderSaved: "turjoman.order_saved",
  whatsappOpened: "turjoman.whatsapp_opened",
  orderFailed: "turjoman.order_failed",
  validationFailed: "turjoman.validation_failed",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/** Values a property may hold. No objects, no arrays of objects, no free text. */
export type PropertyValue = string | number | boolean;

export type EventProperties = Record<string, PropertyValue | undefined>;

/**
 * The **only** properties this product is allowed to send.
 *
 * This is an allowlist, not a blocklist, and that is the whole point: a blocklist
 * has to imagine every mistake in advance. Anything not named here is dropped
 * before it reaches a provider — including anything a future task adds without
 * thinking.
 *
 * There is no key here for a name, a phone number, or a note, and there never
 * will be.
 */
export const ALLOWED_PROPERTIES = [
  // the founder's choices — the business questions this exists to answer
  "activity",
  "personality",
  "style",
  "direction",
  "package",
  "package_price",
  "reference",
  // outcome detail
  "failure_code",
  "invalid_fields",
  "platform",
  "scene",
  // ambient context, attached to every event
  "device",
  "viewport_width",
  "viewport_height",
  "language",
] as const;

export type AllowedProperty = (typeof ALLOWED_PROPERTIES)[number];

/**
 * A provider is a destination. It knows how to load itself and how to send an
 * event; it knows nothing about Turjoman, and Turjoman knows nothing about it.
 */
export type AnalyticsProvider = {
  readonly name: string;
  /** Loads whatever it needs. Called once, off the critical path. */
  init: () => Promise<void>;
  /** Best effort. Must never throw. */
  track: (event: EventName, properties: EventProperties) => void;
};
