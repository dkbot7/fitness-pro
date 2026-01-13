/**
 * Complete Example: Workout Plan Page Component
 *
 * This is a full-featured, production-ready React component demonstrating
 * how to use the Training Methodology System in your frontend.
 *
 * Copy and adapt this to your project structure.
 */

import { useState } from 'react';
import {
  useMethodologyAvailable,
  useProgramInfo,
  useGenerateWorkout,
  useAIExplanation,
} from '@/hooks/use-methodology-hooks';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dumbbell,
  TrendingUp,
  Calendar,
  Info,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { Workout, WorkoutExercise } from '@/lib/methodology-api-client';

export function WorkoutPlanPage() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  // Check if methodology is available
  const { data: availability, isLoading: checkingAvailability } =
    useMethodologyAvailable();

  // Get program info
  const { data: programData, isLoading: loadingProgram } = useProgramInfo();

  // Generate workout mutation
  const {
    mutate: generateWorkout,
    data: workoutPlan,
    isPending: generatingWorkout,
    isError: workoutError,
  } = useGenerateWorkout();

  // AI explanation mutation
  const {
    mutate: getExplanation,
    data: aiExplanation,
    isPending: loadingExplanation,
  } = useAIExplanation();

  // Loading state
  if (checkingAvailability || loadingProgram) {
    return <WorkoutPlanSkeleton />;
  }

  // Not available
  if (!availability?.available) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {availability?.reason || 'Please complete your profile to get personalized workouts.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const program = programData?.program;

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Program Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Workout Plan</h1>
          <p className="text-muted-foreground mt-1">
            Week {currentWeek} • Science-based training methodology
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {program?.source === 'methodology' ? '🧬 Methodology' : '📋 Standard'}
        </Badge>
      </div>

      {/* Program Summary Card */}
      {program && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Training Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Split</p>
                <p className="font-semibold">{formatSplit(program.recommendedSplit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Frequency</p>
                <p className="font-semibold">{program.frequencyPerWeek}x per week</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-semibold">{program.volumeLandmark}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Intensity</p>
                <p className="font-semibold">RPE {program.trainingIntensityRpe}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAIExplanation(true);
                  getExplanation();
                }}
                disabled={loadingExplanation}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {loadingExplanation ? 'Loading...' : 'Explain My Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Explanation */}
      {showAIExplanation && aiExplanation && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription className="mt-2 whitespace-pre-wrap">
            {aiExplanation.explanation}
          </AlertDescription>
        </Alert>
      )}

      {/* Generate Workout Button */}
      {!workoutPlan && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Ready to train?</h3>
                <p className="text-sm text-muted-foreground">
                  Generate your personalized workout plan for week {currentWeek}
                </p>
              </div>
              <Button
                onClick={() => generateWorkout(currentWeek)}
                disabled={generatingWorkout}
                size="lg"
              >
                {generatingWorkout ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Week {currentWeek} Workout
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Error */}
      {workoutError && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to generate workout. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Workout Plan Display */}
      {workoutPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">This Week's Workouts</h2>
            <Button
              variant="outline"
              onClick={() => generateWorkout(currentWeek)}
              disabled={generatingWorkout}
            >
              Regenerate
            </Button>
          </div>

          {workoutPlan.workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

interface WorkoutCardProps {
  workout: Workout;
}

function WorkoutCard({ workout }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-accent transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              {getDayName(workout.dayOfWeek)} - {workout.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {workout.exercises.length} exercises
            </p>
          </div>
          <ChevronRight
            className={`h-5 w-5 transition-transform ${
              expanded ? 'rotate-90' : ''
            }`}
          />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-4">
            {workout.exercises.map((exercise) => (
              <ExerciseItem key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface ExerciseItemProps {
  exercise: WorkoutExercise;
}

function ExerciseItem({ exercise }: ExerciseItemProps) {
  return (
    <div className="border-l-2 border-primary pl-4 space-y-1">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{exercise.name}</h4>
          <div className="text-sm text-muted-foreground">
            {exercise.sets} sets × {exercise.reps} reps
          </div>
        </div>
        <Badge variant="outline">RPE {exercise.rpe}</Badge>
      </div>

      <div className="text-xs text-muted-foreground space-x-3">
        <span>Rest: {formatRestTime(exercise.restSec)}</span>
        {exercise.tempo && <span>Tempo: {exercise.tempo}</span>}
      </div>

      {exercise.notes && (
        <p className="text-sm italic text-muted-foreground mt-2">
          💡 {exercise.notes}
        </p>
      )}

      <Button
        variant="default"
        size="sm"
        className="mt-2"
        onClick={() => {
          // Navigate to exercise tracking page
          window.location.href = `/workout/exercise/${exercise.exerciseId}`;
        }}
      >
        Start Exercise
      </Button>
    </div>
  );
}

function WorkoutPlanSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getDayName(dayOfWeek: number): string {
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

function formatSplit(split: string): string {
  const translations: Record<string, string> = {
    full_body: 'Full Body',
    upper_lower: 'Upper/Lower',
    ppl: 'Push/Pull/Legs',
    pplul: 'Push/Pull/Upper/Lower',
  };
  return translations[split] || split;
}

function formatRestTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
}
