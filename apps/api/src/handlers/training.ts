import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { workoutPlans, workouts, workoutExercises, exercises } from '@fitness-pro/database';
import { eq, and, desc } from 'drizzle-orm';
import type { CompleteWorkoutInput } from '../validation/schemas';

interface Env {
  DB: D1Database;
}

/**
 * GET /api/training/plan
 * Get current week's workout plan with completion stats
 */
export async function getWorkoutPlan(c: Context<{ Bindings: Env }>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    // 2. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 3. Get the most recent (active) workout plan for user
    const plans = await db
      .select()
      .from(workoutPlans)
      .where(
        and(
          eq(workoutPlans.userId, userId),
          eq(workoutPlans.status, 'active')
        )
      )
      .orderBy(desc(workoutPlans.weekNumber))
      .limit(1);

    if (plans.length === 0) {
      return c.json({
        error: 'No active workout plan found. Please complete onboarding first.',
      }, 404);
    }

    const plan = plans[0];

    // 4. Get all workouts for this plan
    const planWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.planId, plan.id))
      .orderBy(workouts.dayOfWeek);

    // 5. Get ALL exercises for ALL workouts in ONE query (optimized - no N+1)
    // First, get all workout IDs for this plan
    const workoutIds = planWorkouts.map(w => w.id);

    // Fetch all workout exercises for these workouts in a single query
    // We'll do this by querying all exercises where workout_id is in our list
    let allExerciseRecords: any[] = [];

    if (workoutIds.length > 0) {
      // For D1/SQLite, we need to handle the IN clause differently
      // Drizzle supports inArray for this
      const { inArray } = await import('drizzle-orm');

      allExerciseRecords = await db
        .select({
          workoutId: workoutExercises.workoutId,
          id: workoutExercises.id,
          exerciseId: workoutExercises.exerciseId,
          orderIndex: workoutExercises.orderIndex,
          sets: workoutExercises.sets,
          repsMin: workoutExercises.repsMin,
          repsMax: workoutExercises.repsMax,
          restSeconds: workoutExercises.restSeconds,
          notesPt: workoutExercises.notesPt,
          exerciseName: exercises.namePt,
          exerciseSlug: exercises.slug,
          muscleGroups: exercises.muscleGroups,
          difficulty: exercises.difficulty,
          videoUrl: exercises.videoUrl,
          thumbnailUrl: exercises.thumbnailUrl,
        })
        .from(workoutExercises)
        .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
        .where(inArray(workoutExercises.workoutId, workoutIds))
        .orderBy(workoutExercises.workoutId, workoutExercises.orderIndex);
    }

    // Group exercises by workout ID
    const exercisesByWorkout = new Map<number, typeof allExerciseRecords>();
    for (const exercise of allExerciseRecords) {
      const workoutId = exercise.workoutId;
      if (!exercisesByWorkout.has(workoutId)) {
        exercisesByWorkout.set(workoutId, []);
      }
      exercisesByWorkout.get(workoutId)!.push(exercise);
    }

    // Map workouts to include their exercises (no async needed - data already fetched)
    const workoutsWithExercises = planWorkouts.map(workout => ({
      id: workout.id,
      dayOfWeek: workout.dayOfWeek,
      workoutType: workout.workoutType,
      status: workout.status,
      startedAt: workout.startedAt,
      completedAt: workout.completedAt,
      exercises: exercisesByWorkout.get(workout.id) || [],
    }));

    // 6. Calculate completion stats
    const totalWorkouts = workoutsWithExercises.length;
    const completedWorkouts = workoutsWithExercises.filter(
      (w) => w.status === 'completed'
    ).length;
    const completionRate =
      totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

    return c.json({
      success: true,
      plan: {
        id: plan.id,
        weekNumber: plan.weekNumber,
        status: plan.status,
        difficultyMultiplier: plan.difficultyMultiplier,
        createdAt: plan.createdAt,
      },
      workouts: workoutsWithExercises,
      stats: {
        total: totalWorkouts,
        completed: completedWorkouts,
        pending: totalWorkouts - completedWorkouts,
        completionRate,
      },
    });
  } catch (error: any) {
    console.error('Get workout plan error:', error);
    return c.json(
      {
        error: 'Failed to fetch workout plan',
        details: error.message,
      },
      500
    );
  }
}

/**
 * POST /api/training/complete
 * Mark a workout as completed
 */
export async function completeWorkout(c: Context<{ Bindings: Env }>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    // 2. Get validated request body
    const body = c.get('validatedBody') as CompleteWorkoutInput;
    const { workoutId } = body;

    // 3. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 4. Verify workout belongs to user
    const workoutRecords = await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.id, workoutId),
          eq(workouts.userId, userId)
        )
      )
      .limit(1);

    if (workoutRecords.length === 0) {
      return c.json({ error: 'Workout not found' }, 404);
    }

    const workout = workoutRecords[0];

    if (workout.status === 'completed') {
      return c.json({
        success: true,
        message: 'Workout already completed',
        workout,
      });
    }

    // 5. Update workout status
    const [updatedWorkout] = await db
      .update(workouts)
      .set({
        status: 'completed',
        completedAt: new Date().toISOString(),
      })
      .where(eq(workouts.id, workoutId))
      .returning();

    // 6. Update streak and check for new achievements
    let streakData = { currentStreak: 0, newAchievements: [] };
    try {
      const { updateUserStreak } = await import('./gamification');
      streakData = await updateUserStreak(db, userId);
    } catch (gamificationError: any) {
      console.error('Gamification update error (non-fatal):', gamificationError);
      // Don't fail workout completion if gamification fails
    }

    return c.json({
      success: true,
      message: 'Treino concluído com sucesso!',
      workout: updatedWorkout,
      streak: streakData.currentStreak,
      newAchievements: streakData.newAchievements,
    });
  } catch (error: any) {
    console.error('Complete workout error:', error);
    return c.json(
      {
        error: 'Failed to complete workout',
        details: error.message,
      },
      500
    );
  }
}
