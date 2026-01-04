import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { profiles, workoutPlans, workouts, users } from '@fitness-pro/database';
import { eq, and, desc } from 'drizzle-orm';

interface Env {
  DB: D1Database;
}

/**
 * GET /api/users/me/profile
 * Get user profile and workout preferences
 */
export async function getUserProfile(c: Context<{ Bindings: Env }>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    // 2. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 3. Get user profile
    const profileRecords = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (profileRecords.length === 0) {
      return c.json({
        error: 'Profile not found. Please complete onboarding first.',
      }, 404);
    }

    const profile = profileRecords[0];

    return c.json({
      success: true,
      profile: {
        goal: profile.goal,
        frequencyPerWeek: profile.frequencyPerWeek,
        location: profile.location,
        experienceLevel: profile.experienceLevel,
        equipment: profile.equipment,
        limitations: profile.limitations,
        currentWeightKg: profile.currentWeightKg,
        heightCm: profile.heightCm,
        age: profile.age,
        gender: profile.gender,
        onboardingCompletedAt: profile.onboardingCompletedAt,
        createdAt: profile.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return c.json(
      {
        error: 'Failed to fetch user profile',
        details: error.message,
      },
      500
    );
  }
}

/**
 * GET /api/users/me/stats
 * Get user workout statistics
 */
export async function getUserStats(c: Context<{ Bindings: Env }>) {
  try {
    // 1. Get user info from auth middleware
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    // 2. Connect to D1 database
    const db = drizzle(c.env.DB);

    // 3. Get current week number (most recent active plan)
    const activePlans = await db
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

    const currentWeekNumber = activePlans.length > 0 ? activePlans[0].weekNumber : 1;
    const currentPlanId = activePlans.length > 0 ? activePlans[0].id : null;

    // 4. Get all-time workout stats
    const allWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId));

    const totalWorkouts = allWorkouts.length;
    const completedWorkouts = allWorkouts.filter(w => w.status === 'completed').length;
    const overallCompletionRate = totalWorkouts > 0
      ? Math.round((completedWorkouts / totalWorkouts) * 100)
      : 0;

    // 5. Get current week stats (if plan exists)
    let currentWeekStats = {
      total: 0,
      completed: 0,
      completionRate: 0,
    };

    if (currentPlanId) {
      const currentWeekWorkouts = await db
        .select()
        .from(workouts)
        .where(eq(workouts.planId, currentPlanId));

      const weekTotal = currentWeekWorkouts.length;
      const weekCompleted = currentWeekWorkouts.filter(w => w.status === 'completed').length;

      currentWeekStats = {
        total: weekTotal,
        completed: weekCompleted,
        completionRate: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0,
      };
    }

    // 6. Calculate total weeks trained
    const allPlans = await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.userId, userId));

    const totalWeeks = allPlans.length;

    // 7. Get user created date
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const memberSince = userRecords.length > 0
      ? userRecords[0].createdAt
      : new Date();

    return c.json({
      success: true,
      stats: {
        currentWeekNumber,
        totalWorkoutsCompleted: completedWorkouts,
        totalWorkouts,
        overallCompletionRate,
        currentWeek: currentWeekStats,
        totalWeeks,
        memberSince,
      },
    });
  } catch (error: any) {
    console.error('Get user stats error:', error);
    return c.json(
      {
        error: 'Failed to fetch user stats',
        details: error.message,
      },
      500
    );
  }
}
