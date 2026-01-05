'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { getWorkoutPlan, completeWorkout, type WorkoutPlanResponse } from '@/lib/api-client';

/**
 * Hook to fetch the current workout plan
 */
export function useWorkoutPlan() {
  const { getToken } = useAuth();

  return useQuery<WorkoutPlanResponse>({
    queryKey: ['workout-plan'],
    queryFn: async () => {
      const token = await getToken();
      console.log('[HOOK] getToken() returned:', token ? `Token (length: ${token.length})` : 'null');
      return getWorkoutPlan(token);
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
