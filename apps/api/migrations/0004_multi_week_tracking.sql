-- Migration: Add week tracking to profiles table
-- Date: 2026-01-10
-- Description: Add fields to track current week, plan start date, and total weeks for multi-week workout plans

ALTER TABLE profiles ADD COLUMN current_week INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE profiles ADD COLUMN plan_start_date INTEGER;
ALTER TABLE profiles ADD COLUMN plan_total_weeks INTEGER DEFAULT 8 NOT NULL;
