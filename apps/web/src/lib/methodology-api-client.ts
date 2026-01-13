/**
 * FitPro Training Methodology API Client
 *
 * Complete, production-ready API client for the Training Methodology System.
 * Copy this file to your frontend project and use it with React Query.
 *
 * @example
 * ```typescript
 * import { methodologyAPI } from './methodology-api-client';
 *
 * const available = await methodologyAPI.checkAvailability(token);
 * const plan = await methodologyAPI.generateWorkout(token, 1);
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export type Goal = 'lose_weight' | 'gain_muscle' | 'maintenance';
export type Location = 'gym' | 'home';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Split = 'full_body' | 'upper_lower' | 'ppl' | 'pplul';
export type VolumeLandmark = 'MEV' | 'MAV' | 'MAV+' | 'MRV';
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type RecoveryLevel = 'poor' | 'fair' | 'good' | 'excellent';

export interface TrainingProgram {
  programCode: string;
  goal: Goal;
  frequencyPerWeek: number;
  location: Location;
  experienceLevel: ExperienceLevel;
  recommendedSplit: Split;
  volumeLandmark: VolumeLandmark;
  setsPerWeekChest: number;
  setsPerWeekBack: number;
  setsPerWeekLegs: number;
  setsPerWeekShoulders: number;
  setsPerWeekArms: number;
  setsPerWeekCore: number;
  trainingIntensityRpe: string;
  restBetweenSetsSec: string;
  sessionDurationMin: string;
  cardioFrequency?: number;
  cardioType?: string;
  cardioDurationMin?: number;
  notes?: string;
}

export interface WorkoutExercise {
  id: number;
  exerciseId: number;
  name: string;
  slug: string;
  sets: number;
  reps: string;
  rpe: string;
  restSec: number;
  tempo?: string;
  order: number;
  notes?: string;
}

export interface Workout {
  id: number;
  dayOfWeek: number;
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  source: 'methodology' | 'legacy';
  planId: number;
  workouts: Workout[];
}

export interface ProgressRecord {
  exerciseId: number;
  weight: number;
  reps: number;
  sets: number;
  targetReps: number;
  targetRpe: number;
  actualRpe: number;
  workoutDate?: string;
}

export interface ProgressResponse {
  progress: {
    id: number;
    userId: string;
    exerciseId: number;
    workoutDate: number;
    bestWeightKg: number;
    bestReps: number;
    bestSetVolume: number;
    totalVolume: number;
    estimated1rm: number;
  };
  recommendations: {
    nextWeight: number;
    reasoning: string;
  };
}

export interface RecoveryMetrics {
  restingHeartRate?: number;
  hrvScore?: number;
  sleepHours: number;
  sleepQuality: SleepQuality;
  fatigueLevel: number;
  sorenessLevel: number;
  moodLevel: number;
  stressLevel: number;
}

export interface RecoveryResponse {
  metrics: RecoveryMetrics & {
    id: number;
    userId: string;
    measurementDate: number;
  };
  analysis: {
    overallRecovery: RecoveryLevel;
    deloadRecommendation: {
      shouldDeload: boolean;
      reason: string;
    };
  };
}

export interface ExerciseProgress {
  exerciseId: number;
  exerciseName: string;
  history: Array<{
    date: string;
    weight: number;
    reps: number;
    estimated1rm: number;
  }>;
  personalRecord: {
    weight: number;
    reps: number;
    date: string;
  };
}

export interface WeeklyVolume {
  weekNumber: number;
  muscleGroups: Array<{
    muscle: string;
    totalSets: number;
    totalVolumeKg: number;
  }>;
}

// ============================================================================
// API Client Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';

class MethodologyAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseBody?: any
  ) {
    super(message);
    this.name = 'MethodologyAPIError';
  }
}

// ============================================================================
// API Client
// ============================================================================

export const methodologyAPI = {
  /**
   * Check if methodology system is available for the user
   */
  async checkAvailability(token: string): Promise<{ available: boolean; reason: string }> {
    const response = await fetch(`${API_BASE_URL}/api/methodology/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to check availability',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get the user's training program details
   */
  async getProgramInfo(token: string): Promise<{
    program: TrainingProgram;
    userProfile: {
      goal: Goal;
      frequencyPerWeek: number;
      experienceLevel: ExperienceLevel;
      location: Location;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/methodology/program-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get program info',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Generate a workout plan for a specific week
   */
  async generateWorkout(token: string, weekNumber: number = 1): Promise<WorkoutPlan> {
    const response = await fetch(`${API_BASE_URL}/api/methodology/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weekNumber }),
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to generate workout',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get full details of a workout plan including all exercises
   */
  async getWorkoutPlanDetails(token: string, planId: number): Promise<WorkoutPlan> {
    const response = await fetch(`${API_BASE_URL}/api/methodology/plan/${planId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get workout plan details',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Record exercise progress and get auto-regulated recommendations
   */
  async recordProgress(token: string, data: ProgressRecord): Promise<ProgressResponse> {
    const response = await fetch(`${API_BASE_URL}/api/progress/record`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to record progress',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get progress history for a specific exercise
   */
  async getExerciseProgress(token: string, exerciseId: number): Promise<ExerciseProgress> {
    const response = await fetch(`${API_BASE_URL}/api/progress/exercise/${exerciseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get exercise progress',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get weekly volume for a specific week
   */
  async getWeeklyVolume(token: string, weekNumber: number): Promise<WeeklyVolume> {
    const response = await fetch(
      `${API_BASE_URL}/api/progress/weekly-volume/${weekNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get weekly volume',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get all personal records
   */
  async getPersonalRecords(token: string): Promise<{
    records: Array<{
      exerciseId: number;
      exerciseName: string;
      bestWeight: number;
      bestReps: number;
      estimated1rm: number;
      achievedAt: string;
    }>;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/progress/personal-records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get personal records',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Record daily recovery metrics
   */
  async recordRecovery(token: string, data: RecoveryMetrics): Promise<RecoveryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/recovery/record`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to record recovery metrics',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get recovery metrics history
   */
  async getRecoveryHistory(
    token: string,
    days: number = 30
  ): Promise<{
    metrics: Array<RecoveryMetrics & { measurementDate: string }>;
    trends: {
      averageSleep: number;
      averageFatigue: number;
      averageSoreness: number;
      recommendDeload: boolean;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/recovery/history?days=${days}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get recovery history',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get current recovery status
   */
  async getRecoveryStatus(token: string): Promise<{
    status: RecoveryLevel;
    recommendation: {
      shouldDeload: boolean;
      reason: string;
    };
    recentMetrics: RecoveryMetrics;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/recovery/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get recovery status',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Schedule a deload week
   */
  async scheduleDeload(
    token: string,
    data: {
      weekNumber: number;
      reason: string;
      volumeReductionPercent?: number;
    }
  ): Promise<{
    success: boolean;
    deloadWeek: {
      weekNumber: number;
      reason: string;
      volumeReduction: number;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/recovery/schedule-deload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to schedule deload',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get AI explanation of the workout plan
   */
  async getAIExplanation(token: string): Promise<{
    success: boolean;
    explanation: string;
    metadata: {
      programCode: string;
      split: string;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/ai/explain-plan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get AI explanation',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get AI-suggested exercise substitute
   */
  async suggestExerciseSubstitute(
    token: string,
    data: {
      exerciseName: string;
      reason: string;
      availableEquipment: string[];
    }
  ): Promise<{
    success: boolean;
    substitute: {
      name: string;
      explanation: string;
      equipment: string[];
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/ai/substitute-exercise`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get exercise substitute',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get AI-generated nutrition advice
   */
  async getNutritionAdvice(token: string): Promise<{
    success: boolean;
    advice: string;
    macros: {
      protein: string;
      carbs: string;
      fats: string;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/ai/nutrition-advice`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get nutrition advice',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },

  /**
   * Get AI recovery analysis
   */
  async getRecoveryAnalysis(token: string): Promise<{
    success: boolean;
    analysis: string;
    recommendations: string[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/ai/recovery-analysis`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new MethodologyAPIError(
        'Failed to get recovery analysis',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate 1RM using Epley formula
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Get day name from day of week number
 */
export function getDayName(dayOfWeek: number): string {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  return days[dayOfWeek] || 'Unknown';
}

/**
 * Format RPE range
 */
export function formatRPE(rpe: string): string {
  return `RPE ${rpe}`;
}

/**
 * Format rest time
 */
export function formatRestTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

/**
 * Parse volume landmark to Portuguese
 */
export function parseVolumeLandmark(landmark: VolumeLandmark): string {
  const translations = {
    MEV: 'Volume Mínimo Efetivo',
    MAV: 'Volume Máximo Adaptativo',
    'MAV+': 'Volume Máximo Adaptativo+',
    MRV: 'Volume Máximo Recuperável',
  };
  return translations[landmark] || landmark;
}

/**
 * Parse goal to Portuguese
 */
export function parseGoal(goal: Goal): string {
  const translations = {
    lose_weight: 'Emagrecimento',
    gain_muscle: 'Ganho de Massa Muscular',
    maintenance: 'Manutenção',
  };
  return translations[goal] || goal;
}

/**
 * Parse split to Portuguese
 */
export function parseSplit(split: Split): string {
  const translations = {
    full_body: 'Full Body',
    upper_lower: 'Upper/Lower',
    ppl: 'Push/Pull/Legs',
    pplul: 'Push/Pull/Upper/Lower',
  };
  return translations[split] || split;
}
