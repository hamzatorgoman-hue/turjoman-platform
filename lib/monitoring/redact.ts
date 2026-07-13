/**
 * Redaction, before anything leaves the process.
 *
 * Stack traces and error messages are where personal data escapes: a validation
 * error that quotes the value, a fetch error that echoes the body, a Postgres
 * message that includes the row. So every string is scrubbed on the way out —
 * not the ones we expect to be dangerous, all of them.
 */

const PATTERNS: Array<[RegExp, string]> = [
  // Saudi mobile numbers, in any of the shapes this product produces.
  [/\+?9665\d{8}/g, "[phone]"],
  [/\b05\d{8}\b/g, "[phone]"],
  // Any long run of digits is either a phone, an id, or a mistake.
  [/\b\d{9,}\b/g, "[number]"],
  [/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]"],
  // Supabase / Sentry keys, if one ever lands in a message.
  [/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, "[token]"],
  [/sb[a-z]?_[A-Za-z0-9_-]{16,}/g, "[token]"],
  [/https?:\/\/[^\s"']*sentry[^\s"']*/g, "[sentry-url]"],
];

/** The form fields that may never appear in telemetry, in any spelling. */
const FORBIDDEN_KEYS = [
  "projectname",
  "project_name",
  "fullname",
  "full_name",
  "customer_name",
  "customername",
  "name",
  "phone",
  "mobile",
  "notes",
  "note",
  "message",
  "email",
];

const MAX_STRING = 500;

export function redactString(input: string): string {
  let out = input.slice(0, MAX_STRING);
  for (const [pattern, replacement] of PATTERNS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Extras are an allowlist by exclusion: known-personal keys never survive. */
export function redactExtra(
  extra: Record<string, unknown> | undefined,
): Record<string, string | number | boolean> {
  if (!extra) return {};

  const clean: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(extra)) {
    if (FORBIDDEN_KEYS.includes(key.toLowerCase())) continue;

    if (typeof value === "string") clean[key] = redactString(value);
    else if (typeof value === "number" && Number.isFinite(value))
      clean[key] = value;
    else if (typeof value === "boolean") clean[key] = value;
    // Everything else — objects, arrays, functions — is dropped. If it cannot be
    // written as one scalar, it has no business in a crash report.
  }

  return clean;
}
