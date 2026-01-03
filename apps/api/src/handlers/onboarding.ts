import { Context } from 'hono';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, profiles, workoutPlans, workouts, workoutExercises, exercises } from '@fitness-pro/database';
import { eq } from 'drizzle-orm';
import { generateInitialWorkoutPlan, type UserProfile } from '../services/workout-generator';

interface Env {
  DATABASE_URL: string;
}

/**
 * POST /api/onboarding
 * Save user profile and generate Week 1 workout plan
 */
export async function handleOnboarding(c: Context<{ Bindings: Env }>) {
  try {
    // 1. Get user info from headers (sent from Next.js frontend)
    const userId = c.req.header('X-User-ID');
    const userEmail = c.req.header('X-User-Email');
    const userName = c.req.header('X-User-Name');

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

    // 3. Connect to database
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);

    // 4. Upsert user (ensure user exists in our DB)
    await db
      .insert(users)
      .values({
        id: userId,
        email: userEmail,
        name: userName || null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userEmail,
          name: userName || null,
          updatedAt: new Date(),
        },
      });

    // 5. Insert/Update profile
    const [profile] = await db
      .insert(profiles)
      .values({
        userId,
        goal,
        frequencyPerWeek,
        location,
        experienceLevel,
        equipment,
        limitations: limitations || [],
        currentWeightKg: currentWeightKg || null,
        heightCm: heightCm || null,
        age: age || null,
        gender: gender || null,
        onboardingCompletedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          goal,
          frequencyPerWeek,
          location,
          experienceLevel,
          equipment,
          limitations: limitations || [],
          currentWeightKg: currentWeightKg || null,
          heightCm: heightCm || null,
          age: age || null,
          gender: gender || null,
          onboardingCompletedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

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
    const [workoutPlan] = await db
      .insert(workoutPlans)
      .values({
        userId,
        weekNumber: 1,
        status: 'active',
        difficultyMultiplier: '1.00',
      })
      .onConflictDoUpdate({
        target: [workoutPlans.userId, workoutPlans.weekNumber],
        set: {
          status: 'active',
          difficultyMultiplier: '1.00',
        },
      })
      .returning();

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
