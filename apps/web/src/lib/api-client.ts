/**
 * API Client for making requests to the Hono backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  token?: string | null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token is provided
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
    console.log('[API] Sending request with token, length:', options.token.length);
  } else {
    console.log('[API] No token provided for request to:', endpoint);
  }

  const response = await fetch(url, {
    ...options,
    headers,
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
  videoUrl: string | null;
  thumbnailUrl: string | null;
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

export async function getWorkoutPlan(token?: string | null): Promise<WorkoutPlanResponse> {
  return apiRequest('/api/training/plan', {
    method: 'GET',
    token,
  });
}

export async function completeWorkout(
  workoutId: number,
  token?: string | null
): Promise<{
  success: boolean;
  message: string;
  workout: Workout;
}> {
  return apiRequest('/api/training/complete', {
    method: 'POST',
    body: JSON.stringify({ workoutId }),
    token,
  });
}
