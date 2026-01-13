import { z } from 'zod';

// Shared validation schema for onboarding (client + server)
export const onboardingSchema = z.object({
  // Personal info
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100).optional(),

  // Step 2: Goal
  goal: z.enum(['lose_weight', 'gain_muscle', 'maintenance'], {
    required_error: 'Por favor, selecione seu objetivo principal',
  }),
  goalDescription: z.string().max(1000).optional().default(''),

  // Step 3: Frequency & Location
  frequencyPerWeek: z
    .number({
      required_error: 'Por favor, selecione a frequência de treino',
    })
    .int()
    .min(2, 'Mínimo de 2 treinos por semana')
    .max(7, 'Máximo de 7 treinos por semana'),

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
  otherEquipment: z.string().max(500).optional().default(''),

  // Step 4: Limitations & Optional Info
  limitations: z.array(z.string()).optional().default([]),
  limitationsDescription: z.string().max(1000).optional().default(''),
  whatsappNumber: z
    .string()
    .min(10, 'Número deve ter pelo menos 10 dígitos')
    .regex(/^[0-9]+$/, 'Use apenas números (sem espaços ou caracteres especiais)'),

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
export const step3Schema = onboardingSchema.pick({ equipment: true, otherEquipment: true, limitations: true, limitationsDescription: true });
export const step4Schema = onboardingSchema.pick({
  whatsappNumber: true,
  currentWeightKg: true,
  heightCm: true,
  age: true,
  gender: true,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
