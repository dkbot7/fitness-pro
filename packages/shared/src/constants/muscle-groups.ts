export const MUSCLE_GROUPS = {
  chest: 'Peito',
  back: 'Costas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  legs: 'Pernas',
  glutes: 'Glúteos',
  abs: 'Abdômen',
  core: 'Core',
  cardio: 'Cardio',
  full_body: 'Corpo Inteiro',
} as const;

export type MuscleGroup = keyof typeof MUSCLE_GROUPS;
