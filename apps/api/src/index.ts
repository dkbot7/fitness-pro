import { Hono } from 'hono';
import { cors } from 'hono/cors';
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
import { getWorkoutPlan, completeWorkout } from './handlers/training';
import { submitFeedback } from './handlers/feedback';
import { getUserProfile, getUserStats, getWorkoutHistory } from './handlers/user';
import { getUserStreak, getUserAchievements, checkAndUnlockAchievements } from './handlers/gamification';

type Bindings = {
  DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  ENVIRONMENT?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

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
  origin: ['http://localhost:3000', 'https://fitness-pro.pages.dev'],
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

// Manual trigger for weekly adjustment (for testing)
app.post('/api/admin/adjust-week', async (c) => {
  try {
    const { userId, weekNumber } = await c.req.json();

    if (!userId || !weekNumber) {
      return c.json({ error: 'Missing userId or weekNumber' }, 400);
    }

    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    const { adjustWeeklyPlan } = await import('./services/workout-adjuster');

    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);

    const result = await adjustWeeklyPlan(db, userId, weekNumber);

    return c.json(result);
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
    env: Bindings,
    ctx: ExecutionContext
  ): Promise<void> {
    // Import cron handler dynamically to avoid circular dependencies
    const { handleWeeklyAdjustment } = await import('./cron/weekly-adjustment');

    console.log('Cron trigger fired:', event.cron);

    // Run weekly adjustment
    ctx.waitUntil(handleWeeklyAdjustment(env));
  },
};
