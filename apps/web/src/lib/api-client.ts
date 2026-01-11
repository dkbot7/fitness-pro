/**
 * API Client for making requests to the Hono backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  token?: string | null;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
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
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJson
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);

      const errorMessage = errorData?.error || errorData?.message || `HTTP ${response.status}`;

      throw new APIError(
        errorMessage,
        response.status,
        errorData
      );
    }

    // Return parsed JSON response
    return isJson ? response.json() : response.text() as any;
  } catch (error) {
    // Re-throw APIError as is
    if (error instanceof APIError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(
        'Não foi possível conectar ao servidor. Verifique sua conexão.',
        0
      );
    }

    // Handle other errors
    throw new APIError(
      error instanceof Error ? error.message : 'Erro desconhecido',
      500
    );
  }
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
  currentWeek?: number;
  totalWeeks?: number;
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

export interface WeekOverview {
  weekNumber: number;
  status: string;
  difficultyMultiplier: number;
  workoutsTotal: number;
  workoutsCompleted: number;
  completionRate: number;
}

export interface AllWeeksResponse {
  success: boolean;
  currentWeek: number;
  totalWeeks: number;
  weeks: WeekOverview[];
}

export async function getWorkoutPlan(
  token?: string | null,
  weekNumber?: number
): Promise<WorkoutPlanResponse> {
  const url = weekNumber
    ? `/api/training/plan?week=${weekNumber}`
    : '/api/training/plan';

  return apiRequest(url, {
    method: 'GET',
    token,
  });
}

export async function getAllWeeks(token?: string | null): Promise<AllWeeksResponse> {
  return apiRequest('/api/training/plan/all', {
    method: 'GET',
    token,
  });
}

export interface UnlockedAchievement {
  id: number;
  slug: string;
  namePt: string;
  descriptionPt: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export async function completeWorkout(
  workoutId: number,
  token?: string | null
): Promise<{
  success: boolean;
  message: string;
  workout: Workout;
  streak: number;
  newAchievements: UnlockedAchievement[];
}> {
  return apiRequest('/api/training/complete', {
    method: 'POST',
    body: JSON.stringify({ workoutId }),
    token,
  });
}
