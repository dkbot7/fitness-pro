import type { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { profiles, workoutPlans, workouts, users } from '@fitness-pro/database';
import { eq, and, desc, sql } from 'drizzle-orm';
import type { AppContext } from '../types/hono';

/**
 * GET /api/users/me/profile
 * Get user profile and workout preferences
 */
export async function getUserProfile(c: Context<AppContext>) {
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
export async function getUserStats(c: Context<AppContext>) {
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

/**
 * GET /api/users/me/workouts/history
 * Get paginated workout history
 * Supports query params: ?page=1&limit=20&status=completed
 */
export async function getWorkoutHistory(c: Context<AppContext>) {
  try {
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    const db = drizzle(c.env.DB);

    // Get pagination params
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100); // Max 100 per page
    const offset = (page - 1) * limit;
    const statusFilter = c.req.query('status'); // Optional: completed, pending, skipped

    // Build where conditions
    let whereConditions = eq(workouts.userId, userId);
    if (statusFilter && ['completed', 'pending', 'skipped'].includes(statusFilter)) {
      whereConditions = and(
        eq(workouts.userId, userId),
        eq(workouts.status, statusFilter as any)
      ) as any;
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(workouts)
      .where(whereConditions);

    const totalCount = countResult[0]?.count || 0;

    // Get paginated workouts
    const workoutRecords = await db
      .select()
      .from(workouts)
      .where(whereConditions)
      .orderBy(desc(workouts.completedAt), desc(workouts.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    return c.json({
      success: true,
      workouts: workoutRecords,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error: any) {
    console.error('Get workout history error:', error);
    return c.json(
      {
        error: 'Failed to fetch workout history',
        details: error.message,
      },
      500
    );
  }
}
