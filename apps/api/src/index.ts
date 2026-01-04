import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { clerkAuth } from './middleware/auth';
import { handleOnboarding } from './handlers/onboarding';
import { getWorkoutPlan, completeWorkout } from './handlers/training';
import { submitFeedback } from './handlers/feedback';
import { getUserProfile, getUserStats } from './handlers/user';

type Bindings = {
  DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:3000', 'https://fitness-pro.pages.dev'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (c) => {
  return c.json({ message: 'Fitness Pro API' });
});

// Onboarding
app.post('/api/onboarding', clerkAuth, handleOnboarding);

// Training
app.get('/api/training/plan', clerkAuth, getWorkoutPlan);
app.post('/api/training/complete', clerkAuth, completeWorkout);

// Feedback
app.post('/api/feedback', clerkAuth, submitFeedback);

// User
app.get('/api/users/me/profile', clerkAuth, getUserProfile);
app.get('/api/users/me/stats', clerkAuth, getUserStats);

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
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
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
