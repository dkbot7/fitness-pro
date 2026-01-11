/**
 * Push Notifications Handler - PWA Best Practices 2026
 *
 * Best Practices from Research:
 * - Request permission AFTER user sees value (Analytics Insight)
 * - Max 1 notification/day, <5/week (Reteno Guide 2026)
 * - Personalize messages and time strategically (MagicBell)
 * - iOS 16.4+ support requires Home Screen install
 * - GDPR/CCPA compliance with explicit consent
 *
 * References:
 * - https://www.analyticsinsight.net/tech-news/the-complete-guide-to-pwa-push-notifications
 * - https://reteno.com/blog/push-notification-best-practices-ultimate-guide-for-2026
 * - https://www.magicbell.com/blog/using-push-notifications-in-pwas
 */

import type { Context } from 'hono';
import type { AppContext } from '../types';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import webpush from 'web-push';
import { drizzle } from 'drizzle-orm/d1';
import { pushSubscriptions, profiles, workouts, workoutPlans } from '@fitness-pro/database';

// Configure VAPID details
function configureVAPID(env: any) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
    console.warn('[Notifications] VAPID keys not configured');
    return false;
  }

  webpush.setVapidDetails(
    'mailto:contato@fitpro.vip',
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  );

  return true;
}

/**
 * Subscribe to push notifications
 * Best Practice: Only call this AFTER user has completed first workout
 */
export async function subscribeToPush(c: Context<AppContext>) {
  const userId = c.get('userId');
  const { subscription } = await c.req.json();

  if (!subscription || !subscription.endpoint) {
    return c.json({ error: 'Invalid subscription object' }, 400);
  }

  const db = drizzle(c.env.DB);

  try {
    // Check if subscription already exists
    const existing = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint))
      .limit(1);

    if (existing.length > 0) {
      // Update user association if changed
      await db
        .update(pushSubscriptions)
        .set({
          userId,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          updatedAt: sql`CAST(strftime('%s', 'now') AS INTEGER)`,
        })
        .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
    } else {
      // Create new subscription
      await db.insert(pushSubscriptions).values({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      });
    }

    console.log(`[Notifications] User ${userId} subscribed to push`);

    return c.json({
      success: true,
      message: 'Successfully subscribed to notifications',
    });
  } catch (error) {
    console.error('[Notifications] Subscription error:', error);
    return c.json({ error: 'Failed to save subscription' }, 500);
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(c: Context<AppContext>) {
  const userId = c.get('userId');
  const { endpoint } = await c.req.json();

  const db = drizzle(c.env.DB);

  try {
    await db
      .delete(pushSubscriptions)
      .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));

    console.log(`[Notifications] User ${userId} unsubscribed`);

    return c.json({ success: true });
  } catch (error) {
    console.error('[Notifications] Unsubscribe error:', error);
    return c.json({ error: 'Failed to unsubscribe' }, 500);
  }
}

/**
 * Send push notification to user
 * Implements frequency limits: max 1/day, <5/week
 */
export async function sendPushNotification(
  env: any,
  userId: string,
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
    actions?: Array<{ action: string; title: string }>;
  }
): Promise<{ sent: number; failed: number }> {
  if (!configureVAPID(env)) {
    console.error('[Notifications] VAPID not configured');
    return { sent: 0, failed: 0 };
  }

  const db = drizzle(env.DB);

  try {
    // Check frequency limits
    const canSend = await checkFrequencyLimits(db, userId);
    if (!canSend) {
      console.log(`[Notifications] Frequency limit reached for user ${userId}`);
      return { sent: 0, failed: 0 };
    }

    // Get all active subscriptions for user
    const subscriptions = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));

    if (subscriptions.length === 0) {
      console.log(`[Notifications] No subscriptions found for user ${userId}`);
      return { sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    // Send to all subscriptions
    for (const sub of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        const payload = JSON.stringify({
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/icons/icon-192x192.png',
          badge: notification.badge || '/icons/badge-72x72.png',
          data: notification.data || {},
          actions: notification.actions || [],
        });

        await webpush.sendNotification(pushSubscription, payload);
        sent++;

        console.log(`[Notifications] Sent to ${sub.endpoint.substring(0, 50)}...`);
      } catch (error: any) {
        failed++;

        // If subscription expired (410 Gone), remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`[Notifications] Removing expired subscription ${sub.id}`);
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        } else {
          console.error('[Notifications] Send error:', error);
        }
      }
    }

    // Log notification sent
    await logNotificationSent(db, userId);

    return { sent, failed };
  } catch (error) {
    console.error('[Notifications] Error sending notifications:', error);
    return { sent: 0, failed: 1 };
  }
}

/**
 * Check frequency limits: max 1/day, <5/week
 */
async function checkFrequencyLimits(db: any, userId: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;
  const oneWeekAgo = now - 7 * 24 * 60 * 60;

  // Check daily limit (1 per day)
  const [dailyCount] = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM notification_logs
    WHERE user_id = ${userId}
      AND sent_at >= ${oneDayAgo}
  `);

  if ((dailyCount as any)?.count >= 1) {
    return false; // Already sent 1 today
  }

  // Check weekly limit (5 per week)
  const [weeklyCount] = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM notification_logs
    WHERE user_id = ${userId}
      AND sent_at >= ${oneWeekAgo}
  `);

  if ((weeklyCount as any)?.count >= 5) {
    return false; // Already sent 5 this week
  }

  return true;
}

/**
 * Log notification sent for frequency tracking
 */
async function logNotificationSent(db: any, userId: string): Promise<void> {
  await db.execute(sql`
    INSERT INTO notification_logs (user_id, sent_at)
    VALUES (${userId}, ${Math.floor(Date.now() / 1000)})
  `);
}

/**
 * Notification Templates
 * Personalized based on user context
 */
export const NotificationTemplates = {
  /**
   * Streak Reminder - Send after 20h without workout
   */
  streakReminder: (hoursWithoutWorkout: number, currentStreak: number) => ({
    title: '🔥 Não perca sua sequência!',
    body: `Você está há ${hoursWithoutWorkout}h sem treinar. Sua sequência atual: ${currentStreak} dias!`,
    data: {
      type: 'streak_reminder',
      url: '/plano',
    },
    actions: [
      { action: 'open', title: 'Ver Treinos' },
      { action: 'close', title: 'Mais Tarde' },
    ],
  }),

  /**
   * Achievement Unlocked - Send immediately
   */
  achievementUnlocked: (achievementName: string, achievementDescription: string) => ({
    title: '🏆 Nova conquista desbloqueada!',
    body: `${achievementName} - ${achievementDescription}`,
    data: {
      type: 'achievement_unlocked',
      url: '/conquistas',
    },
    actions: [{ action: 'open', title: 'Ver Conquista' }],
  }),

  /**
   * Weekly Summary - Send Sunday 18h
   */
  weeklySummary: (workoutsCompleted: number, goal: number) => ({
    title: '📊 Resumo Semanal',
    body: `Você completou ${workoutsCompleted} de ${goal} treinos esta semana! ${workoutsCompleted >= goal ? 'Parabéns! 🎉' : 'Continue firme! 💪'}`,
    data: {
      type: 'weekly_summary',
      url: '/perfil',
    },
  }),

  /**
   * Next Workout - Send on training day at 8h
   */
  nextWorkout: (workoutType: string, dayOfWeek: string) => ({
    title: '💪 Próximo treino: ' + workoutType,
    body: `Programado para hoje (${dayOfWeek}). Vamos lá!`,
    data: {
      type: 'next_workout',
      url: '/plano',
    },
    actions: [{ action: 'open', title: 'Iniciar Treino' }],
  }),

  /**
   * Week Completed - Send when all workouts done
   */
  weekCompleted: (weekNumber: number) => ({
    title: '🎉 Semana completa!',
    body: `Você completou todos os treinos da Semana ${weekNumber}. Incrível!`,
    data: {
      type: 'week_completed',
      url: '/plano',
    },
  }),

  /**
   * Motivation Boost - Send if user skipped 2+ workouts
   */
  motivationBoost: () => ({
    title: '💪 Não desista!',
    body: 'Pequenos passos levam a grandes conquistas. Que tal um treino rápido hoje?',
    data: {
      type: 'motivation',
      url: '/plano',
    },
  }),
};

/**
 * Get user notification preferences
 */
export async function getUserNotificationPreferences(c: Context<AppContext>) {
  const userId = c.get('userId');
  const db = drizzle(c.env.DB);

  try {
    const subscriptions = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));

    const isSubscribed = subscriptions.length > 0;

    return c.json({
      isSubscribed,
      subscriptionCount: subscriptions.length,
      preferences: {
        streakReminders: true, // TODO: add to database
        achievementNotifications: true,
        weeklySummaries: true,
        workoutReminders: true,
      },
    });
  } catch (error) {
    console.error('[Notifications] Error fetching preferences:', error);
    return c.json({ error: 'Failed to fetch preferences' }, 500);
  }
}
