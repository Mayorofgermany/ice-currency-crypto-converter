// In-memory sliding window rate limiter for brute-force and anti-scraping protection

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

/**
 * Check if a given action key has exceeded the limit in the sliding window.
 * @param key Identifier (e.g. `ip:login:127.0.0.1` or `search:127.0.0.1`)
 * @param maxLimit Maximum allowed attempts within windowMs
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 min)
 */
export function checkRateLimit(
  key: string,
  maxLimit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxLimit) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxLimit - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}
