import type { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { users, profiles, workoutPlans, workouts, workoutExercises, exercises } from '@fitness-pro/database';
import { eq } from 'drizzle-orm';
import {
  generateMultiWeekPlan,
  getTotalWeeksForExperience,
  calculateDifficultyMultiplier,
  type UserProfile
} from '../services/workout-generator';
import type { OnboardingInput } from '../validation/schemas';
import type { AppContext } from '../types/hono';

/**
 * POST /api/onboarding
 * Save user profile and generate Week 1 workout plan
 */
export async function handleOnboarding(c: Context<AppContext>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');
    const user = c.get('user');
    let userEmail = user?.email || user?.email_address;

    if (!userId) {
      return c.json({ error: 'Missing user ID' }, 401);
    }

    // 2. If email is not in JWT, use userId as fallback (email is optional)
    if (!userEmail) {
      // Create a temporary email based on userId
      // This will be updated when the user completes their profile
      userEmail = `${userId}@clerk.temp`;
    }

    // 3. Get validated request body from validator middleware
    const body = c.get('validatedBody') as OnboardingInput;
    const {
      goal,
      frequencyPerWeek,
      location,
      experienceLevel,
      equipment,
      limitations,
    } = body;

    // 4. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 5. Upsert user (ensure user exists in our DB)
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    const nowTimestamp = Math.floor(Date.now() / 1000);

    if (existingUser.length === 0) {
      // Insert new user
      await db.insert(users).values({
        id: userId,
        email: userEmail,
      });
    } else {
      // Update existing user
      await db.update(users)
        .set({
          email: userEmail,
          updatedAt: new Date(nowTimestamp * 1000),
        })
        .where(eq(users.id, userId));
    }

    // 6. Insert/Update profile
    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    const profileData = {
      userId,
      goal,
      frequencyPerWeek,
      location,
      experienceLevel,
      equipment: JSON.stringify(equipment || []),
      limitations: JSON.stringify(limitations || []),
      onboardingCompletedAt: new Date(nowTimestamp * 1000),
    };

    if (existingProfile.length === 0) {
      await db.insert(profiles).values(profileData);
    } else {
      await db.update(profiles)
        .set({
          ...profileData,
          updatedAt: new Date(nowTimestamp * 1000),
        })
        .where(eq(profiles.userId, userId));
    }

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    // 7. Determine total weeks based on experience level
    const totalWeeks = getTotalWeeksForExperience(experienceLevel);

    // 8. Generate all weeks of workout plan with progressive overload
    const userProfile: UserProfile = {
      goal,
      frequencyPerWeek,
      location,
      experienceLevel,
      equipment: equipment || [],
      limitations: limitations || [],
    };

    const allWeekPlans = generateMultiWeekPlan(userProfile, totalWeeks);

    // 9. Save all workout plans and workouts for all weeks
    for (const weekPlan of allWeekPlans) {
      // Create workout plan record for this week
      const [planRecord] = await db.insert(workoutPlans).values({
        userId,
        weekNumber: weekPlan.weekNumber,
        status: weekPlan.weekNumber === 1 ? 'active' : 'pending',
        difficultyMultiplier: calculateDifficultyMultiplier(weekPlan.weekNumber),
      }).returning();

      // Get exercise IDs for this week
      const exerciseSlugs = weekPlan.workouts.flatMap((w) =>
        w.exercises.map((e) => e.exerciseSlug)
      );
      const uniqueSlugs = [...new Set(exerciseSlugs)];

      // Build slug -> ID map
      const slugToId = new Map<string, number>();
      for (const slug of uniqueSlugs) {
        const records = await db
          .select()
          .from(exercises)
          .where(eq(exercises.slug, slug))
          .limit(1);

        if (records.length > 0) {
          slugToId.set(slug, records[0].id);
        }
      }

      // Save workouts and workout exercises for this week
      for (const workout of weekPlan.workouts) {
        const [workoutRecord] = await db
          .insert(workouts)
          .values({
            planId: planRecord.id,
            userId,
            dayOfWeek: workout.dayOfWeek,
            workoutType: workout.workoutType,
            status: 'pending',
          })
          .returning();

        // Save workout exercises
        for (const exercise of workout.exercises) {
          const exerciseId = slugToId.get(exercise.exerciseSlug);
          if (!exerciseId) {
            console.warn(`Exercise not found: ${exercise.exerciseSlug}`);
            continue;
          }

          await db.insert(workoutExercises).values({
            workoutId: workoutRecord.id,
            exerciseId,
            orderIndex: exercise.orderIndex,
            sets: exercise.sets,
            repsMin: exercise.repsMin,
            repsMax: exercise.repsMax,
            restSeconds: exercise.restSeconds,
            notesPt: exercise.notesPt,
          });
        }
      }
    }

    // 10. Update profile with plan tracking information
    await db.update(profiles)
      .set({
        currentWeek: 1,
        planStartDate: new Date(nowTimestamp * 1000),
        planTotalWeeks: totalWeeks,
        updatedAt: new Date(nowTimestamp * 1000),
      })
      .where(eq(profiles.userId, userId));

    return c.json({
      success: true,
      message: `Onboarding completo! Seu plano de ${totalWeeks} semanas foi gerado.`,
      profile,
      workoutPlan: {
        weekNumber: 1,
        totalWeeks: totalWeeks,
        workoutsCount: allWeekPlans[0].workouts.length,
      },
    });
  } catch (error: any) {
    console.error('Onboarding error:', error);
    return c.json(
      {
        error: 'Failed to process onboarding',
        details: error.message,
      },
      500
    );
  }
}
