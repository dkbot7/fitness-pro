'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { getWorkoutPlan, getAllWeeks, completeWorkout, type WorkoutPlanResponse, type AllWeeksResponse } from '@/lib/api-client';

/**
 * Hook to fetch a specific week's workout plan (or current week if not specified)
 */
export function useWorkoutPlan(weekNumber?: number) {
  const { getToken } = useAuth();

  return useQuery<WorkoutPlanResponse>({
    queryKey: ['workout-plan', weekNumber],
    queryFn: async () => {
      const token = await getToken();
      console.log('[HOOK] getToken() returned:', token ? `Token (length: ${token.length})` : 'null');
      return getWorkoutPlan(token, weekNumber);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch overview of all weeks in the plan
 */
export function useAllWeeks() {
  const { getToken } = useAuth();

  return useQuery<AllWeeksResponse>({
    queryKey: ['all-weeks'],
    queryFn: async () => {
      const token = await getToken();
      return getAllWeeks(token);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to mark a workout as completed
 */
export function useCompleteWorkout() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (workoutId: number) => {
      const token = await getToken();
      return completeWorkout(workoutId, token);
    },
    onSuccess: () => {
      // Invalidate and refetch workout plan
      queryClient.invalidateQueries({ queryKey: ['workout-plan'] });
    },
  });
}
