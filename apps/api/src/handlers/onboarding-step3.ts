import type { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { profiles } from '@fitness-pro/database';
import { eq } from 'drizzle-orm';
import type { AppContext } from '../types/hono';

/**
 * POST /api/onboarding/step3
 * Save frequency, location, and experience level from Step 3
 */
export async function handleOnboardingStep3(c: Context<AppContext>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user ID' }, 401);
    }

    // 2. Get request body
    const body = await c.req.json();
    const { frequencyPerWeek, location, experienceLevel } = body;

    // 3. Validate required fields
    if (!frequencyPerWeek || !location || !experienceLevel) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // 4. Connect to D1 database
    const db = drizzle(c.env.DB);

    const nowTimestamp = Math.floor(Date.now() / 1000);

    // 5. Update profile with step 3 data
    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    if (existingProfile.length === 0) {
      return c.json({ error: 'Profile not found. Please complete Step 1 first.' }, 404);
    }

    await db.update(profiles)
      .set({
        frequencyPerWeek,
        location,
        experienceLevel,
        updatedAt: new Date(nowTimestamp * 1000),
      })
      .where(eq(profiles.userId, userId));

    // 6. Return success
    return c.json({
      success: true,
      message: 'Dados de treino salvos com sucesso',
    });
  } catch (error: any) {
    console.error('Onboarding step3 error:', error);
    return c.json(
      {
        error: 'Failed to save training data',
        details: error.message,
      },
      500
    );
  }
}
