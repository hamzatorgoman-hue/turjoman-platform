/**
 * A small, honest rate limiter.
 *
 * In-memory and per-instance: on a serverless platform each instance keeps its
 * own window, so the effective limit is (limit × warm instances). That is not a
 * flaw to hide — it is enough to stop a bored script hammering the order endpoint
 * from one machine, and it is *not* enough to stop a distributed flood. If that
 * day comes, this is the seam to swap for Upstash or Vercel KV; nothing else
 * changes.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Bound the map: a leak here is a memory leak in a long-lived server. */
const MAX_KEYS = 5_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_KEYS) sweep(now);

    windows.set(key, { count: 1, resetAt: now + options.windowMs });
    return {
      allowed: true,
      remaining: options.limit - 1,
      retryAfterSeconds: 0,
    };
  }

  existing.count += 1;

  if (existing.count > options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      ),
    };
  }

  return {
    allowed: true,
    remaining: options.limit - existing.count,
    retryAfterSeconds: 0,
  };
}

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }

  // Still full of live windows: drop the oldest rather than grow without bound.
  if (windows.size >= MAX_KEYS) {
    const oldest = [...windows.entries()].sort(
      (a, b) => a[1].resetAt - b[1].resetAt,
    );
    for (const [key] of oldest.slice(0, Math.floor(MAX_KEYS / 4)))
      windows.delete(key);
  }
}

/** The caller's address, as far as we can honestly determine it. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || real || "unknown";
  return ip;
}
