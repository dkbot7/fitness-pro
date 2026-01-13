import type { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { profiles } from '@fitness-pro/database';
import { eq } from 'drizzle-orm';
import type { AppContext } from '../types/hono';

/**
 * GET /api/onboarding/status
 * Get user's onboarding status and saved data
 */
export async function handleOnboardingStatus(c: Context<AppContext>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user ID' }, 401);
    }

    // 2. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 3. Get profile
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    if (result.length === 0) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profile = result[0];

    // 4. Parse JSON fields
    const equipment = profile.equipment ? JSON.parse(profile.equipment) : [];
    const limitations = profile.limitations ? JSON.parse(profile.limitations) : [];

    // 5. Return profile data
    return c.json({
      success: true,
      profile: {
        fullName: profile.fullName,
        whatsappNumber: profile.whatsappNumber,
        currentWeightKg: profile.currentWeightKg,
        heightCm: profile.heightCm,
        age: profile.age,
        gender: profile.gender,
        goal: profile.goal,
        goalDescription: profile.goalDescription,
        frequencyPerWeek: profile.frequencyPerWeek,
        location: profile.location,
        experienceLevel: profile.experienceLevel,
        equipment,
        otherEquipment: profile.otherEquipment,
        limitations,
        limitationsDescription: profile.limitationsDescription,
        onboardingCompletedAt: profile.onboardingCompletedAt,
      },
    });
  } catch (error: any) {
    console.error('Onboarding status error:', error);
    return c.json(
      {
        error: 'Failed to fetch onboarding status',
        details: error.message,
      },
      500
    );
  }
}
