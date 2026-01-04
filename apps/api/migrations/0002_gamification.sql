-- Gamification System
-- SQLite (D1) Compatible

-- User streaks (gamification)
CREATE TABLE IF NOT EXISTS user_streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_workout_date TEXT,
  total_workouts_completed INTEGER DEFAULT 0 NOT NULL,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_pt TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement INTEGER NOT NULL,
  rarity TEXT NOT NULL,
  is_active INTEGER DEFAULT 1 NOT NULL,
  created_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX idx_achievements_slug ON achievements(slug);
CREATE INDEX idx_achievements_category ON achievements(category);

-- User achievements (unlocked badges)
CREATE TABLE IF NOT EXISTS user_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TEXT DEFAULT (datetime('now')) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
