import { z } from 'zod';

// Shared validation schema for onboarding (client + server)
export const onboardingSchema = z.object({
  // Step 1: Goal
  goal: z.enum(['lose_weight', 'gain_muscle', 'maintenance'], {
    required_error: 'Por favor, selecione seu objetivo principal',
  }),

  // Step 2: Frequency & Location
  frequencyPerWeek: z
    .number({
      required_error: 'Por favor, selecione a frequência de treino',
    })
    .int()
    .min(2, 'Mínimo de 2 treinos por semana')
    .max(6, 'Máximo de 6 treinos por semana'),

  location: z.enum(['home', 'gym'], {
    required_error: 'Por favor, selecione onde você treina',
  }),

  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Por favor, selecione seu nível de experiência',
  }),

  // Step 3: Equipment
  equipment: z
    .array(z.string())
    .min(1, 'Selecione pelo menos um equipamento disponível'),

  // Step 4: Limitations & Optional Info
  limitations: z.array(z.string()).optional().default([]),

  // Optional personal info
  currentWeightKg: z.number().positive().optional(),
  heightCm: z.number().int().positive().optional(),
  age: z.number().int().min(18).max(100).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Step-specific schemas for progressive validation
export const step1Schema = onboardingSchema.pick({ goal: true });
export const step2Schema = onboardingSchema.pick({
  frequencyPerWeek: true,
  location: true,
  experienceLevel: true,
});
export const step3Schema = onboardingSchema.pick({ equipment: true });
export const step4Schema = onboardingSchema.pick({
  limitations: true,
  currentWeightKg: true,
  heightCm: true,
  age: true,
  gender: true,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
