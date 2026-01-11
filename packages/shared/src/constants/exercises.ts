export interface Exercise {
  slug: string;
  namePt: string;
  muscleGroups: string[];
  equipmentRequired: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  descriptionPt: string;
  contraindications: string[];
}

export const EXERCISES: Exercise[] = [
  // ===== Bodyweight Exercises (Home + Gym) =====
  {
    slug: 'push-ups',
    namePt: 'Flexão de Braço',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'intermediate',
    descriptionPt: 'Deite-se de bruços, mãos na largura dos ombros, empurre o corpo para cima mantendo o core ativado.',
    contraindications: ['shoulder_pain', 'wrist_pain'],
  },
  {
    slug: 'push-ups-beginner',
    namePt: 'Flexão de Joelhos',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Flexão com os joelhos apoiados no chão, ideal para iniciantes desenvolverem força no peito e tríceps.',
    contraindications: ['shoulder_pain', 'wrist_pain'],
  },
  {
    slug: 'bodyweight-squats',
    namePt: 'Agachamento Livre',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Pés na largura dos ombros, desça como se fosse sentar, joelhos alinhados com os pés.',
    contraindications: ['knee_pain'],
  },
  {
    slug: 'burpees',
    namePt: 'Burpee',
    muscleGroups: ['full_body', 'cardio'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'advanced',
    descriptionPt: 'Agachamento, apoie as mãos, salto para prancha, flexão, pule de volta e salte para cima.',
    contraindications: ['knee_pain', 'back_pain', 'shoulder_pain'],
  },
  {
    slug: 'plank',
    namePt: 'Prancha Abdominal',
    muscleGroups: ['core', 'abs'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Apoie os antebraços e pontas dos pés, mantenha o corpo reto, core contraído.',
    contraindications: ['back_pain', 'shoulder_pain'],
  },
  {
    slug: 'mountain-climbers',
    namePt: 'Alpinista',
    muscleGroups: ['core', 'abs', 'cardio'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'intermediate',
    descriptionPt: 'Posição de prancha alta, alterne trazendo os joelhos em direção ao peito rapidamente.',
    contraindications: ['wrist_pain', 'shoulder_pain'],
  },
  {
    slug: 'lunges',
    namePt: 'Afundo',
    muscleGroups: ['legs', 'glutes'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Dê um passo à frente, desça até o joelho traseiro quase tocar o chão, suba e alterne.',
    contraindications: ['knee_pain'],
  },
  {
    slug: 'tricep-dips-chair',
    namePt: 'Mergulho em Cadeira',
    muscleGroups: ['triceps', 'shoulders'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Apoie as mãos em uma cadeira, desça flexionando os cotovelos, foca nos tríceps.',
    contraindications: ['shoulder_pain', 'elbow_pain'],
  },
  {
    slug: 'crunches',
    namePt: 'Abdominal Tradicional',
    muscleGroups: ['abs', 'core'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Deitado, joelhos flexionados, mãos atrás da cabeça, levante o tronco contraindo o abdômen.',
    contraindications: ['neck_pain', 'back_pain'],
  },
  {
    slug: 'jumping-jacks',
    namePt: 'Polichinelo',
    muscleGroups: ['full_body', 'cardio'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Salte abrindo pernas e braços simultaneamente, depois volte à posição inicial.',
    contraindications: ['knee_pain'],
  },
  {
    slug: 'glute-bridges',
    namePt: 'Ponte de Glúteo',
    muscleGroups: ['glutes', 'legs', 'core'],
    equipmentRequired: ['bodyweight'],
    difficulty: 'beginner',
    descriptionPt: 'Deitado de costas, joelhos flexionados, levante o quadril contraindo os glúteos.',
    contraindications: ['back_pain'],
  },

  // Note: More exercises with equipment will be added as they're seeded in the database
];
