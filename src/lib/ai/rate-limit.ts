const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;

const requestLog = new Map<string, number[]>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

export function checkRateLimit(userId: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const recent = (requestLog.get(userId) ?? []).filter(
    (timestamp) => timestamp > windowStart
  );

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0]!;
    return {
      allowed: false,
      retryAfterMs: Math.max(0, oldest + WINDOW_MS - now),
    };
  }

  recent.push(now);
  requestLog.set(userId, recent);
  return { allowed: true };
}

export function formatRetryAfter(retryAfterMs: number): string {
  const minutes = Math.ceil(retryAfterMs / 60_000);
  return minutes <= 1
    ? "1 minute"
    : `${minutes} minutes`;
}
