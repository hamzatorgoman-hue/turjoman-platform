/**
 * Monitoring: the contract.
 *
 * The product reports *what broke and where in the journey* — never *who it broke
 * for*. Everything below is shaped by that line.
 */

export type Severity = "fatal" | "error" | "warning" | "info";

/** Where in the product a failure happened. Not who it happened to. */
export type MonitoringContext = {
  // which build this came from — a stack trace without this points at "a build"
  release: string;
  build_id: string;
  build_time: string;
  /** Empty when the build was made outside a VCS. */
  commit_sha?: string;
  environment: string;
  runtime: "browser" | "server";

  // place
  route?: string;
  scene?: string;
  journey_step?: string;

  // machine class — never a fingerprint
  browser?: string;
  os?: string;
  device?: "mobile" | "tablet" | "desktop";
  viewport?: string;
  language?: string;

  // correlation
  request_id?: string;
  reference?: string;
};

export type CapturedEvent = {
  severity: Severity;
  /** A stable, human name for the failure — grouped on this. */
  message: string;
  /** Present when there is a real exception behind it. */
  error?: Error;
  /** Small, redacted, non-personal. */
  extra?: Record<string, string | number | boolean>;
  context: MonitoringContext;
};

/**
 * A provider is a destination. It knows how to send an event and nothing about
 * Turjoman; Turjoman knows nothing about it.
 *
 * `capture` must never throw and must never block. A monitoring provider having
 * a bad day is not the founder's problem.
 */
export type MonitoringProvider = {
  readonly name: string;
  init: () => Promise<void>;
  capture: (event: CapturedEvent) => void;
};
