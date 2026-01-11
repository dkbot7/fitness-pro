/**
 * Workout Generator Service
 *
 * Generates personalized workout plans based on user profile (onboarding data).
 * Uses rules-based algorithm (no ML) to create Week 1 workout plan.
 */

import { EXERCISES, translateEquipmentToDatabase, type Exercise } from '@fitness-pro/shared';

export interface UserProfile {
  goal: 'lose_weight' | 'gain_muscle' | 'maintenance';
  frequencyPerWeek: number; // 2-6
  location: 'home' | 'gym';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  limitations: string[];
}

export interface WorkoutExercise {
  exerciseId: number; // Will be looked up from DB
  exerciseSlug: string;
  orderIndex: number;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  notesPt: string;
}

export interface Workout {
  dayOfWeek: number; // 1-7 (Monday-Sunday)
  workoutType: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  weekNumber: number;
  workouts: Workout[];
}

type SplitType = 'full_body' | 'upper_lower_full' | 'upper_lower' | 'push_pull_legs';

/**
 * Main function: Generate initial workout plan (Week 1 or specific week)
 */
export function generateInitialWorkoutPlan(profile: UserProfile, weekNumber: number = 1): WorkoutPlan {
  // Step 1: Determine training split based on frequency
  const split = determineSplit(profile.frequencyPerWeek);

  // Step 2: Filter exercises by equipment, limitations, and experience
  const availableExercises = filterExercises(profile);

  // Step 3: Generate workouts for each training day
  const workouts: Workout[] = [];
  for (let day = 0; day < profile.frequencyPerWeek; day++) {
    const muscleGroups = getMuscleGroupsForDay(split, day);
    const workout = generateWorkout({
      dayOfWeek: day + 1, // 1-based (Monday = 1)
      muscleGroups,
      availableExercises,
      goal: profile.goal,
      experienceLevel: profile.experienceLevel,
    });
    workouts.push(workout);
  }

  // Apply progressive overload if not Week 1
  const progressedWorkouts = workouts.map(workout =>
    applyProgressiveOverload(workout, weekNumber, profile.experienceLevel, availableExercises)
  );

  return {
    weekNumber,
    workouts: progressedWorkouts,
  };
}

/**
 * Determine training split based on frequency
 * Research: 2-3x = full body, 3x = ULF, 4x = UL, 5-6x = PPL
 */
function determineSplit(frequency: number): SplitType {
  if (frequency <= 2) return 'full_body';
  if (frequency === 3) return 'upper_lower_full';
  if (frequency === 4) return 'upper_lower';
  return 'push_pull_legs'; // 5-6x
}

/**
 * Get muscle groups to train for a specific day based on split type
 */
function getMuscleGroupsForDay(split: SplitType, dayIndex: number): string[] {
  const schedules = {
    full_body: [
      ['chest', 'back', 'legs', 'shoulders', 'abs'], // Day 1
      ['chest', 'back', 'legs', 'shoulders', 'abs'], // Day 2
    ],
    upper_lower_full: [
      ['chest', 'back', 'shoulders', 'biceps', 'triceps'], // Upper
      ['legs', 'glutes', 'abs', 'core'], // Lower
      ['chest', 'back', 'legs', 'shoulders', 'abs'], // Full Body
    ],
    upper_lower: [
      ['chest', 'back', 'shoulders', 'biceps', 'triceps'], // Upper 1
      ['legs', 'glutes', 'abs', 'core'], // Lower 1
      ['chest', 'back', 'shoulders', 'biceps', 'triceps'], // Upper 2
      ['legs', 'glutes', 'abs', 'core'], // Lower 2
    ],
    push_pull_legs: [
      ['chest', 'shoulders', 'triceps'], // Push
      ['back', 'biceps'], // Pull
      ['legs', 'glutes', 'abs'], // Legs
      ['chest', 'shoulders', 'triceps'], // Push 2
      ['back', 'biceps'], // Pull 2
      ['legs', 'glutes', 'abs'], // Legs 2
    ],
  };

  const schedule = schedules[split];
  return schedule[dayIndex % schedule.length];
}

/**
 * Filter exercises based on user's equipment, limitations, and experience level
 */
function filterExercises(profile: UserProfile): Exercise[] {
  // Translate equipment from English (frontend) to Portuguese (database)
  const translatedEquipment = translateEquipmentToDatabase(profile.equipment);

  return EXERCISES.filter((exercise) => {
    // Check equipment availability
    const hasRequiredEquipment = exercise.equipmentRequired.every((eq) =>
      eq === 'bodyweight' || translatedEquipment.includes(eq)
    );

    // Check contraindications (limitations)
    const noContraindications = !exercise.contraindications.some((contra) =>
      profile.limitations.includes(contra)
    );

    // Check difficulty level
    const appropriateDifficulty = isAppropriateDifficulty(
      exercise.difficulty,
      profile.experienceLevel
    );

    return hasRequiredEquipment && noContraindications && appropriateDifficulty;
  });
}

/**
 * Check if exercise difficulty matches user's experience level
 */
function isAppropriateDifficulty(
  exerciseDifficulty: string,
  userLevel: string
): boolean {
  if (userLevel === 'beginner') return exerciseDifficulty !== 'advanced';
  if (userLevel === 'advanced') return exerciseDifficulty !== 'beginner';
  return true; // Intermediate can do all
}

/**
 * Generate a single workout for a specific day
 */
function generateWorkout(params: {
  dayOfWeek: number;
  muscleGroups: string[];
  availableExercises: Exercise[];
  goal: string;
  experienceLevel: string;
}): Workout {
  const { dayOfWeek, muscleGroups, availableExercises, goal, experienceLevel } = params;

  // Select exercises targeting the muscle groups
  const selectedExercises = selectExercises(
    muscleGroups,
    availableExercises,
    experienceLevel === 'beginner' ? 5 : 6 // 5-6 exercises per workout
  );

  // Assign sets/reps/rest based on goal
  const workoutExercises: WorkoutExercise[] = selectedExercises.map((exercise, index) => {
    const { sets, reps, rest } = getVolumeParameters(goal, experienceLevel);

    return {
      exerciseId: 0, // Will be looked up from DB by slug
      exerciseSlug: exercise.slug,
      orderIndex: index,
      sets,
      repsMin: reps.min,
      repsMax: reps.max,
      restSeconds: rest,
      notesPt: getNotesPt(goal),
    };
  });

  return {
    dayOfWeek,
    workoutType: muscleGroups.join('_'),
    exercises: workoutExercises,
  };
}

/**
 * Select exercises for target muscle groups
 */
function selectExercises(
  targetMuscleGroups: string[],
  availableExercises: Exercise[],
  count: number
): Exercise[] {
  const selected: Exercise[] = [];
  const used = new Set<string>();

  // First pass: Select at least one exercise per primary muscle group
  for (const muscleGroup of targetMuscleGroups) {
    const candidates = availableExercises.filter(
      (ex) => ex.muscleGroups.includes(muscleGroup) && !used.has(ex.slug)
    );

    if (candidates.length > 0) {
      // Prefer compound movements (multiple muscle groups)
      candidates.sort((a, b) => b.muscleGroups.length - a.muscleGroups.length);
      const chosen = candidates[0];
      selected.push(chosen);
      used.add(chosen.slug);
    }
  }

  // Second pass: Fill remaining slots with best exercises
  while (selected.length < count) {
    const candidates = availableExercises.filter((ex) => !used.has(ex.slug));

    if (candidates.length === 0) break;

    // Score exercises by relevance to target muscle groups
    const scored = candidates.map((ex) => ({
      exercise: ex,
      score: ex.muscleGroups.filter((mg) => targetMuscleGroups.includes(mg)).length,
    }));

    scored.sort((a, b) => b.score - a.score);
    const chosen = scored[0].exercise;
    selected.push(chosen);
    used.add(chosen.slug);
  }

  return selected;
}

/**
 * Get volume parameters (sets, reps, rest) based on goal and experience
 */
function getVolumeParameters(
  goal: string,
  experienceLevel: string
): { sets: number; reps: { min: number; max: number }; rest: number } {
  const baseSets = {
    lose_weight: 3,
    gain_muscle: 4,
    maintenance: 3,
  };

  const reps = {
    lose_weight: { min: 12, max: 15 }, // Higher reps, lighter weight, fat burn
    gain_muscle: { min: 8, max: 12 }, // Hypertrophy range
    maintenance: { min: 10, max: 12 },
  };

  const rest = {
    lose_weight: 45, // Shorter rest, keep heart rate up
    gain_muscle: 90, // Longer rest for strength
    maintenance: 60,
  };

  const sets = experienceLevel === 'beginner'
    ? baseSets[goal as keyof typeof baseSets] - 1
    : baseSets[goal as keyof typeof baseSets];

  return {
    sets,
    reps: reps[goal as keyof typeof reps],
    rest: rest[goal as keyof typeof rest],
  };
}

/**
 * Get exercise notes based on goal
 */
function getNotesPt(goal: string): string {
  const notes = {
    lose_weight: 'Mantenha um ritmo constante e descansos curtos',
    gain_muscle: 'Foque na técnica e aumente a carga progressivamente',
    maintenance: 'Execute com boa técnica e controle',
  };

  return notes[goal as keyof typeof notes] || '';
}

/**
 * Get total weeks for experience level
 */
export function getTotalWeeksForExperience(level: string): number {
  const weeks = {
    beginner: 4,
    intermediate: 8,
    advanced: 12
  };
  return weeks[level as keyof typeof weeks] || 8;
}

/**
 * Calculate difficulty multiplier based on week number
 */
export function calculateDifficultyMultiplier(weekNumber: number): number {
  if (weekNumber <= 8) return 1.0;
  // Semanas 9-12: aumentar gradualmente de 1.0 para 1.2
  return 1.0 + ((weekNumber - 8) * 0.05);
}

/**
 * Find a harder exercise variation for progressive overload
 */
function getHarderExerciseVariation(
  currentExercise: Exercise,
  availableExercises: Exercise[]
): Exercise | null {
  // Buscar exercício com mesmo muscle group mas difficulty maior
  const sameGroup = availableExercises.filter(ex =>
    ex.muscleGroups.some(mg => currentExercise.muscleGroups.includes(mg)) &&
    ex.slug !== currentExercise.slug
  );

  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
  const currentDiffIndex = difficultyOrder.indexOf(currentExercise.difficulty);

  const harder = sameGroup.find(ex =>
    difficultyOrder.indexOf(ex.difficulty) > currentDiffIndex
  );

  return harder || null;
}

/**
 * Apply progressive overload to a workout based on week number
 */
function applyProgressiveOverload(
  baseWorkout: Workout,
  weekNumber: number,
  experienceLevel: string,
  availableExercises: Exercise[]
): Workout {
  // Semanas 1-2: sem mudanças (baseline)
  if (weekNumber <= 2) return baseWorkout;

  // Semanas 3-4: +1 set
  if (weekNumber <= 4) {
    return {
      ...baseWorkout,
      exercises: baseWorkout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets + 1
      }))
    };
  }

  // Semanas 5-6: +2 reps
  if (weekNumber <= 6) {
    return {
      ...baseWorkout,
      exercises: baseWorkout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets + 1,
        repsMin: ex.repsMin + 2,
        repsMax: ex.repsMax + 2
      }))
    };
  }

  // Semanas 7-8: trocar exercícios por variações mais difíceis
  if (weekNumber <= 8) {
    const exercises = baseWorkout.exercises.map(ex => {
      const currentExercise = availableExercises.find(e => e.slug === ex.exerciseSlug);
      if (!currentExercise) return ex;

      const harder = getHarderExerciseVariation(currentExercise, availableExercises);
      return harder ? { ...ex, exerciseSlug: harder.slug } : ex;
    });

    return { ...baseWorkout, exercises };
  }

  // Semanas 9-10: reduzir descanso
  if (weekNumber <= 10) {
    return {
      ...baseWorkout,
      exercises: baseWorkout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets + 1,
        repsMin: ex.repsMin + 2,
        repsMax: ex.repsMax + 2,
        restSeconds: Math.max(30, ex.restSeconds - 15)
      }))
    };
  }

  // Semanas 11-12: manter progressão
  return {
    ...baseWorkout,
    exercises: baseWorkout.exercises.map(ex => ({
      ...ex,
      sets: ex.sets + 1,
      repsMin: ex.repsMin + 2,
      repsMax: ex.repsMax + 2,
      restSeconds: Math.max(30, ex.restSeconds - 15)
    }))
  };
}

/**
 * Generate multi-week workout plan with progressive overload
 */
export function generateMultiWeekPlan(
  profile: UserProfile,
  totalWeeks: number
): WorkoutPlan[] {
  const plans: WorkoutPlan[] = [];

  for (let week = 1; week <= totalWeeks; week++) {
    const weekPlan = generateInitialWorkoutPlan(profile, week);
    plans.push(weekPlan);
  }

  return plans;
}
