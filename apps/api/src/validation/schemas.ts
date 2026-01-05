import { z } from 'zod';

/**
 * Validation schemas for API endpoints using Zod
 */

// Onboarding schema
export const onboardingSchema = z.object({
  goal: z.enum(['lose_weight', 'gain_muscle', 'maintenance'], {
    errorMap: () => ({ message: 'Goal must be: lose_weight, gain_muscle, or maintenance' }),
  }),
  frequencyPerWeek: z.number().int().min(2).max(6, {
    message: 'Frequency must be between 2 and 6 workouts per week',
  }),
  location: z.enum(['home', 'gym'], {
    errorMap: () => ({ message: 'Location must be: home or gym' }),
  }),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Experience level must be: beginner, intermediate, or advanced' }),
  }),
  equipment: z.array(z.string()).default([]),
  limitations: z.array(z.string()).default([]),
  currentWeightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  age: z.number().int().positive().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Complete workout schema
export const completeWorkoutSchema = z.object({
  workoutId: z.number().int().positive({
    message: 'Workout ID must be a positive integer',
  }),
});

// Submit feedback schema
export const submitFeedbackSchema = z.object({
  workoutId: z.number().int().positive({
    message: 'Workout ID must be a positive integer',
  }),
  difficultyRating: z.enum(['easy', 'ok', 'hard'], {
    errorMap: () => ({ message: 'Difficulty rating must be: easy, ok, or hard' }),
  }),
  durationMinutes: z.number().int().positive().optional(),
  notes: z.string().max(500, {
    message: 'Notes must not exceed 500 characters',
  }).optional(),
});

// Query params schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const weekNumberSchema = z.object({
  weekNumber: z.coerce.number().int().positive(),
});

// Types
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type CompleteWorkoutInput = z.infer<typeof completeWorkoutSchema>;
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type WeekNumberQuery = z.infer<typeof weekNumberSchema>;
