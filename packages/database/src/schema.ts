import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table (synced from Clerk)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// User profiles (onboarding data)
export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  goal: text('goal').notNull(), // 'lose_weight', 'gain_muscle', 'maintenance'
  frequencyPerWeek: integer('frequency_per_week').notNull(),
  location: text('location').notNull(), // 'home', 'gym'
  experienceLevel: text('experience_level').notNull(), // 'beginner', 'intermediate', 'advanced'
  limitations: text('limitations'), // JSON array
  equipment: text('equipment'), // JSON array
  currentWeightKg: real('current_weight_kg'),
  heightCm: integer('height_cm'),
  age: integer('age'),
  gender: text('gender'),
  onboardingCompletedAt: integer('onboarding_completed_at', { mode: 'timestamp' }),
  currentWeek: integer('current_week').default(1).notNull(),
  planStartDate: integer('plan_start_date', { mode: 'timestamp' }),
  planTotalWeeks: integer('plan_total_weeks').default(8).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('profiles_user_id_idx').on(table.userId),
}));

// Exercise library
export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  namePt: text('name_pt').notNull(),
  muscleGroups: text('muscle_groups').notNull(), // JSON array
  equipmentRequired: text('equipment_required'), // JSON array
  difficulty: text('difficulty').notNull(), // 'beginner', 'intermediate', 'advanced'
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  descriptionPt: text('description_pt'),
  contraindications: text('contraindications'), // JSON array
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Workout plans (weekly)
export const workoutPlans = sqliteTable('workout_plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  weekNumber: integer('week_number').notNull(),
  status: text('status').default('active').notNull(), // 'active', 'completed'
  difficultyMultiplier: real('difficulty_multiplier').default(1.0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  endsAt: integer('ends_at', { mode: 'timestamp' }),
}, (table) => ({
  userIdIdx: index('workout_plans_user_id_idx').on(table.userId),
  userWeekIdx: index('workout_plans_user_week_idx').on(table.userId, table.weekNumber),
}));

// Individual workouts
export const workouts = sqliteTable('workouts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  planId: integer('plan_id').notNull().references(() => workoutPlans.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 1-7
  workoutType: text('workout_type').notNull(), // 'upper_body', 'lower_body', 'full_body'
  status: text('status').default('pending').notNull(), // 'pending', 'completed', 'skipped'
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('workouts_user_id_idx').on(table.userId),
  planIdIdx: index('workouts_plan_id_idx').on(table.planId),
}));

// Workout exercises (junction table)
export const workoutExercises = sqliteTable('workout_exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workoutId: integer('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
  orderIndex: integer('order_index').notNull(),
  sets: integer('sets').notNull(),
  repsMin: integer('reps_min'),
  repsMax: integer('reps_max'),
  restSeconds: integer('rest_seconds').default(60).notNull(),
  notesPt: text('notes_pt'),
}, (table) => ({
  workoutOrderIdx: index('workout_exercises_workout_order_idx').on(table.workoutId, table.orderIndex),
}));

// Workout feedback
export const workoutFeedback = sqliteTable('workout_feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workoutId: integer('workout_id').notNull().unique().references(() => workouts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  difficultyRating: text('difficulty_rating').notNull(), // 'easy', 'ok', 'hard'
  durationMinutes: integer('duration_minutes'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  workoutIdIdx: index('workout_feedback_workout_id_idx').on(table.workoutId),
  userIdIdx: index('workout_feedback_user_id_idx').on(table.userId),
}));

// User streaks (gamification)
export const userStreaks = sqliteTable('user_streaks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0).notNull(), // Days
  longestStreak: integer('longest_streak').default(0).notNull(), // Days
  lastWorkoutDate: integer('last_workout_date', { mode: 'timestamp' }),
  totalWorkoutsCompleted: integer('total_workouts_completed').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('user_streaks_user_id_idx').on(table.userId),
}));

// Achievements/Badges
export const achievements = sqliteTable('achievements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  namePt: text('name_pt').notNull(),
  descriptionPt: text('description_pt').notNull(),
  iconName: text('icon_name').notNull(), // Lucide icon name
  category: text('category').notNull(), // 'streak', 'milestone', 'special'
  requirement: integer('requirement').notNull(), // Number needed to unlock (e.g., 7 for week streak)
  rarity: text('rarity').notNull(), // 'common', 'rare', 'epic', 'legendary'
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// User achievements (unlocked badges)
export const userAchievements = sqliteTable('user_achievements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: integer('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('user_achievements_user_id_idx').on(table.userId),
  achievementIdIdx: index('user_achievements_achievement_id_idx').on(table.achievementId),
  userAchievementIdx: index('user_achievements_user_achievement_idx').on(table.userId, table.achievementId),
}));

// Push notification subscriptions
export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('push_subscriptions_user_id_idx').on(table.userId),
  endpointIdx: index('push_subscriptions_endpoint_idx').on(table.endpoint),
}));

// Notification logs (for frequency tracking)
export const notificationLogs = sqliteTable('notification_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  notificationType: text('notification_type'),
  sentAt: integer('sent_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('notification_logs_user_id_idx').on(table.userId),
  sentAtIdx: index('notification_logs_sent_at_idx').on(table.sentAt),
}));

// Notification preferences
export const notificationPreferences = sqliteTable('notification_preferences', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  streakReminders: integer('streak_reminders', { mode: 'boolean' }).default(true).notNull(),
  achievementNotifications: integer('achievement_notifications', { mode: 'boolean' }).default(true).notNull(),
  weeklySummaries: integer('weekly_summaries', { mode: 'boolean' }).default(true).notNull(),
  workoutReminders: integer('workout_reminders', { mode: 'boolean' }).default(true).notNull(),
  maxPerDay: integer('max_per_day').default(1).notNull(),
  maxPerWeek: integer('max_per_week').default(5).notNull(),
});
