'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkoutPlan, completeWorkout, type WorkoutPlanResponse } from '@/lib/api-client';

/**
 * Hook to fetch the current workout plan
 */
export function useWorkoutPlan() {
  return useQuery<WorkoutPlanResponse>({
    queryKey: ['workout-plan'],
    queryFn: getWorkoutPlan,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to mark a workout as completed
 */
export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutId: number) => completeWorkout(workoutId),
    onSuccess: () => {
      // Invalidate and refetch workout plan
      queryClient.invalidateQueries({ queryKey: ['workout-plan'] });
    },
  });
}
