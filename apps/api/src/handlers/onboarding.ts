import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { users, profiles, workoutPlans, workouts, workoutExercises, exercises } from '@fitness-pro/database';
import { eq } from 'drizzle-orm';
import { generateInitialWorkoutPlan, type UserProfile } from '../services/workout-generator';

interface Env {
  DB: D1Database;
}

/**
 * POST /api/onboarding
 * Save user profile and generate Week 1 workout plan
 */
export async function handleOnboarding(c: Context<{ Bindings: Env }>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');
    const user = c.get('user');
    const userEmail = user?.email || user?.email_address;
    const userName = user?.name || user?.full_name;

    if (!userId || !userEmail) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    // 2. Parse request body
    const body = await c.req.json();
    const {
      goal,
      frequencyPerWeek,
      location,
      experienceLevel,
      equipment,
      limitations,
      currentWeightKg,
      heightCm,
      age,
      gender,
    } = body;

    // 3. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 4. Upsert user (ensure user exists in our DB)
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

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
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, userId));
    }

    // 5. Insert/Update profile
    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    let profile;
    const profileData = {
      userId,
      goal,
      frequencyPerWeek,
      location,
      experienceLevel,
      equipment: JSON.stringify(equipment || []),
      limitations: JSON.stringify(limitations || []),
      onboardingCompletedAt: new Date().toISOString(),
    };

    if (existingProfile.length === 0) {
      const result = await db.insert(profiles).values(profileData).returning();
      profile = result[0];
    } else {
      const result = await db.update(profiles)
        .set({
          ...profileData,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(profiles.userId, userId))
        .returning();
      profile = result[0];
    }

    // 6. Generate Week 1 workout plan
    const userProfile: UserProfile = {
      goal,
      frequencyPerWeek,
      location,
      experienceLevel,
      equipment: equipment || [],
      limitations: limitations || [],
    };

    const generatedPlan = generateInitialWorkoutPlan(userProfile);

    // 7. Save workout plan to database
    const existingPlan = await db.select().from(workoutPlans)
      .where(eq(workoutPlans.userId, userId))
      .limit(1);

    let workoutPlan;
    if (existingPlan.length === 0) {
      const result = await db.insert(workoutPlans).values({
        userId,
        weekNumber: 1,
        status: 'active',
        difficultyMultiplier: '1.00',
      }).returning();
      workoutPlan = result[0];
    } else {
      const result = await db.update(workoutPlans)
        .set({
          status: 'active',
          difficultyMultiplier: '1.00',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(workoutPlans.userId, userId))
        .returning();
      workoutPlan = result[0];
    }

    // 8. Get exercise IDs by slug (map slugs to DB IDs)
    const exerciseSlugs = generatedPlan.workouts.flatMap((w) =>
      w.exercises.map((e) => e.exerciseSlug)
    );
    const uniqueSlugs = [...new Set(exerciseSlugs)];

    const exerciseRecords = await db
      .select()
      .from(exercises)
      .where(
        eq(exercises.slug, uniqueSlugs[0]) // Workaround: need to use `in` operator
      );

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

    // 9. Save workouts and exercises
    for (const workout of generatedPlan.workouts) {
      const [workoutRecord] = await db
        .insert(workouts)
        .values({
          planId: workoutPlan.id,
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

    return c.json({
      success: true,
      message: 'Onboarding completo! Seu plano de treino foi gerado.',
      profile,
      workoutPlan: {
        weekNumber: 1,
        workoutsCount: generatedPlan.workouts.length,
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
