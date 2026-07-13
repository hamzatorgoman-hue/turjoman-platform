/**
 * Typed results. Nothing in this codebase throws a raw error into the UI.
 *
 * A failure is a value: it has a code the caller can branch on, a message that is
 * safe to show a founder, and an honest answer to "is it worth trying again?".
 */

export type Ok<T> = { ok: true; data: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(data: T): Ok<T> {
  return { ok: true, data };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

/**
 * The only failure codes the order flow can produce. Anything unexpected is
 * mapped to `unknown` — the UI is never handed a stack trace or a Postgres code.
 */
export type FailureCode =
  | "validation" // the founder's input is incomplete or malformed
  | "offline" // the device has no connection
  | "timeout" // the request took too long
  | "network" // the request could not be made or completed
  | "server" // we reached the server and it failed
  | "config" // the environment is misconfigured (our fault, not theirs)
  | "blocked" // the browser refused to open WhatsApp (pop-up blocker, no handler)
  | "unknown";

export type Failure<TFields = unknown> = {
  code: FailureCode;
  /** Safe to display. Arabic, matching the product's voice. */
  message: string;
  /** Field-level detail for validation failures. */
  fields?: TFields;
  /** Whether the same request could reasonably succeed if repeated. */
  retryable: boolean;
};

export function failure<TFields = unknown>(
  code: FailureCode,
  message: string,
  options?: { fields?: TFields; retryable?: boolean },
): Failure<TFields> {
  return {
    code,
    message,
    fields: options?.fields,
    retryable:
      options?.retryable ?? (code !== "validation" && code !== "config"),
  };
}
