/**
 * Weekly Adjustment Cron Job
 *
 * Runs every Monday at 6am UTC to generate next week's workout plans
 * based on the previous week's feedback.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { adjustWeeklyPlan, getUsersNeedingAdjustment } from '../services/workout-adjuster';

interface Env {
  DATABASE_URL: string;
}

/**
 * Cloudflare Cron Handler
 * Triggered by cron schedule in wrangler.toml: "0 6 * * 1" (Monday 6am UTC)
 */
export async function handleWeeklyAdjustment(env: Env): Promise<void> {
  console.log('[CRON] Starting weekly workout adjustment...');

  try {
    const sql = neon(env.DATABASE_URL);
    const db = drizzle(sql);

    // Adjust plans for Week 1 users (generate Week 2)
    // In production, you'd determine current week dynamically
    // For now, we'll process all users who have an active Week 1 plan

    const weekToAdjust = 1; // This would be determined based on current date
    const userIds = await getUsersNeedingAdjustment(db, weekToAdjust);

    console.log(`[CRON] Found ${userIds.length} users to adjust from Week ${weekToAdjust}`);

    let successCount = 0;
    let errorCount = 0;

    for (const userId of userIds) {
      try {
        const result = await adjustWeeklyPlan(db, userId, weekToAdjust);

        if (result.success) {
          successCount++;
          console.log(`[CRON] ✓ User ${userId}: ${result.message}`);
        } else {
          errorCount++;
          console.error(`[CRON] ✗ User ${userId}: ${result.message}`);
        }
      } catch (error: any) {
        errorCount++;
        console.error(`[CRON] ✗ User ${userId} error:`, error.message);
      }
    }

    console.log(
      `[CRON] Completed: ${successCount} success, ${errorCount} errors out of ${userIds.length} total`
    );
  } catch (error: any) {
    console.error('[CRON] Fatal error in weekly adjustment:', error);
    throw error;
  }
}
