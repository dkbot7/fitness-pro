/**
 * React Query Hooks for Training Methodology System
 *
 * Production-ready hooks using @tanstack/react-query.
 * Copy this file to your frontend project (e.g., src/hooks/use-methodology.ts)
 *
 * @example
 * ```typescript
 * import { useGenerateWorkout } from '@/hooks/use-methodology';
 *
 * function MyComponent() {
 *   const { mutate, data, isPending } = useGenerateWorkout();
 *
 *   return <button onClick={() => mutate(1)}>Generate Workout</button>;
 * }
 * ```
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { methodologyAPI } from '@/lib/methodology-api-client';
import type {
  WorkoutPlan,
  ProgressRecord,
  RecoveryMetrics,
  TrainingProgram,
} from '@/lib/methodology-api-client';

// ============================================================================
// Query Keys
// ============================================================================

export const methodologyKeys = {
  all: ['methodology'] as const,
  available: () => [...methodologyKeys.all, 'available'] as const,
  programInfo: () => [...methodologyKeys.all, 'program-info'] as const,
  plan: (planId: number) => [...methodologyKeys.all, 'plan', planId] as const,

  progress: {
    all: ['progress'] as const,
    exercise: (exerciseId: number) => ['progress', 'exercise', exerciseId] as const,
    weeklyVolume: (weekNumber: number) =>
      ['progress', 'weekly-volume', weekNumber] as const,
    personalRecords: () => ['progress', 'personal-records'] as const,
  },

  recovery: {
    all: ['recovery'] as const,
    history: (days: number) => ['recovery', 'history', days] as const,
    status: () => ['recovery', 'status'] as const,
  },

  ai: {
    explanation: () => ['ai', 'explanation'] as const,
    nutrition: () => ['ai', 'nutrition'] as const,
    recoveryAnalysis: () => ['ai', 'recovery-analysis'] as const,
  },
};

// ============================================================================
// Methodology Hooks
// ============================================================================

/**
 * Check if methodology system is available for the current user
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useMethodologyAvailable();
 *
 * if (data?.available) {
 *   // Show methodology-based workout generation
 * } else {
 *   // Show legacy system or prompt to complete onboarding
 * }
 * ```
 */
export function useMethodologyAvailable() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.available(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.checkAvailability(token);
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

/**
 * Get the user's training program details
 *
 * @example
 * ```typescript
 * const { data } = useProgramInfo();
 *
 * console.log('Program:', data?.program.recommendedSplit);
 * console.log('Volume:', data?.program.volumeLandmark);
 * ```
 */
export function useProgramInfo() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.programInfo(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getProgramInfo(token);
    },
    staleTime: 1000 * 60 * 60, // 1 hour (program rarely changes)
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}

/**
 * Generate a new workout plan
 *
 * @example
 * ```typescript
 * const { mutate, data, isPending } = useGenerateWorkout();
 *
 * const handleGenerate = () => {
 *   mutate(1, {
 *     onSuccess: (plan) => {
 *       console.log('Generated plan:', plan);
 *       navigate('/workout-plan');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   });
 * };
 * ```
 */
export function useGenerateWorkout() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekNumber: number = 1) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.generateWorkout(token, weekNumber);
    },
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['workouts'] });

      // Set the plan in cache
      queryClient.setQueryData(methodologyKeys.plan(data.planId), data);
    },
  });
}

/**
 * Get full workout plan details
 *
 * @example
 * ```typescript
 * const { data } = useWorkoutPlanDetails(123);
 *
 * if (data) {
 *   data.workouts.forEach(workout => {
 *     console.log(workout.name, workout.exercises.length);
 *   });
 * }
 * ```
 */
export function useWorkoutPlanDetails(planId: number, enabled: boolean = true) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.plan(planId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getWorkoutPlanDetails(token, planId);
    },
    enabled: enabled && planId > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

// ============================================================================
// Progress Tracking Hooks
// ============================================================================

/**
 * Record exercise progress with auto-regulated recommendations
 *
 * @example
 * ```typescript
 * const { mutate, data } = useRecordProgress();
 *
 * const handleLogProgress = (exerciseId: number, weight: number, reps: number) => {
 *   mutate({
 *     exerciseId,
 *     weight,
 *     reps,
 *     sets: 3,
 *     targetReps: 10,
 *     targetRpe: 8,
 *     actualRpe: 7,
 *   }, {
 *     onSuccess: (response) => {
 *       alert(`Next time use ${response.recommendations.nextWeight}kg!`);
 *     },
 *   });
 * };
 * ```
 */
export function useRecordProgress() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProgressRecord) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.recordProgress(token, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate exercise progress
      queryClient.invalidateQueries({
        queryKey: methodologyKeys.progress.exercise(variables.exerciseId),
      });

      // Invalidate personal records
      queryClient.invalidateQueries({
        queryKey: methodologyKeys.progress.personalRecords(),
      });
    },
  });
}

/**
 * Get progress history for a specific exercise
 *
 * @example
 * ```typescript
 * const { data } = useExerciseProgress(1);
 *
 * console.log('Personal Record:', data?.personalRecord);
 * console.log('Recent sessions:', data?.history);
 * ```
 */
export function useExerciseProgress(exerciseId: number, enabled: boolean = true) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.progress.exercise(exerciseId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getExerciseProgress(token, exerciseId);
    },
    enabled: enabled && exerciseId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get weekly volume for a specific week
 *
 * @example
 * ```typescript
 * const { data } = useWeeklyVolume(1);
 *
 * data?.muscleGroups.forEach(mg => {
 *   console.log(`${mg.muscle}: ${mg.totalSets} sets`);
 * });
 * ```
 */
export function useWeeklyVolume(weekNumber: number, enabled: boolean = true) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.progress.weeklyVolume(weekNumber),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getWeeklyVolume(token, weekNumber);
    },
    enabled: enabled && weekNumber > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Get all personal records
 *
 * @example
 * ```typescript
 * const { data } = usePersonalRecords();
 *
 * const topRecords = data?.records.slice(0, 5);
 * ```
 */
export function usePersonalRecords() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.progress.personalRecords(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getPersonalRecords(token);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================================================
// Recovery Tracking Hooks
// ============================================================================

/**
 * Record daily recovery metrics
 *
 * @example
 * ```typescript
 * const { mutate } = useRecordRecovery();
 *
 * const handleLogRecovery = () => {
 *   mutate({
 *     sleepHours: 7.5,
 *     sleepQuality: 'good',
 *     fatigueLevel: 4,
 *     sorenessLevel: 5,
 *     moodLevel: 7,
 *     stressLevel: 5,
 *   }, {
 *     onSuccess: (response) => {
 *       if (response.analysis.deloadRecommendation.shouldDeload) {
 *         alert('Consider taking a deload week!');
 *       }
 *     },
 *   });
 * };
 * ```
 */
export function useRecordRecovery() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecoveryMetrics) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.recordRecovery(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: methodologyKeys.recovery.all });
    },
  });
}

/**
 * Get recovery metrics history
 *
 * @example
 * ```typescript
 * const { data } = useRecoveryHistory(30);
 *
 * console.log('Average sleep:', data?.trends.averageSleep);
 * console.log('Should deload?', data?.trends.recommendDeload);
 * ```
 */
export function useRecoveryHistory(days: number = 30) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.recovery.history(days),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getRecoveryHistory(token, days);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Get current recovery status
 *
 * @example
 * ```typescript
 * const { data } = useRecoveryStatus();
 *
 * if (data?.status === 'poor') {
 *   // Show warning
 * }
 * ```
 */
export function useRecoveryStatus() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.recovery.status(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getRecoveryStatus(token);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Schedule a deload week
 *
 * @example
 * ```typescript
 * const { mutate } = useScheduleDeload();
 *
 * mutate({
 *   weekNumber: 10,
 *   reason: 'Scheduled deload',
 *   volumeReductionPercent: 50,
 * });
 * ```
 */
export function useScheduleDeload() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      weekNumber: number;
      reason: string;
      volumeReductionPercent?: number;
    }) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.scheduleDeload(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: methodologyKeys.recovery.all });
    },
  });
}

// ============================================================================
// AI Assistant Hooks
// ============================================================================

/**
 * Get AI explanation of the workout plan
 *
 * @example
 * ```typescript
 * const { mutate, data } = useAIExplanation();
 *
 * <button onClick={() => mutate()}>
 *   Explain My Plan
 * </button>
 *
 * {data && <p>{data.explanation}</p>}
 * ```
 */
export function useAIExplanation() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getAIExplanation(token);
    },
  });
}

/**
 * Get AI-suggested exercise substitute
 *
 * @example
 * ```typescript
 * const { mutate, data } = useExerciseSubstitute();
 *
 * mutate({
 *   exerciseName: 'Supino Reto',
 *   reason: 'Shoulder pain',
 *   availableEquipment: ['dumbbells', 'bench'],
 * });
 * ```
 */
export function useExerciseSubstitute() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      exerciseName: string;
      reason: string;
      availableEquipment: string[];
    }) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.suggestExerciseSubstitute(token, data);
    },
  });
}

/**
 * Get AI-generated nutrition advice
 *
 * @example
 * ```typescript
 * const { data } = useNutritionAdvice();
 *
 * console.log('Protein:', data?.macros.protein);
 * console.log('Advice:', data?.advice);
 * ```
 */
export function useNutritionAdvice() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.ai.nutrition(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getNutritionAdvice(token);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

/**
 * Get AI recovery analysis
 *
 * @example
 * ```typescript
 * const { data } = useRecoveryAnalysis();
 *
 * if (data) {
 *   data.recommendations.forEach(rec => {
 *     console.log(rec);
 *   });
 * }
 * ```
 */
export function useRecoveryAnalysis() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: methodologyKeys.ai.recoveryAnalysis(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return methodologyAPI.getRecoveryAnalysis(token);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
}

// ============================================================================
// Prefetch Helpers
// ============================================================================

/**
 * Prefetch program info when user lands on dashboard
 *
 * @example
 * ```typescript
 * function Dashboard() {
 *   usePrefetchProgramInfo();
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePrefetchProgramInfo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetch = async () => {
      const token = await getToken();
      if (!token) return;

      queryClient.prefetchQuery({
        queryKey: methodologyKeys.programInfo(),
        queryFn: () => methodologyAPI.getProgramInfo(token),
        staleTime: 1000 * 60 * 60,
      });
    };

    prefetch();
  }, [getToken, queryClient]);
}
