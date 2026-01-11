import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { and, sql, gte } from 'drizzle-orm';
import { profiles } from '@fitness-pro/database';
import { clerkAuth } from './middleware/auth';
import { validateBody } from './middleware/validator';
import { rateLimiter, rateLimitPresets } from './middleware/rate-limiter';
import { cache, cachePresets } from './middleware/cache';
import { logger, requestLogger, configureLogger } from './utils/logger';
import { metricsMiddleware, healthCheck, getMetrics } from './utils/metrics';
import {
  onboardingSchema,
  completeWorkoutSchema,
  submitFeedbackSchema
} from './validation/schemas';
import { handleOnboarding } from './handlers/onboarding';
import { getWorkoutPlan, getAllWeekPlans, completeWorkout } from './handlers/training';
import { submitFeedback } from './handlers/feedback';
import { getUserProfile, getUserStats, getWorkoutHistory } from './handlers/user';
import { getUserStreak, getUserAchievements, checkAndUnlockAchievements } from './handlers/gamification';
import { getExerciseVideo, getExerciseThumbnail, getSignedVideoUrl, getVideoMetadata } from './handlers/videos';
import { subscribeToPush, unsubscribeFromPush, getUserNotificationPreferences } from './handlers/notifications';
import { adjustWeeklyWorkouts } from './services/workout-adjuster-v2';
import type { AppContext } from './types/hono';

const app = new Hono<AppContext>();

// Configure logger based on environment
app.use('*', async (c, next) => {
  const env = c.env.ENVIRONMENT || 'development';
  configureLogger(env);
  await next();
});

// Request logging middleware
app.use('*', requestLogger());

// Metrics collection middleware
app.use('*', metricsMiddleware());

// CORS middleware
app.use('/*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://fitness-pro.pages.dev',
      'https://fitpro.vip',
      'https://www.fitpro.vip',
    ];

    // Allow exact matches
    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    // Allow Cloudflare Pages deployments (*.pages.dev)
    if (origin && /^https:\/\/[a-z0-9-]+\.fitness-pro.*\.pages\.dev$/.test(origin)) {
      return origin;
    }

    return allowedOrigins[0]; // fallback
  },
  credentials: true,
}));

// Global rate limiting: 1000 requests per hour per IP
app.use('/api/*', rateLimiter(rateLimitPresets.public));

// Health check with metrics
app.get('/health', healthCheck);

// Metrics endpoint (for monitoring/debugging)
app.get('/metrics', getMetrics);

// API routes
app.get('/api', (c) => {
  return c.json({ message: 'Fitness Pro API', version: '1.0.0' });
});

// Onboarding
app.post('/api/onboarding', clerkAuth, validateBody(onboardingSchema), handleOnboarding);

// Training
app.get('/api/training/plan', clerkAuth, cache(cachePresets.userSpecific), getWorkoutPlan);
app.get('/api/training/plan/all', clerkAuth, cache(cachePresets.dynamic), getAllWeekPlans);
app.post('/api/training/complete', clerkAuth, validateBody(completeWorkoutSchema), completeWorkout);

// Feedback
app.post('/api/feedback', clerkAuth, validateBody(submitFeedbackSchema), submitFeedback);

// User
app.get('/api/users/me/profile', clerkAuth, cache(cachePresets.userSpecific), getUserProfile);
app.get('/api/users/me/stats', clerkAuth, cache(cachePresets.dynamic), getUserStats);
app.get('/api/users/me/workouts/history', clerkAuth, cache(cachePresets.dynamic), getWorkoutHistory);

// Gamification
app.get('/api/gamification/streak', clerkAuth, cache(cachePresets.dynamic), getUserStreak);
app.get('/api/gamification/achievements', clerkAuth, cache(cachePresets.achievements), getUserAchievements);
app.post('/api/gamification/check-unlocks', clerkAuth, checkAndUnlockAchievements);

// Videos (R2 Streaming)
app.get('/api/exercises/:slug/video', getExerciseVideo);
app.get('/api/exercises/:slug/thumbnail', getExerciseThumbnail);
app.get('/api/exercises/:slug/signed-url', clerkAuth, getSignedVideoUrl);
app.get('/api/exercises/:slug/metadata', clerkAuth, getVideoMetadata);

// Push Notifications
app.post('/api/notifications/subscribe', clerkAuth, subscribeToPush);
app.post('/api/notifications/unsubscribe', clerkAuth, unsubscribeFromPush);
app.get('/api/notifications/preferences', clerkAuth, getUserNotificationPreferences);

// Weekly Adjustment (Updated for D1)
app.post('/api/admin/adjust-week', clerkAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const db = drizzle(c.env.DB);

    const result = await adjustWeeklyWorkouts(db, userId);

    return c.json({
      success: true,
      adjustment: result
    });
  } catch (error: any) {
    console.error('Manual adjustment error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Cron handler for weekly adjustment
app.get('/cron/weekly-adjustment', async (c) => {
  const cronSecret = c.req.header('X-Cloudflare-Cron-Secret');

  if (cronSecret !== c.env.CRON_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = drizzle(c.env.DB);

  // Get all active users
  const activeUsers = await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(
      and(
        sql`onboarding_completed_at IS NOT NULL`,
        gte(profiles.currentWeek, 1)
      )
    );

  console.log(`[Cron] Processing ${activeUsers.length} active users`);

  const results = [];
  const errors = [];

  for (const user of activeUsers) {
    try {
      const result = await adjustWeeklyWorkouts(db, user.userId);
      results.push(result);
    } catch (error: any) {
      console.error(`[Cron] Error adjusting user ${user.userId}:`, error);
      errors.push({ userId: user.userId, error: error.message });
    }
  }

  return c.json({
    success: true,
    processed: activeUsers.length,
    adjusted: results.length,
    errors: errors.length,
    timestamp: new Date().toISOString(),
  });
});

// DEPRECATED: Old manual trigger (for backward compatibility)
app.post('/api/admin/adjust-week-old', async (c) => {
  try {
    const { userId, weekNumber } = await c.req.json();

    if (!userId || !weekNumber) {
      return c.json({ error: 'Missing userId or weekNumber' }, 400);
    }

    // TODO: Implement D1 version
    return c.json({ error: 'Not implemented - requires D1 migration' }, 501);
  } catch (error: any) {
    console.error('Manual adjustment error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  const path = new URL(c.req.url).pathname;
  logger.warn('Route not found', { path, method: c.req.method });
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  const path = new URL(c.req.url).pathname;
  logger.error('Unhandled error', err, {
    path,
    method: c.req.method,
    userId: c.get('userId'),
  });
  return c.json({ error: 'Internal server error' }, 500);
});

// Scheduled event handler (Cloudflare Cron Triggers)
export default {
  fetch: app.fetch,
  async scheduled(
    event: ScheduledEvent,
    env: AppContext['Bindings'],
    ctx: ExecutionContext
  ): Promise<void> {
    // Import cron handler dynamically to avoid circular dependencies
    const { handleWeeklyAdjustment } = await import('./cron/weekly-adjustment');

    console.log('Cron trigger fired:', event.cron);

    // Run weekly adjustment
    ctx.waitUntil(handleWeeklyAdjustment(env));
  },
};
