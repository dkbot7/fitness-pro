import { Context, Next } from 'hono';

/**
 * Simple in-memory rate limiter for Cloudflare Workers
 * Uses a sliding window algorithm with IP-based tracking
 *
 * Note: For production with multiple workers, consider using:
 * - Cloudflare KV for distributed state
 * - Cloudflare Rate Limiting (Enterprise)
 * - Durable Objects for more complex rate limiting
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests (2xx)
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

// In-memory store (will reset when worker restarts)
const requestStore = new Map<string, RequestRecord>();

/**
 * Rate limiter middleware factory
 *
 * @example
 * // 100 requests per minute
 * app.use('/api/*', rateLimiter({ windowMs: 60000, maxRequests: 100 }))
 *
 * // 10 requests per minute for sensitive endpoints
 * app.post('/api/auth/*', rateLimiter({ windowMs: 60000, maxRequests: 10 }))
 */
export function rateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false,
  } = config;

  return async (c: Context, next: Next) => {
    // Get client identifier (IP address or user ID if authenticated)
    const clientIp = c.req.header('cf-connecting-ip') ||
                     c.req.header('x-forwarded-for') ||
                     c.req.header('x-real-ip') ||
                     'unknown';

    // Use authenticated user ID if available (more accurate than IP)
    const userId = c.get('userId');
    const identifier = userId || clientIp;

    // Create unique key for this endpoint + identifier
    const path = new URL(c.req.url).pathname;
    const key = `${identifier}:${path}`;

    const now = Date.now();
    const record = requestStore.get(key);

    // Clean up expired records (garbage collection)
    if (record && now > record.resetTime) {
      requestStore.delete(key);
    }

    // Initialize or get current record
    let currentRecord = requestStore.get(key);

    if (!currentRecord || now > currentRecord.resetTime) {
      // Create new window
      currentRecord = {
        count: 0,
        resetTime: now + windowMs,
      };
      requestStore.set(key, currentRecord);
    }

    // Check if limit exceeded
    if (currentRecord.count >= maxRequests) {
      const retryAfter = Math.ceil((currentRecord.resetTime - now) / 1000);

      return c.json(
        {
          error: message,
          retryAfter: `${retryAfter} seconds`,
        },
        429,
        {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(currentRecord.resetTime).toISOString(),
        }
      );
    }

    // Increment counter
    if (!skipSuccessfulRequests) {
      currentRecord.count++;
    }

    // Add rate limit headers
    const remaining = maxRequests - currentRecord.count;
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', new Date(currentRecord.resetTime).toISOString());

    // Execute handler
    await next();

    // If skipSuccessfulRequests, increment only on non-2xx responses
    if (skipSuccessfulRequests && c.res.status >= 200 && c.res.status < 300) {
      // Don't count this request
      currentRecord.count--;
    }
  };
}

/**
 * Cleanup function to remove old entries
 * Call periodically to prevent memory leaks
 */
export function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [key, record] of requestStore.entries()) {
    if (now > record.resetTime) {
      requestStore.delete(key);
    }
  }
}

/**
 * Preset configurations
 */
export const rateLimitPresets = {
  // Strict: 10 requests per minute
  strict: { windowMs: 60_000, maxRequests: 10 },

  // Standard: 60 requests per minute
  standard: { windowMs: 60_000, maxRequests: 60 },

  // Relaxed: 120 requests per minute
  relaxed: { windowMs: 60_000, maxRequests: 120 },

  // Authentication: 5 attempts per 15 minutes
  auth: { windowMs: 15 * 60_000, maxRequests: 5 },

  // Public API: 1000 requests per hour
  public: { windowMs: 60 * 60_000, maxRequests: 1000 },
};
