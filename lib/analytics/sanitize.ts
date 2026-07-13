import {
  ALLOWED_PROPERTIES,
  type EventProperties,
  type PropertyValue,
} from "./types";

const ALLOWED = new Set<string>(ALLOWED_PROPERTIES);

/** Nothing longer than this is business data. It is prose, and prose is personal. */
const MAX_STRING = 64;

/**
 * Privacy is enforced here, once, rather than trusted at fifteen call sites.
 *
 * Anything not on the allowlist is dropped. Strings are capped, because a long
 * string is not a category — it is a sentence somebody typed, and sentences are
 * where personal data hides.
 */
export function sanitize(properties: EventProperties): EventProperties {
  const clean: EventProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (!ALLOWED.has(key)) continue;
    if (value === undefined || value === null) continue;

    clean[key] = cap(value);
  }

  return clean;
}

function cap(value: PropertyValue): PropertyValue {
  if (typeof value === "string") return value.slice(0, MAX_STRING);
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  return value;
}
