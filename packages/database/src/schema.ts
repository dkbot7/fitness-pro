import { pgTable, serial, varchar, text, integer, decimal, timestamp, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table (synced from Clerk)
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), // Clerk user ID
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User profiles (onboarding data)
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  goal: varchar('goal', { length: 50 }).notNull(), // 'lose_weight', 'gain_muscle', 'maintenance'
  frequencyPerWeek: integer('frequency_per_week').notNull(),
  location: varchar('location', { length: 50 }).notNull(), // 'home', 'gym'
  experienceLevel: varchar('experience_level', { length: 50 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  limitations: text('limitations').array(),
  equipment: text('equipment').array(),
  currentWeightKg: decimal('current_weight_kg', { precision: 5, scale: 2 }),
  heightCm: integer('height_cm'),
  age: integer('age'),
  gender: varchar('gender', { length: 20 }),
  onboardingCompletedAt: timestamp('onboarding_completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('profiles_user_id_idx').on(table.userId),
}));

// Exercise library
export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  namePt: varchar('name_pt', { length: 255 }).notNull(),
  muscleGroups: text('muscle_groups').array().notNull(),
  equipmentRequired: text('equipment_required').array(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  videoUrl: varchar('video_url', { length: 500 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  descriptionPt: text('description_pt'),
  contraindications: text('contraindications').array(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Workout plans (weekly)
export const workoutPlans = pgTable('workout_plans', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  weekNumber: integer('week_number').notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(), // 'active', 'completed'
  difficultyMultiplier: decimal('difficulty_multiplier', { precision: 3, scale: 2 }).default('1.00').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  endsAt: timestamp('ends_at'),
}, (table) => ({
  userIdIdx: index('workout_plans_user_id_idx').on(table.userId),
  userWeekUnique: uniqueIndex('workout_plans_user_week_unique').on(table.userId, table.weekNumber),
}));

// Individual workouts
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id').notNull().references(() => workoutPlans.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 1-7
  workoutType: varchar('workout_type', { length: 50 }).notNull(), // 'upper_body', 'lower_body', 'full_body'
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'completed', 'skipped'
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('workouts_user_id_idx').on(table.userId),
  planIdIdx: index('workouts_plan_id_idx').on(table.planId),
}));

// Workout exercises (junction table)
export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
  orderIndex: integer('order_index').notNull(),
  sets: integer('sets').notNull(),
  repsMin: integer('reps_min'),
  repsMax: integer('reps_max'),
  restSeconds: integer('rest_seconds').default(60).notNull(),
  notesPt: text('notes_pt'),
}, (table) => ({
  workoutOrderUnique: uniqueIndex('workout_exercises_workout_order_unique').on(table.workoutId, table.orderIndex),
}));

// Workout feedback
export const workoutFeedback = pgTable('workout_feedback', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull().unique().references(() => workouts.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  difficultyRating: varchar('difficulty_rating', { length: 50 }).notNull(), // 'easy', 'ok', 'hard'
  durationMinutes: integer('duration_minutes'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  workoutIdIdx: index('workout_feedback_workout_id_idx').on(table.workoutId),
  userIdIdx: index('workout_feedback_user_id_idx').on(table.userId),
}));

// User streaks (gamification)
export const userStreaks = pgTable('user_streaks', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0).notNull(), // Days
  longestStreak: integer('longest_streak').default(0).notNull(), // Days
  lastWorkoutDate: timestamp('last_workout_date'),
  totalWorkoutsCompleted: integer('total_workouts_completed').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_streaks_user_id_idx').on(table.userId),
}));

// Achievements/Badges
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  namePt: varchar('name_pt', { length: 255 }).notNull(),
  descriptionPt: text('description_pt').notNull(),
  iconName: varchar('icon_name', { length: 100 }).notNull(), // Lucide icon name
  category: varchar('category', { length: 50 }).notNull(), // 'streak', 'milestone', 'special'
  requirement: integer('requirement').notNull(), // Number needed to unlock (e.g., 7 for week streak)
  rarity: varchar('rarity', { length: 20 }).notNull(), // 'common', 'rare', 'epic', 'legendary'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User achievements (unlocked badges)
export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: integer('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_achievements_user_id_idx').on(table.userId),
  achievementIdIdx: index('user_achievements_achievement_id_idx').on(table.achievementId),
  userAchievementUnique: uniqueIndex('user_achievements_user_achievement_unique').on(table.userId, table.achievementId),
}));
