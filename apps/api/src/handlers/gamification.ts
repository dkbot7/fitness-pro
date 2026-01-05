/**
 * Gamification API Handlers
 * Endpoints for streaks, achievements, and user progress
 */

import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import {
  userStreaks,
  achievements,
  userAchievements,
  workouts
} from '@fitness-pro/database';
import { eq, and, desc, sql } from 'drizzle-orm';

interface Env {
  DB: D1Database;
}

/**
 * GET /api/gamification/streak
 * Returns user's current streak, longest streak, and total workouts
 */
export async function getUserStreak(c: Context<{ Bindings: Env }>) {
  try {
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    const db = drizzle(c.env.DB);

    // Get or create streak record
    let streakRecords = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (streakRecords.length === 0) {
      // Create initial streak record
      const [newStreak] = await db
        .insert(userStreaks)
        .values({
          userId,
          currentStreak: 0,
          longestStreak: 0,
          totalWorkoutsCompleted: 0,
          lastWorkoutDate: null,
        })
        .returning();

      streakRecords = [newStreak];
    }

    const streak = streakRecords[0];

    // Check if streak is broken (>24h since last workout)
    let currentStreak = streak.currentStreak;
    if (streak.lastWorkoutDate) {
      const now = new Date();
      const lastWorkout = new Date(streak.lastWorkoutDate);
      const hoursSinceLastWorkout = (now.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60);

      // If more than 48 hours (2 days), streak is broken
      if (hoursSinceLastWorkout > 48) {
        currentStreak = 0;
        // Update in database
        await db
          .update(userStreaks)
          .set({ currentStreak: 0, updatedAt: new Date() })
          .where(eq(userStreaks.userId, userId));
      }
    }

    return c.json({
      success: true,
      streak: {
        currentStreak,
        longestStreak: streak.longestStreak,
        totalWorkoutsCompleted: streak.totalWorkoutsCompleted,
        lastWorkoutDate: streak.lastWorkoutDate,
      },
    });
  } catch (error: any) {
    console.error('Get user streak error:', error);
    return c.json(
      {
        error: 'Failed to fetch streak',
        details: error.message,
      },
      500
    );
  }
}

/**
 * GET /api/gamification/achievements
 * Returns all achievements with unlock status for current user
 * Supports pagination via query params: ?page=1&limit=20
 */
export async function getUserAchievements(c: Context<{ Bindings: Env }>) {
  try {
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    const db = drizzle(c.env.DB);

    // Get pagination params (optional - defaults to all)
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '100'); // Default: return all
    const offset = (page - 1) * limit;

    // Get total count of active achievements
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(achievements)
      .where(eq(achievements.isActive, true));

    const totalCount = countResult[0]?.count || 0;

    // Get paginated active achievements
    const allAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.isActive, true))
      .orderBy(achievements.category, achievements.requirement)
      .limit(limit)
      .offset(offset);

    // Get user's unlocked achievements
    const unlockedRecords = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const unlockedMap = new Map(
      unlockedRecords.map((ua) => [ua.achievementId, ua.unlockedAt])
    );

    // Get user's streak for progress calculation
    const streakRecords = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    const currentStreak = streakRecords[0]?.currentStreak || 0;
    const totalWorkouts = streakRecords[0]?.totalWorkoutsCompleted || 0;

    // Merge data
    const achievementsWithStatus = allAchievements.map((achievement) => {
      const isUnlocked = unlockedMap.has(achievement.id);
      const unlockedAt = unlockedMap.get(achievement.id) || null;

      // Calculate progress for locked achievements
      let progress = 0;
      if (!isUnlocked) {
        if (achievement.category === 'streak') {
          progress = Math.min(100, Math.round((currentStreak / achievement.requirement) * 100));
        } else if (achievement.category === 'milestone') {
          progress = Math.min(100, Math.round((totalWorkouts / achievement.requirement) * 100));
        }
      }

      return {
        id: achievement.id,
        slug: achievement.slug,
        namePt: achievement.namePt,
        descriptionPt: achievement.descriptionPt,
        iconName: achievement.iconName,
        category: achievement.category,
        requirement: achievement.requirement,
        rarity: achievement.rarity,
        isUnlocked,
        unlockedAt,
        progress,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return c.json({
      success: true,
      achievements: achievementsWithStatus,
      currentStreak,
      totalWorkouts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error: any) {
    console.error('Get user achievements error:', error);
    return c.json(
      {
        error: 'Failed to fetch achievements',
        details: error.message,
      },
      500
    );
  }
}

/**
 * POST /api/gamification/check-unlocks
 * Called after workout completion to check and unlock new achievements
 * Returns array of newly unlocked achievements
 */
export async function checkAndUnlockAchievements(c: Context<{ Bindings: Env }>) {
  try {
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Missing user information' }, 401);
    }

    const db = drizzle(c.env.DB);

    // Get user's current streak data
    const streakRecords = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (streakRecords.length === 0) {
      return c.json({ success: true, newAchievements: [] });
    }

    const streak = streakRecords[0];
    const currentStreak = streak.currentStreak;
    const totalWorkouts = streak.totalWorkoutsCompleted;

    // Get all achievements user doesn't have yet
    const existingAchievements = await db
      .select({ achievementId: userAchievements.achievementId })
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const existingIds = new Set(existingAchievements.map((ua) => ua.achievementId));

    const allAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.isActive, true));

    // Check which achievements should be unlocked
    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (existingIds.has(achievement.id)) continue;

      let shouldUnlock = false;

      // Check based on category
      if (achievement.category === 'streak') {
        shouldUnlock = currentStreak >= achievement.requirement;
      } else if (achievement.category === 'milestone') {
        shouldUnlock = totalWorkouts >= achievement.requirement;
      }
      // Special achievements handled separately (TODO: implement time-based, etc.)

      if (shouldUnlock) {
        // Unlock the achievement
        await db.insert(userAchievements).values({
          userId,
          achievementId: achievement.id,
          unlockedAt: new Date(),
        });

        newlyUnlocked.push({
          id: achievement.id,
          slug: achievement.slug,
          namePt: achievement.namePt,
          descriptionPt: achievement.descriptionPt,
          iconName: achievement.iconName,
          rarity: achievement.rarity,
        });
      }
    }

    return c.json({
      success: true,
      newAchievements: newlyUnlocked,
      totalUnlocked: newlyUnlocked.length,
    });
  } catch (error: any) {
    console.error('Check achievements error:', error);
    return c.json(
      {
        error: 'Failed to check achievements',
        details: error.message,
      },
      500
    );
  }
}

/**
 * Helper function to update user streak after workout completion
 * Called from completeWorkout handler in training.ts
 */
export async function updateUserStreak(
  db: any,
  userId: string
): Promise<{ currentStreak: number; newAchievements: any[] }> {
  try {
    // Get or create streak record
    let streakRecords = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    const now = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let totalWorkouts = 0;

    if (streakRecords.length === 0) {
      // First workout ever - create record
      const [newStreak] = await db
        .insert(userStreaks)
        .values({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          totalWorkoutsCompleted: 1,
          lastWorkoutDate: now,
          updatedAt: now,
        })
        .returning();

      currentStreak = 1;
      longestStreak = 1;
      totalWorkouts = 1;
    } else {
      const streak = streakRecords[0];
      const lastWorkout = streak.lastWorkoutDate ? new Date(streak.lastWorkoutDate) : null;

      totalWorkouts = streak.totalWorkoutsCompleted + 1;

      if (!lastWorkout) {
        // First workout
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const hoursSinceLastWorkout = (now.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastWorkout <= 48) {
          // Within 48 hours - continue streak
          currentStreak = streak.currentStreak + 1;
          longestStreak = Math.max(streak.longestStreak, currentStreak);
        } else {
          // Streak broken - start over
          currentStreak = 1;
          longestStreak = streak.longestStreak; // Keep historical record
        }
      }

      // Update streak
      await db
        .update(userStreaks)
        .set({
          currentStreak,
          longestStreak,
          totalWorkoutsCompleted: totalWorkouts,
          lastWorkoutDate: now,
          updatedAt: now,
        })
        .where(eq(userStreaks.userId, userId));
    }

    // Check for newly unlocked achievements
    const existingAchievements = await db
      .select({ achievementId: userAchievements.achievementId })
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const existingIds = new Set(existingAchievements.map((ua: any) => ua.achievementId));

    const allAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.isActive, true));

    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      if (existingIds.has(achievement.id)) continue;

      let shouldUnlock = false;

      if (achievement.category === 'streak') {
        shouldUnlock = currentStreak >= achievement.requirement;
      } else if (achievement.category === 'milestone') {
        shouldUnlock = totalWorkouts >= achievement.requirement;
      }

      if (shouldUnlock) {
        await db.insert(userAchievements).values({
          userId,
          achievementId: achievement.id,
          unlockedAt: now,
        });

        newlyUnlocked.push({
          id: achievement.id,
          slug: achievement.slug,
          namePt: achievement.namePt,
          descriptionPt: achievement.descriptionPt,
          iconName: achievement.iconName,
          rarity: achievement.rarity,
        });
      }
    }

    return {
      currentStreak,
      newAchievements: newlyUnlocked,
    };
  } catch (error) {
    console.error('Update user streak error:', error);
    throw error;
  }
}
