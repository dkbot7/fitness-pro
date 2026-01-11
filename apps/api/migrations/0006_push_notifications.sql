-- Migration: Push Notifications Support
-- Created: 2026-01-11
-- Purpose: Add push subscription tracking and notification logs

-- Push subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Notification logs for frequency tracking
-- Best Practice: Max 1/day, <5/week (Reteno 2026)
CREATE TABLE IF NOT EXISTS notification_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT, -- 'streak_reminder', 'achievement', 'weekly_summary', etc.
  sent_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_notification_logs_user_sent ON notification_logs(user_id, sent_at);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  streak_reminders INTEGER NOT NULL DEFAULT 1, -- 1 = enabled, 0 = disabled
  achievement_notifications INTEGER NOT NULL DEFAULT 1,
  weekly_summaries INTEGER NOT NULL DEFAULT 1,
  workout_reminders INTEGER NOT NULL DEFAULT 1,
  max_per_day INTEGER NOT NULL DEFAULT 1,
  max_per_week INTEGER NOT NULL DEFAULT 5,
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
