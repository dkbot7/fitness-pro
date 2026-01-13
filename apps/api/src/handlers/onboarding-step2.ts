import type { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { profiles } from '@fitness-pro/database';
import { eq } from 'drizzle-orm';
import type { AppContext } from '../types/hono';

/**
 * POST /api/onboarding/step2
 * Save goal and goal description from Step 2
 */
export async function handleOnboardingStep2(c: Context<AppContext>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user ID' }, 401);
    }

    // 2. Get request body
    const body = await c.req.json();
    const { goal, goalDescription } = body;

    // 3. Validate required fields
    if (!goal) {
      return c.json({ error: 'Goal is required' }, 400);
    }

    // 4. Connect to D1 database
    const db = drizzle(c.env.DB);

    const nowTimestamp = Math.floor(Date.now() / 1000);

    // 5. Update profile with goal data
    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    if (existingProfile.length === 0) {
      return c.json({ error: 'Profile not found. Please complete Step 1 first.' }, 404);
    }

    await db.update(profiles)
      .set({
        goal,
        goalDescription: goalDescription || '',
        updatedAt: new Date(nowTimestamp * 1000),
      })
      .where(eq(profiles.userId, userId));

    // 6. Return success
    return c.json({
      success: true,
      message: 'Objetivo salvo com sucesso',
    });
  } catch (error: any) {
    console.error('Onboarding step2 error:', error);
    return c.json(
      {
        error: 'Failed to save goal data',
        details: error.message,
      },
      500
    );
  }
}
