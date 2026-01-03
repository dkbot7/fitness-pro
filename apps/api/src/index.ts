import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleOnboarding } from './handlers/onboarding';

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
app.post('/api/onboarding', handleOnboarding);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
