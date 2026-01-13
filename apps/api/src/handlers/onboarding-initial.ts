import type { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { users, profiles } from '@fitness-pro/database';
import { eq } from 'drizzle-orm';
import type { AppContext } from '../types/hono';

/**
 * POST /api/onboarding/initial
 * Save initial user data (WhatsApp, weight, height, age, gender)
 * This is called after Step 1 of onboarding
 */
export async function handleOnboardingInitial(c: Context<AppContext>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');
    const user = c.get('user');
    let userEmail = user?.email || user?.email_address;

    if (!userId) {
      return c.json({ error: 'Missing user ID' }, 401);
    }

    // 2. If email is not in JWT, use userId as fallback
    if (!userEmail) {
      userEmail = `${userId}@clerk.temp`;
    }

    // 3. Get request body
    const body = await c.req.json();
    const {
      fullName,
      whatsappNumber,
      currentWeightKg,
      heightCm,
      age,
      gender,
    } = body;

    // 4. Validate required fields
    if (!fullName || !whatsappNumber || !currentWeightKg || !heightCm || !age || !gender) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // 5. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 6. Upsert user (ensure user exists in our DB)
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const nowTimestamp = Math.floor(Date.now() / 1000);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: userId,
        email: userEmail,
      });
    } else {
      await db.update(users)
        .set({
          email: userEmail,
          updatedAt: new Date(nowTimestamp * 1000),
        })
        .where(eq(users.id, userId));
    }

    // 7. Insert/Update profile with initial data
    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    const profileData = {
      userId,
      fullName,
      whatsappNumber,
      currentWeightKg,
      heightCm,
      age,
      gender,
      updatedAt: new Date(nowTimestamp * 1000),
    };

    if (existingProfile.length === 0) {
      // Insert new profile with required fields using temporary defaults
      await db.insert(profiles).values({
        ...profileData,
        // Required fields - will be filled in Step 2 and 3
        goal: 'maintenance', // temporary default
        frequencyPerWeek: 3, // temporary default
        location: 'gym', // temporary default
        experienceLevel: 'beginner', // temporary default
      });
    } else {
      await db.update(profiles)
        .set(profileData)
        .where(eq(profiles.userId, userId));
    }

    // 8. Return success
    return c.json({
      success: true,
      message: 'Dados iniciais salvos com sucesso',
    });
  } catch (error: any) {
    console.error('Onboarding initial error:', error);
    return c.json(
      {
        error: 'Failed to save initial data',
        details: error.message,
      },
      500
    );
  }
}
