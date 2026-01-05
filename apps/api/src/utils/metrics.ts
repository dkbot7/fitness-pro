/**
 * Metrics and Observability for Cloudflare Workers
 * Tracks performance, errors, and usage patterns
 */

import { Context, Next } from 'hono';

export interface MetricData {
  requests: {
    total: number;
    byEndpoint: Map<string, number>;
    byStatus: Map<number, number>;
  };
  latency: {
    total: number;
    count: number;
    min: number;
    max: number;
    avg: number;
    byEndpoint: Map<string, { total: number; count: number; avg: number }>;
  };
  errors: {
    total: number;
    byType: Map<string, number>;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  rateLimit: {
    blocked: number;
    allowed: number;
  };
}

class MetricsCollector {
  private data: MetricData = {
    requests: {
      total: 0,
      byEndpoint: new Map(),
      byStatus: new Map(),
    },
    latency: {
      total: 0,
      count: 0,
      min: Infinity,
      max: 0,
      avg: 0,
      byEndpoint: new Map(),
    },
    errors: {
      total: 0,
      byType: new Map(),
    },
    cache: {
      hits: 0,
      misses: 0,
      hitRate: 0,
    },
    rateLimit: {
      blocked: 0,
      allowed: 0,
    },
  };

  recordRequest(endpoint: string, status: number, latencyMs: number): void {
    // Increment total requests
    this.data.requests.total++;

    // Track by endpoint
    const endpointCount = this.data.requests.byEndpoint.get(endpoint) || 0;
    this.data.requests.byEndpoint.set(endpoint, endpointCount + 1);

    // Track by status code
    const statusCount = this.data.requests.byStatus.get(status) || 0;
    this.data.requests.byStatus.set(status, statusCount + 1);

    // Track latency
    this.data.latency.total += latencyMs;
    this.data.latency.count++;
    this.data.latency.min = Math.min(this.data.latency.min, latencyMs);
    this.data.latency.max = Math.max(this.data.latency.max, latencyMs);
    this.data.latency.avg = this.data.latency.total / this.data.latency.count;

    // Track latency by endpoint
    const endpointLatency = this.data.latency.byEndpoint.get(endpoint) || {
      total: 0,
      count: 0,
      avg: 0,
    };
    endpointLatency.total += latencyMs;
    endpointLatency.count++;
    endpointLatency.avg = endpointLatency.total / endpointLatency.count;
    this.data.latency.byEndpoint.set(endpoint, endpointLatency);

    // Track errors (4xx and 5xx)
    if (status >= 400) {
      this.recordError(status >= 500 ? 'server_error' : 'client_error');
    }
  }

  recordError(type: string): void {
    this.data.errors.total++;
    const errorCount = this.data.errors.byType.get(type) || 0;
    this.data.errors.byType.set(type, errorCount + 1);
  }

  recordCacheHit(): void {
    this.data.cache.hits++;
    this.updateCacheHitRate();
  }

  recordCacheMiss(): void {
    this.data.cache.misses++;
    this.updateCacheHitRate();
  }

  private updateCacheHitRate(): void {
    const total = this.data.cache.hits + this.data.cache.misses;
    this.data.cache.hitRate = total > 0 ? (this.data.cache.hits / total) * 100 : 0;
  }

  recordRateLimitBlocked(): void {
    this.data.rateLimit.blocked++;
  }

  recordRateLimitAllowed(): void {
    this.data.rateLimit.allowed++;
  }

  getMetrics(): any {
    return {
      requests: {
        total: this.data.requests.total,
        byEndpoint: Object.fromEntries(this.data.requests.byEndpoint),
        byStatus: Object.fromEntries(this.data.requests.byStatus),
      },
      latency: {
        avg: Math.round(this.data.latency.avg * 100) / 100,
        min: this.data.latency.min === Infinity ? 0 : Math.round(this.data.latency.min * 100) / 100,
        max: Math.round(this.data.latency.max * 100) / 100,
        byEndpoint: Object.fromEntries(
          Array.from(this.data.latency.byEndpoint.entries()).map(([k, v]) => [
            k,
            { avg: Math.round(v.avg * 100) / 100, count: v.count },
          ])
        ),
      },
      errors: {
        total: this.data.errors.total,
        rate: this.data.requests.total > 0
          ? Math.round((this.data.errors.total / this.data.requests.total) * 10000) / 100
          : 0,
        byType: Object.fromEntries(this.data.errors.byType),
      },
      cache: {
        hits: this.data.cache.hits,
        misses: this.data.cache.misses,
        hitRate: Math.round(this.data.cache.hitRate * 100) / 100,
      },
      rateLimit: {
        blocked: this.data.rateLimit.blocked,
        allowed: this.data.rateLimit.allowed,
        blockRate: this.data.rateLimit.allowed + this.data.rateLimit.blocked > 0
          ? Math.round(
              (this.data.rateLimit.blocked /
                (this.data.rateLimit.allowed + this.data.rateLimit.blocked)) *
                10000
            ) / 100
          : 0,
      },
    };
  }

  reset(): void {
    this.data = {
      requests: {
        total: 0,
        byEndpoint: new Map(),
        byStatus: new Map(),
      },
      latency: {
        total: 0,
        count: 0,
        min: Infinity,
        max: 0,
        avg: 0,
        byEndpoint: new Map(),
      },
      errors: {
        total: 0,
        byType: new Map(),
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0,
      },
      rateLimit: {
        blocked: 0,
        allowed: 0,
      },
    };
  }
}

// Global metrics collector
export const metrics = new MetricsCollector();

/**
 * Metrics collection middleware
 */
export function metricsMiddleware() {
  return async (c: Context, next: Next) => {
    const start = Date.now();
    const endpoint = new URL(c.req.url).pathname;

    await next();

    const latency = Date.now() - start;
    const status = c.res.status;

    metrics.recordRequest(endpoint, status, latency);

    // Track cache hits/misses from header
    const cacheStatus = c.res.headers.get('X-Cache');
    if (cacheStatus === 'HIT') {
      metrics.recordCacheHit();
    } else if (cacheStatus === 'MISS') {
      metrics.recordCacheMiss();
    }
  };
}

/**
 * Health check with metrics
 */
export function healthCheck(c: Context) {
  const metricsData = metrics.getMetrics();

  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : null,
    metrics: {
      requests: metricsData.requests.total,
      errorRate: metricsData.errors.rate,
      avgLatency: metricsData.latency.avg,
      cacheHitRate: metricsData.cache.hitRate,
    },
  });
}

/**
 * Detailed metrics endpoint
 */
export function getMetrics(c: Context) {
  return c.json({
    timestamp: new Date().toISOString(),
    metrics: metrics.getMetrics(),
  });
}
