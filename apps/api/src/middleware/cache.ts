import { Context, Next } from 'hono';

/**
 * HTTP Response Caching Middleware for Cloudflare Workers
 * Uses Cloudflare's Cache API for edge caching
 */

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  cacheKey?: (c: Context) => string; // Custom cache key generator
  varyByUser?: boolean; // Include userId in cache key
  methods?: string[]; // HTTP methods to cache (default: GET only)
}

/**
 * Cache middleware factory
 *
 * @example
 * // Cache for 5 minutes
 * app.get('/api/exercises', cache({ ttl: 300 }), handler)
 *
 * // Cache per user for 1 minute
 * app.get('/api/users/me/stats', cache({ ttl: 60, varyByUser: true }), handler)
 */
export function cache(config: CacheConfig) {
  const {
    ttl,
    cacheKey: customCacheKey,
    varyByUser = false,
    methods = ['GET'],
  } = config;

  return async (c: Context, next: Next) => {
    // Only cache specified methods
    if (!methods.includes(c.req.method)) {
      return await next();
    }

    // Generate cache key
    const url = new URL(c.req.url);
    let cacheKey = url.toString();

    // Vary by user if requested
    if (varyByUser) {
      const userId = c.get('userId');
      if (userId) {
        cacheKey = `${cacheKey}:user:${userId}`;
      }
    }

    // Use custom cache key if provided
    if (customCacheKey) {
      cacheKey = customCacheKey(c);
    }

    // Create a cache key URL (must be valid URL for Cache API)
    const cacheKeyUrl = new URL(url);
    cacheKeyUrl.searchParams.set('__cache_key', cacheKey);

    // Try to get from cache
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheKeyUrl.toString());

    if (cachedResponse) {
      // Clone and add cache header
      const response = new Response(cachedResponse.body, cachedResponse);
      response.headers.set('X-Cache', 'HIT');
      return response;
    }

    // Execute handler
    await next();

    // Cache successful responses (2xx)
    if (c.res.status >= 200 && c.res.status < 300) {
      const response = c.res.clone();

      // Add cache headers
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', `public, max-age=${ttl}`);
      headers.set('X-Cache', 'MISS');

      const cachedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });

      // Store in cache (non-blocking)
      c.executionCtx?.waitUntil(
        cache.put(cacheKeyUrl.toString(), cachedResponse)
      );

      // Add cache header to original response
      c.res.headers.set('X-Cache', 'MISS');
    }
  };
}

/**
 * In-memory cache for frequently accessed data
 * Note: This is per-worker instance, not distributed
 */
class MemoryCache<T = any> {
  private cache = new Map<string, { data: T; expires: number }>();

  set(key: string, value: T, ttlSeconds: number): void {
    const expires = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data: value, expires });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// Global in-memory cache instance
export const memoryCache = new MemoryCache();

// Cleanup expired entries every 5 minutes
setInterval(() => memoryCache.cleanup(), 5 * 60 * 1000);

/**
 * Cache presets for common use cases
 */
export const cachePresets = {
  // Static data: 1 hour
  static: { ttl: 3600 },

  // User-specific data: 5 minutes
  userSpecific: { ttl: 300, varyByUser: true },

  // Frequently changing: 1 minute
  dynamic: { ttl: 60 },

  // Exercise library: 1 day (changes rarely)
  exercises: { ttl: 86400 },

  // Achievements: 30 minutes
  achievements: { ttl: 1800 },
};
