-- Initial Database Schema for Fitness Pro
-- SQLite (D1) Compatible

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

-- User profiles (onboarding data)
CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  frequency_per_week INTEGER NOT NULL,
  location TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  equipment TEXT,
  limitations TEXT,
  onboarding_completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Workout plans
CREATE TABLE IF NOT EXISTS workout_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  difficulty_multiplier TEXT DEFAULT '1.0' NOT NULL,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX idx_workout_plans_week ON workout_plans(week_number);

-- Exercises library
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_pt TEXT NOT NULL,
  description_pt TEXT,
  muscle_groups TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  equipment_needed TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  is_active INTEGER DEFAULT 1 NOT NULL,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_exercises_slug ON exercises(slug);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);

-- Workouts (daily sessions)
CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id INTEGER NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  workout_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_workouts_plan_id ON workouts(plan_id);
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_status ON workouts(status);

-- Workout exercises (junction table with sets/reps)
CREATE TABLE IF NOT EXISTS workout_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  reps_min INTEGER,
  reps_max INTEGER,
  rest_seconds INTEGER NOT NULL,
  notes_pt TEXT,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);

-- User feedback
CREATE TABLE IF NOT EXISTS user_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_id INTEGER REFERENCES workouts(id) ON DELETE SET NULL,
  difficulty_rating INTEGER NOT NULL,
  feedback_text TEXT,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX idx_user_feedback_workout_id ON user_feedback(workout_id);
