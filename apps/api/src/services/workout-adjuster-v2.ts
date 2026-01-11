/**
 * Workout Adjuster Service v2.0 - Modern Progressive Overload Algorithm
 *
 * Based on 2026 Best Practices:
 * - FitnessAI: AI-optimized progressive overload from millions of workouts
 * - Alpha Progression: Performance-based weight/rep recommendations
 * - JuggernautAI: Daily readiness score (motivation, sleep, nutrition, fatigue)
 *
 * References:
 * - https://www.fitnessai.com/ - Auto-adjusting weights based on performance
 * - https://alphaprogression.com/en - Precise recommendation algorithm
 * - https://www.jefit.com/wp/guide/best-progressive-overload-apps-for-beginners-in-2026
 *
 * Algorithm Approach:
 * 1. Analyze past performance (completion rate, feedback)
 * 2. Calculate readiness score (fatigue, recovery indicators)
 * 3. Determine adjustment type (volume, intensity, exercise variation)
 * 4. Apply progressive overload without burnout
 */

import { eq, and, gte, desc, sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import {
  profiles,
  workoutPlans,
  workouts,
  workoutExercises,
  workoutFeedback,
  exercises,
} from '@fitness-pro/database/schema';

export interface ReadinessScore {
  overall: number; // 0-100
  factors: {
    completionRate: number; // 0-100
    feedbackScore: number; // 0-100 (easy=100, ok=50, hard=0)
    consistencyScore: number; // 0-100
    recoveryIndicator: number; // 0-100 (based on time between workouts)
  };
}

export interface AdjustmentDecision {
  action: 'increase' | 'maintain' | 'decrease';
  volumeChange: number; // +/- sets
  intensityMultiplier: number; // 0.9-1.15
  exerciseSwaps: number; // count of exercises to upgrade/downgrade
  reason: string;
}

export interface AdjustmentResult {
  userId: string;
  weekNumber: number;
  readiness: ReadinessScore;
  decision: AdjustmentDecision;
  appliedChanges: {
    workoutsAdjusted: number;
    exercisesModified: number;
    difficultyMultiplier: number;
  };
  timestamp: Date;
}

/**
 * Main adjustment function - analyzes user data and applies intelligent progression
 */
export async function adjustWeeklyWorkouts(
  db: DrizzleD1Database,
  userId: string
): Promise<AdjustmentResult> {
  console.log(`[Adjuster] Starting weekly adjustment for user ${userId}`);

  // 1. Get user profile and current week
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    throw new Error('Profile not found');
  }

  const currentWeek = profile.currentWeek || 1;
  const nextWeek = currentWeek + 1;

  console.log(`[Adjuster] Current week: ${currentWeek}, adjusting for week ${nextWeek}`);

  // 2. Calculate readiness score based on past performance
  const readiness = await calculateReadinessScore(db, userId, currentWeek);

  console.log('[Adjuster] Readiness score:', readiness);

  // 3. Determine adjustment strategy
  const decision = determineAdjustment(readiness, profile.experienceLevel, currentWeek);

  console.log('[Adjuster] Adjustment decision:', decision);

  // 4. Apply adjustments to next week's plan
  const appliedChanges = await applyAdjustments(
    db,
    userId,
    nextWeek,
    decision,
    profile.experienceLevel
  );

  console.log('[Adjuster] Changes applied:', appliedChanges);

  return {
    userId,
    weekNumber: nextWeek,
    readiness,
    decision,
    appliedChanges,
    timestamp: new Date(),
  };
}

/**
 * Calculate user's readiness score (0-100)
 * Inspired by JuggernautAI's daily readiness check
 */
async function calculateReadinessScore(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number
): Promise<ReadinessScore> {
  // Factor 1: Completion Rate (weight: 40%)
  const completionRate = await calculateCompletionRate(db, userId, weekNumber);

  // Factor 2: Feedback Score (weight: 30%)
  const feedbackScore = await calculateFeedbackScore(db, userId, weekNumber);

  // Factor 3: Consistency Score (weight: 20%)
  const consistencyScore = await calculateConsistencyScore(db, userId, weekNumber);

  // Factor 4: Recovery Indicator (weight: 10%)
  const recoveryIndicator = await calculateRecoveryIndicator(db, userId, weekNumber);

  // Weighted overall score
  const overall =
    completionRate * 0.4 +
    feedbackScore * 0.3 +
    consistencyScore * 0.2 +
    recoveryIndicator * 0.1;

  return {
    overall: Math.round(overall),
    factors: {
      completionRate: Math.round(completionRate),
      feedbackScore: Math.round(feedbackScore),
      consistencyScore: Math.round(consistencyScore),
      recoveryIndicator: Math.round(recoveryIndicator),
    },
  };
}

/**
 * Calculate completion rate for the week (0-100)
 */
async function calculateCompletionRate(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number
): Promise<number> {
  const [plan] = await db
    .select()
    .from(workoutPlans)
    .where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.weekNumber, weekNumber)))
    .limit(1);

  if (!plan) return 50; // Default if no plan found

  const allWorkouts = await db
    .select()
    .from(workouts)
    .where(eq(workouts.planId, plan.id));

  if (allWorkouts.length === 0) return 50;

  const completed = allWorkouts.filter((w) => w.status === 'completed').length;
  return (completed / allWorkouts.length) * 100;
}

/**
 * Calculate feedback score (0-100)
 * Easy = 100 (too easy, increase difficulty)
 * Ok = 50 (perfect)
 * Hard = 0 (too hard, decrease difficulty)
 */
async function calculateFeedbackScore(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number
): Promise<number> {
  const feedbacks = await db
    .select({
      rating: workoutFeedback.difficultyRating,
    })
    .from(workoutFeedback)
    .innerJoin(workouts, eq(workoutFeedback.workoutId, workouts.id))
    .innerJoin(workoutPlans, eq(workouts.planId, workoutPlans.id))
    .where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.weekNumber, weekNumber)));

  if (feedbacks.length === 0) return 50; // Default

  // Convert ratings to scores
  const scoreMap = {
    easy: 100,
    ok: 50,
    hard: 0,
  };

  const avgScore =
    feedbacks.reduce((sum, f) => sum + (scoreMap[f.rating as keyof typeof scoreMap] || 50), 0) /
    feedbacks.length;

  return avgScore;
}

/**
 * Calculate consistency score (0-100)
 * Based on how regularly user is training
 */
async function calculateConsistencyScore(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number
): Promise<number> {
  // Get last 4 weeks of workouts
  const recentWorkouts = await db
    .select({
      completedAt: workouts.completedAt,
      status: workouts.status,
    })
    .from(workouts)
    .innerJoin(workoutPlans, eq(workouts.planId, workoutPlans.id))
    .where(
      and(
        eq(workoutPlans.userId, userId),
        gte(workoutPlans.weekNumber, Math.max(1, weekNumber - 3))
      )
    )
    .orderBy(desc(workouts.completedAt));

  if (recentWorkouts.length === 0) return 50;

  // Calculate average gap between workouts
  const completedWorkouts = recentWorkouts.filter((w) => w.status === 'completed' && w.completedAt);

  if (completedWorkouts.length < 2) return 50;

  const timestamps = completedWorkouts
    .map((w) => new Date(w.completedAt!).getTime())
    .sort((a, b) => b - a);

  const gaps: number[] = [];
  for (let i = 0; i < timestamps.length - 1; i++) {
    const gapDays = (timestamps[i] - timestamps[i + 1]) / (1000 * 60 * 60 * 24);
    gaps.push(gapDays);
  }

  const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

  // Ideal gap: 1-2 days between workouts
  // 1-2 days = 100, 3 days = 75, 4 days = 50, 5+ days = 25
  if (avgGap <= 2) return 100;
  if (avgGap <= 3) return 75;
  if (avgGap <= 4) return 50;
  return 25;
}

/**
 * Calculate recovery indicator (0-100)
 * Based on time since last workout
 */
async function calculateRecoveryIndicator(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number
): Promise<number> {
  const [lastWorkout] = await db
    .select({
      completedAt: workouts.completedAt,
    })
    .from(workouts)
    .innerJoin(workoutPlans, eq(workouts.planId, workoutPlans.id))
    .where(and(eq(workoutPlans.userId, userId), eq(workouts.status, 'completed')))
    .orderBy(desc(workouts.completedAt))
    .limit(1);

  if (!lastWorkout || !lastWorkout.completedAt) return 50;

  const hoursSinceLastWorkout =
    (Date.now() - new Date(lastWorkout.completedAt).getTime()) / (1000 * 60 * 60);

  // Ideal recovery: 24-48 hours
  // 24-48h = 100, 12-24h = 50 (not enough rest), 48-72h = 75, 72+ = 50 (too long gap)
  if (hoursSinceLastWorkout >= 24 && hoursSinceLastWorkout <= 48) return 100;
  if (hoursSinceLastWorkout >= 48 && hoursSinceLastWorkout <= 72) return 75;
  if (hoursSinceLastWorkout >= 12 && hoursSinceLastWorkout < 24) return 50;
  return 25;
}

/**
 * Determine adjustment strategy based on readiness score
 * Inspired by FitnessAI and Alpha Progression algorithms
 */
function determineAdjustment(
  readiness: ReadinessScore,
  experienceLevel: string,
  currentWeek: number
): AdjustmentDecision {
  const { overall, factors } = readiness;

  // High readiness (80-100): Increase difficulty
  if (overall >= 80 && factors.completionRate >= 80) {
    return {
      action: 'increase',
      volumeChange: experienceLevel === 'beginner' ? 1 : 2, // +1-2 sets
      intensityMultiplier: 1.1, // +10% difficulty
      exerciseSwaps: currentWeek >= 4 ? 1 : 0, // Swap 1 exercise to harder variant after week 4
      reason: 'High performance - increasing challenge',
    };
  }

  // Medium readiness (50-79): Maintain with small increase
  if (overall >= 50 && overall < 80) {
    return {
      action: 'maintain',
      volumeChange: currentWeek % 2 === 0 ? 1 : 0, // +1 set every 2 weeks
      intensityMultiplier: 1.05, // +5% difficulty
      exerciseSwaps: 0,
      reason: 'Good progress - maintaining current load with minor progression',
    };
  }

  // Low readiness (0-49): Decrease or maintain
  if (factors.completionRate < 50 || factors.feedbackScore < 25) {
    return {
      action: 'decrease',
      volumeChange: -1, // -1 set
      intensityMultiplier: 0.95, // -5% difficulty
      exerciseSwaps: currentWeek >= 4 ? -1 : 0, // Swap to easier variant if struggling
      reason: 'Low completion or hard feedback - reducing load for recovery',
    };
  }

  // Default: small progression
  return {
    action: 'maintain',
    volumeChange: 0,
    intensityMultiplier: 1.03, // +3% natural progression
    exerciseSwaps: 0,
    reason: 'Standard weekly progression',
  };
}

/**
 * Apply adjustments to next week's workout plan
 */
async function applyAdjustments(
  db: DrizzleD1Database,
  userId: string,
  weekNumber: number,
  decision: AdjustmentDecision,
  experienceLevel: string
): Promise<{
  workoutsAdjusted: number;
  exercisesModified: number;
  difficultyMultiplier: number;
}> {
  // Get next week's plan
  const [plan] = await db
    .select()
    .from(workoutPlans)
    .where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.weekNumber, weekNumber)))
    .limit(1);

  if (!plan) {
    console.warn(`[Adjuster] No plan found for week ${weekNumber}`);
    return { workoutsAdjusted: 0, exercisesModified: 0, difficultyMultiplier: 1.0 };
  }

  // Update plan difficulty multiplier
  await db
    .update(workoutPlans)
    .set({ difficultyMultiplier: decision.intensityMultiplier })
    .where(eq(workoutPlans.id, plan.id));

  // Get all workouts in this plan
  const planWorkouts = await db.select().from(workouts).where(eq(workouts.planId, plan.id));

  let totalExercisesModified = 0;

  // Adjust volume (sets) for each workout
  for (const workout of planWorkouts) {
    if (decision.volumeChange !== 0) {
      // Update sets for all exercises in workout
      await db.execute(sql`
        UPDATE workout_exercises
        SET sets = CAST(MAX(2, sets + ${decision.volumeChange}) AS INTEGER)
        WHERE workout_id = ${workout.id}
      `);

      // Count modified exercises
      const [result] = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM workout_exercises
        WHERE workout_id = ${workout.id}
      `);

      totalExercisesModified += (result as any).count || 0;
    }
  }

  // Handle exercise swaps (upgrade/downgrade)
  if (decision.exerciseSwaps !== 0) {
    await handleExerciseSwaps(db, planWorkouts, decision.exerciseSwaps, experienceLevel);
  }

  console.log(
    `[Adjuster] Adjusted ${planWorkouts.length} workouts, ${totalExercisesModified} exercises modified`
  );

  return {
    workoutsAdjusted: planWorkouts.length,
    exercisesModified: totalExercisesModified,
    difficultyMultiplier: decision.intensityMultiplier,
  };
}

/**
 * Swap exercises to harder/easier variants
 */
async function handleExerciseSwaps(
  db: DrizzleD1Database,
  planWorkouts: any[],
  swapCount: number,
  experienceLevel: string
): Promise<void> {
  const direction = swapCount > 0 ? 'harder' : 'easier';
  const absSwapCount = Math.abs(swapCount);

  console.log(`[Adjuster] Swapping ${absSwapCount} exercises to ${direction} variants`);

  for (const workout of planWorkouts) {
    // Get exercises in this workout
    const workoutExercisesList = await db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workout.id))
      .limit(absSwapCount);

    for (const we of workoutExercisesList) {
      // Get current exercise details
      const [currentExercise] = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, we.exerciseId))
        .limit(1);

      if (!currentExercise) continue;

      // Find harder/easier variant
      const targetDifficulty =
        direction === 'harder'
          ? getNextDifficulty(currentExercise.difficulty)
          : getPreviousDifficulty(currentExercise.difficulty);

      const [replacement] = await db
        .select()
        .from(exercises)
        .where(
          and(
            eq(exercises.difficulty, targetDifficulty),
            sql`json_array_length(muscle_groups) > 0`,
            sql`EXISTS (
              SELECT 1 FROM json_each(${exercises.muscleGroups})
              WHERE value IN (SELECT value FROM json_each(${currentExercise.muscleGroups}))
            )`
          )
        )
        .limit(1);

      if (replacement) {
        // Update exercise reference
        await db
          .update(workoutExercises)
          .set({ exerciseId: replacement.id })
          .where(eq(workoutExercises.id, we.id));

        console.log(
          `[Adjuster] Swapped ${currentExercise.slug} → ${replacement.slug} (${direction})`
        );
      }
    }
  }
}

function getNextDifficulty(current: string): string {
  if (current === 'beginner') return 'intermediate';
  if (current === 'intermediate') return 'advanced';
  return 'advanced';
}

function getPreviousDifficulty(current: string): string {
  if (current === 'advanced') return 'intermediate';
  if (current === 'intermediate') return 'beginner';
  return 'beginner';
}
