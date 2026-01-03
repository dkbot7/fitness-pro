/**
 * API Client for making requests to the Hono backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Unknown error occurred',
    }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Training API

export interface WorkoutExercise {
  id: number;
  exerciseId: number;
  orderIndex: number;
  sets: number;
  repsMin: number | null;
  repsMax: number | null;
  restSeconds: number;
  notesPt: string | null;
  exerciseName: string;
  exerciseSlug: string;
  muscleGroups: string[];
  difficulty: string;
}

export interface Workout {
  id: number;
  dayOfWeek: number;
  workoutType: string;
  status: 'pending' | 'completed' | 'skipped';
  startedAt: Date | null;
  completedAt: Date | null;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: number;
  weekNumber: number;
  status: string;
  difficultyMultiplier: string;
  createdAt: Date;
}

export interface WorkoutPlanResponse {
  success: boolean;
  plan: WorkoutPlan;
  workouts: Workout[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
}

export async function getWorkoutPlan(): Promise<WorkoutPlanResponse> {
  return apiRequest('/api/training/plan', {
    method: 'GET',
  });
}

export async function completeWorkout(workoutId: number): Promise<{
  success: boolean;
  message: string;
  workout: Workout;
}> {
  return apiRequest('/api/training/complete', {
    method: 'POST',
    body: JSON.stringify({ workoutId }),
  });
}
