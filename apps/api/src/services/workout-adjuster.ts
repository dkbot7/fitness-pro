/**
 * Workout Adjuster Service
 *
 * Adjusts weekly workout plans based on user feedback from the previous week.
 * Implements progressive overload principles (+/- 10% adjustment).
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  workoutPlans,
  workouts,
  workoutExercises,
  workoutFeedback,
  exercises,
} from '@fitness-pro/database';
import { eq, and } from 'drizzle-orm';
import { EXERCISES, type Exercise } from '@fitness-pro/shared';

interface WorkoutFeedback {
  workoutId: number;
  difficultyRating: 'easy' | 'ok' | 'hard';
  durationMinutes: number | null;
}

interface AdjustmentResult {
  adjustmentFactor: number; // 0.90, 1.00, or 1.10
  reason: string;
  feedbackCount: number;
}

/**
 * Main function: Adjust weekly workout plan based on previous week's feedback
 */
export async function adjustWeeklyPlan(
  db: ReturnType<typeof drizzle>,
  userId: string,
  completedWeekNumber: number
): Promise<{ success: boolean; message: string; newWeekNumber?: number }> {
  try {
    // 1. Get the completed week's workout plan
    const [completedPlan] = await db
      .select()
      .from(workoutPlans)
      .where(
        and(
          eq(workoutPlans.userId, userId),
          eq(workoutPlans.weekNumber, completedWeekNumber)
        )
      )
      .limit(1);

    if (!completedPlan) {
      return {
        success: false,
        message: `No workout plan found for week ${completedWeekNumber}`,
      };
    }

    // 2. Get all feedback from the completed week
    const feedbackRecords = await getWeeklyFeedback(db, completedPlan.id);

    // 3. Calculate adjustment factor
    const adjustment = calculateAdjustment(feedbackRecords);

    // 4. Check if week already exists (idempotency)
    const nextWeekNumber = completedWeekNumber + 1;
    const [existingPlan] = await db
      .select()
      .from(workoutPlans)
      .where(
        and(
          eq(workoutPlans.userId, userId),
          eq(workoutPlans.weekNumber, nextWeekNumber)
        )
      )
      .limit(1);

    if (existingPlan) {
      return {
        success: true,
        message: `Week ${nextWeekNumber} plan already exists`,
        newWeekNumber: nextWeekNumber,
      };
    }

    // 5. Get completed week's workouts
    const completedWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.planId, completedPlan.id))
      .orderBy(workouts.dayOfWeek);

    // 6. Create new workout plan
    const [newPlan] = await db
      .insert(workoutPlans)
      .values({
        userId,
        weekNumber: nextWeekNumber,
        status: 'active',
        difficultyMultiplier: adjustment.adjustmentFactor.toFixed(2),
      })
      .returning();

    // 7. Clone workouts with adjustments
    for (const oldWorkout of completedWorkouts) {
      // Get exercises from old workout
      const oldExercises = await db
        .select()
        .from(workoutExercises)
        .where(eq(workoutExercises.workoutId, oldWorkout.id))
        .orderBy(workoutExercises.orderIndex);

      // Create new workout
      const [newWorkout] = await db
        .insert(workouts)
        .values({
          planId: newPlan.id,
          userId,
          dayOfWeek: oldWorkout.dayOfWeek,
          workoutType: oldWorkout.workoutType,
          status: 'pending',
        })
        .returning();

      // Clone exercises with adjustments
      for (const oldExercise of oldExercises) {
        const adjustedSets = Math.round(oldExercise.sets * adjustment.adjustmentFactor);
        const adjustedSetsActual = Math.max(2, Math.min(6, adjustedSets)); // Clamp between 2-6

        const notesPt = getAdjustmentNotes(adjustment.adjustmentFactor);

        await db.insert(workoutExercises).values({
          workoutId: newWorkout.id,
          exerciseId: oldExercise.exerciseId,
          orderIndex: oldExercise.orderIndex,
          sets: adjustedSetsActual,
          repsMin: oldExercise.repsMin,
          repsMax: oldExercise.repsMax,
          restSeconds: oldExercise.restSeconds,
          notesPt,
        });
      }
    }

    // 8. Apply exercise variety every 4 weeks
    if (nextWeekNumber % 4 === 0) {
      await swapExercisesForVariety(db, newPlan.id, userId);
    }

    return {
      success: true,
      message: `Week ${nextWeekNumber} plan created with ${adjustment.reason}`,
      newWeekNumber: nextWeekNumber,
    };
  } catch (error: any) {
    console.error('Adjust weekly plan error:', error);
    return {
      success: false,
      message: `Failed to adjust plan: ${error.message}`,
    };
  }
}

/**
 * Get all feedback for a workout plan
 */
async function getWeeklyFeedback(
  db: ReturnType<typeof drizzle>,
  planId: number
): Promise<WorkoutFeedback[]> {
  const feedbackRecords = await db
    .select({
      workoutId: workoutFeedback.workoutId,
      difficultyRating: workoutFeedback.difficultyRating,
      durationMinutes: workoutFeedback.durationMinutes,
    })
    .from(workoutFeedback)
    .innerJoin(workouts, eq(workoutFeedback.workoutId, workouts.id))
    .where(eq(workouts.planId, planId));

  return feedbackRecords as WorkoutFeedback[];
}

/**
 * Calculate adjustment factor based on feedback
 * Returns 0.90 (reduce), 1.00 (maintain), or 1.10 (increase)
 */
function calculateAdjustment(feedbackRecords: WorkoutFeedback[]): AdjustmentResult {
  // Require minimum 3 workouts to adjust
  if (feedbackRecords.length < 3) {
    return {
      adjustmentFactor: 1.0,
      reason: 'insufficient feedback (maintaining current level)',
      feedbackCount: feedbackRecords.length,
    };
  }

  // Count each difficulty rating
  const easyCount = feedbackRecords.filter((f) => f.difficultyRating === 'easy').length;
  const hardCount = feedbackRecords.filter((f) => f.difficultyRating === 'hard').length;
  const totalCount = feedbackRecords.length;

  // Calculate percentages
  const easyPercentage = easyCount / totalCount;
  const hardPercentage = hardCount / totalCount;

  // Apply progressive overload principles:
  // - If 60%+ workouts were easy → increase 10%
  // - If 60%+ workouts were hard → decrease 10%
  // - Otherwise → maintain

  if (easyPercentage >= 0.6) {
    return {
      adjustmentFactor: 1.10,
      reason: `+10% increase (${easyCount}/${totalCount} workouts were easy)`,
      feedbackCount: totalCount,
    };
  }

  if (hardPercentage >= 0.6) {
    return {
      adjustmentFactor: 0.90,
      reason: `-10% decrease (${hardCount}/${totalCount} workouts were hard)`,
      feedbackCount: totalCount,
    };
  }

  return {
    adjustmentFactor: 1.0,
    reason: `maintaining current level (balanced feedback: ${easyCount} easy, ${hardCount} hard)`,
    feedbackCount: totalCount,
  };
}

/**
 * Get exercise notes based on adjustment factor
 */
function getAdjustmentNotes(adjustmentFactor: number): string {
  if (adjustmentFactor > 1.0) {
    return 'Aumentar carga em relação à semana passada';
  }
  if (adjustmentFactor < 1.0) {
    return 'Reduzir carga, focar na técnica e recuperação';
  }
  return 'Manter carga similar à semana passada';
}

/**
 * Swap 2 exercises per workout for variety (every 4 weeks)
 */
async function swapExercisesForVariety(
  db: ReturnType<typeof drizzle>,
  planId: number,
  userId: string
): Promise<void> {
  try {
    // Get all workouts for this plan
    const planWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.planId, planId));

    for (const workout of planWorkouts) {
      // Get exercises for this workout
      const workoutExerciseRecords = await db
        .select()
        .from(workoutExercises)
        .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
        .where(eq(workoutExercises.workoutId, workout.id))
        .orderBy(workoutExercises.orderIndex);

      // Skip if workout has less than 4 exercises
      if (workoutExerciseRecords.length < 4) continue;

      // Randomly select 2 exercises to swap (not the first one - usually compound)
      const swappableIndices = workoutExerciseRecords
        .slice(1) // Skip first exercise
        .map((_, idx) => idx + 1);

      if (swappableIndices.length < 2) continue;

      // Shuffle and pick 2
      const shuffled = swappableIndices.sort(() => Math.random() - 0.5);
      const indicesToSwap = shuffled.slice(0, 2);

      for (const index of indicesToSwap) {
        const exerciseRecord = workoutExerciseRecords[index];
        const currentExercise = exerciseRecord.exercises;

        // Find replacement exercise targeting same muscle groups
        const replacementExercise = findReplacementExercise(
          currentExercise.muscleGroups,
          currentExercise.slug
        );

        if (replacementExercise) {
          // Get replacement exercise ID from database
          const [dbExercise] = await db
            .select()
            .from(exercises)
            .where(eq(exercises.slug, replacementExercise.slug))
            .limit(1);

          if (dbExercise) {
            // Update the exercise
            await db
              .update(workoutExercises)
              .set({
                exerciseId: dbExercise.id,
              })
              .where(eq(workoutExercises.id, exerciseRecord.workout_exercises.id));

            console.log(
              `Swapped ${currentExercise.namePt} → ${replacementExercise.namePt} for variety`
            );
          }
        }
      }
    }
  } catch (error) {
    console.error('Exercise swap error:', error);
    // Don't throw - variety is optional
  }
}

/**
 * Find a replacement exercise with similar muscle groups
 */
function findReplacementExercise(
  targetMuscleGroups: string[],
  currentSlug: string
): Exercise | null {
  // Filter exercises that target at least one of the same muscle groups
  const candidates = EXERCISES.filter(
    (ex) =>
      ex.slug !== currentSlug &&
      ex.muscleGroups.some((mg) => targetMuscleGroups.includes(mg))
  );

  if (candidates.length === 0) return null;

  // Score exercises by how many muscle groups match
  const scored = candidates.map((ex) => ({
    exercise: ex,
    score: ex.muscleGroups.filter((mg) => targetMuscleGroups.includes(mg)).length,
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return the best match
  return scored[0].exercise;
}

/**
 * Get all users who completed a specific week and need adjustment
 */
export async function getUsersNeedingAdjustment(
  db: ReturnType<typeof drizzle>,
  weekNumber: number
): Promise<string[]> {
  // Get all plans for this week with status 'active'
  const plans = await db
    .select({ userId: workoutPlans.userId })
    .from(workoutPlans)
    .where(
      and(
        eq(workoutPlans.weekNumber, weekNumber),
        eq(workoutPlans.status, 'active')
      )
    );

  return plans.map((p) => p.userId);
}
