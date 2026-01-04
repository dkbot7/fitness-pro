-- Migration: Add gamification tables (streaks, achievements, user_achievements)
-- Created: 2026-01-04

-- Table: user_streaks
CREATE TABLE IF NOT EXISTS "user_streaks" (
  "id" SERIAL PRIMARY KEY,
  "user_id" VARCHAR(255) NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "current_streak" INTEGER DEFAULT 0 NOT NULL,
  "longest_streak" INTEGER DEFAULT 0 NOT NULL,
  "last_workout_date" TIMESTAMP,
  "total_workouts_completed" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX "user_streaks_user_id_idx" ON "user_streaks"("user_id");

-- Table: achievements
CREATE TABLE IF NOT EXISTS "achievements" (
  "id" SERIAL PRIMARY KEY,
  "slug" VARCHAR(100) NOT NULL UNIQUE,
  "name_pt" VARCHAR(255) NOT NULL,
  "description_pt" TEXT NOT NULL,
  "icon_name" VARCHAR(100) NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "requirement" INTEGER NOT NULL,
  "rarity" VARCHAR(20) NOT NULL,
  "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table: user_achievements
CREATE TABLE IF NOT EXISTS "user_achievements" (
  "id" SERIAL PRIMARY KEY,
  "user_id" VARCHAR(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "achievement_id" INTEGER NOT NULL REFERENCES "achievements"("id") ON DELETE CASCADE,
  "unlocked_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX "user_achievements_user_id_idx" ON "user_achievements"("user_id");
CREATE INDEX "user_achievements_achievement_id_idx" ON "user_achievements"("achievement_id");
CREATE UNIQUE INDEX "user_achievements_user_achievement_unique" ON "user_achievements"("user_id", "achievement_id");
