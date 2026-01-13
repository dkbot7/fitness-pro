/**
 * Complete Example: Exercise Tracking Component
 *
 * Demonstrates progress tracking with auto-regulated weight recommendations.
 */

import { useState } from 'react';
import {
  useRecordProgress,
  useExerciseProgress,
  useRecoveryStatus,
  useRecordRecovery,
} from '@/hooks/use-methodology-hooks';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Award,
  AlertCircle,
  Check,
  Activity,
} from 'lucide-react';
import type { WorkoutExercise } from '@/lib/methodology-api-client';

interface ExerciseTrackingPageProps {
  exercise: WorkoutExercise;
  onComplete: () => void;
}

export function ExerciseTrackingPage({
  exercise,
  onComplete,
}: ExerciseTrackingPageProps) {
  // State for form
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState(8);
  const [setNumber, setSetNumber] = useState(1);
  const [completedSets, setCompletedSets] = useState<
    Array<{ weight: number; reps: number; rpe: number }>
  >([]);

  // Hooks
  const { mutate: recordProgress, data: progressData, isPending } =
    useRecordProgress();
  const { data: exerciseHistory } = useExerciseProgress(exercise.exerciseId);
  const { data: recoveryStatus } = useRecoveryStatus();

  // Parse target values
  const targetReps = parseInt(exercise.reps.split('-')[1] || exercise.reps);
  const targetRpe = parseInt(exercise.rpe.split('-')[1] || exercise.rpe);

  const handleLogSet = () => {
    const setData = {
      weight: parseFloat(weight),
      reps: parseInt(reps),
      rpe,
    };

    setCompletedSets([...completedSets, setData]);

    // If last set, submit progress
    if (setNumber === exercise.sets) {
      recordProgress(
        {
          exerciseId: exercise.exerciseId,
          weight: setData.weight,
          reps: setData.reps,
          sets: exercise.sets,
          targetReps,
          targetRpe,
          actualRpe: rpe,
        },
        {
          onSuccess: () => {
            // Show success for a moment before completing
            setTimeout(onComplete, 2000);
          },
        }
      );
    } else {
      setSetNumber(setNumber + 1);
      // Clear form for next set
      setReps('');
    }
  };

  const isFormValid = weight && reps && parseFloat(weight) > 0 && parseInt(reps) > 0;

  return (
    <div className="container max-w-3xl mx-auto p-6 space-y-6">
      {/* Exercise Header */}
      <div>
        <h1 className="text-3xl font-bold">{exercise.name}</h1>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">Set {setNumber} of {exercise.sets}</Badge>
          <Badge variant="secondary">Target: {exercise.reps} reps</Badge>
          <Badge variant="secondary">RPE {exercise.rpe}</Badge>
        </div>
      </div>

      {/* Recovery Alert */}
      {recoveryStatus?.recommendation.shouldDeload && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your recovery metrics suggest you may need a deload week soon.
            Consider reducing weight by 10-20%.
          </AlertDescription>
        </Alert>
      )}

      {/* Previous Performance */}
      {exerciseHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Previous Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Personal Record</p>
                <p className="text-2xl font-bold">
                  {exerciseHistory.personalRecord.weight}kg × {exerciseHistory.personalRecord.reps}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated 1RM: {calculate1RM(
                    exerciseHistory.personalRecord.weight,
                    exerciseHistory.personalRecord.reps
                  )}kg
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Session</p>
                {exerciseHistory.history[0] && (
                  <>
                    <p className="text-2xl font-bold">
                      {exerciseHistory.history[0].weight}kg × {exerciseHistory.history[0].reps}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(exerciseHistory.history[0].date).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Log Set {setNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weight Input */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.5"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              className="text-2xl font-bold"
            />
            {exerciseHistory?.history[0] && (
              <p className="text-xs text-muted-foreground">
                Last time: {exerciseHistory.history[0].weight}kg
              </p>
            )}
          </div>

          {/* Reps Input */}
          <div className="space-y-2">
            <Label htmlFor="reps">Reps Completed</Label>
            <Input
              id="reps"
              type="number"
              min="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Enter reps"
              className="text-2xl font-bold"
            />
            <p className="text-xs text-muted-foreground">
              Target: {exercise.reps} reps
            </p>
          </div>

          {/* RPE Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Rate of Perceived Exertion (RPE)</Label>
              <Badge variant="outline" className="text-lg font-bold">
                {rpe}
              </Badge>
            </div>
            <Slider
              value={[rpe]}
              onValueChange={(value) => setRpe(value[0])}
              min={1}
              max={10}
              step={0.5}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Easy (1)</span>
              <span>Target: {exercise.rpe}</span>
              <span>Maximum (10)</span>
            </div>
            <RPEGuide rpe={rpe} />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleLogSet}
            disabled={!isFormValid || isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? (
              'Saving...'
            ) : setNumber === exercise.sets ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Complete Exercise
              </>
            ) : (
              `Log Set ${setNumber} & Continue`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Completed Sets Summary */}
      {completedSets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completed Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedSets.map((set, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-accent rounded"
                >
                  <span className="font-medium">Set {index + 1}</span>
                  <span>
                    {set.weight}kg × {set.reps} @ RPE {set.rpe}
                  </span>
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-regulation Recommendations */}
      {progressData && (
        <Alert className="border-green-500 bg-green-50">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <div className="space-y-2">
              <p className="font-semibold">Great work! 🎉</p>
              <p className="text-sm">{progressData.recommendations.reasoning}</p>
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm font-medium">Next Session Recommendation:</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {progressData.recommendations.nextWeight}kg
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

interface RPEGuideProps {
  rpe: number;
}

function RPEGuide({ rpe }: RPEGuideProps) {
  const getDescription = (rpe: number): string => {
    if (rpe <= 3) return 'Very light, easy warm-up effort';
    if (rpe <= 5) return 'Light effort, could do many more reps';
    if (rpe <= 6) return 'Moderate effort, 4-5 reps left in tank';
    if (rpe <= 7) return 'Challenging, 3 reps left in tank';
    if (rpe <= 8) return 'Hard effort, 1-2 reps left in tank';
    if (rpe <= 9) return 'Very hard, maybe 1 rep left';
    return 'Maximum effort, nothing left';
  };

  return (
    <div className="p-3 bg-accent rounded text-sm">
      <p className="font-medium">RPE {rpe}:</p>
      <p className="text-muted-foreground">{getDescription(rpe)}</p>
    </div>
  );
}

/**
 * Recovery Metrics Form Component
 */
export function RecoveryMetricsForm({ onComplete }: { onComplete?: () => void }) {
  const [metrics, setMetrics] = useState({
    sleepHours: 7.5,
    sleepQuality: 'good' as const,
    fatigueLevel: 5,
    sorenessLevel: 5,
    moodLevel: 7,
    stressLevel: 5,
  });

  const { mutate: recordRecovery, isPending, data } = useRecordRecovery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    recordRecovery(metrics, {
      onSuccess: (response) => {
        if (response.analysis.deloadRecommendation.shouldDeload) {
          alert(
            `⚠️ Deload Recommended:\n\n${response.analysis.deloadRecommendation.reason}`
          );
        }
        onComplete?.();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Recovery Check-In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sleep Hours */}
          <div className="space-y-2">
            <Label>Sleep Hours</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[metrics.sleepHours]}
                onValueChange={(v) =>
                  setMetrics({ ...metrics, sleepHours: v[0] })
                }
                min={0}
                max={12}
                step={0.5}
                className="flex-1"
              />
              <Badge variant="outline" className="w-16 justify-center">
                {metrics.sleepHours}h
              </Badge>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2">
            <Label>Sleep Quality</Label>
            <div className="grid grid-cols-4 gap-2">
              {(['poor', 'fair', 'good', 'excellent'] as const).map((quality) => (
                <Button
                  key={quality}
                  type="button"
                  variant={metrics.sleepQuality === quality ? 'default' : 'outline'}
                  onClick={() => setMetrics({ ...metrics, sleepQuality: quality })}
                  className="capitalize"
                >
                  {quality}
                </Button>
              ))}
            </div>
          </div>

          {/* Fatigue Level */}
          <MetricSlider
            label="Fatigue Level"
            value={metrics.fatigueLevel}
            onChange={(v) => setMetrics({ ...metrics, fatigueLevel: v })}
            lowLabel="Fresh"
            highLabel="Exhausted"
          />

          {/* Soreness Level */}
          <MetricSlider
            label="Muscle Soreness"
            value={metrics.sorenessLevel}
            onChange={(v) => setMetrics({ ...metrics, sorenessLevel: v })}
            lowLabel="No soreness"
            highLabel="Very sore"
          />

          {/* Mood Level */}
          <MetricSlider
            label="Mood"
            value={metrics.moodLevel}
            onChange={(v) => setMetrics({ ...metrics, moodLevel: v })}
            lowLabel="Bad"
            highLabel="Excellent"
          />

          {/* Stress Level */}
          <MetricSlider
            label="Stress Level"
            value={metrics.stressLevel}
            onChange={(v) => setMetrics({ ...metrics, stressLevel: v })}
            lowLabel="Relaxed"
            highLabel="Very stressed"
          />

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? 'Saving...' : 'Log Recovery Metrics'}
          </Button>
        </form>

        {/* Results */}
        {data && (
          <Alert className="mt-4">
            <Activity className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">
                Overall Recovery: {data.analysis.overallRecovery}
              </p>
              <p className="text-sm mt-1">
                {data.analysis.deloadRecommendation.reason}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
}

function MetricSlider({ label, value, onChange, lowLabel, highLabel }: MetricSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Badge variant="outline" className="w-12 justify-center">
          {value}
        </Badge>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={1}
        max={10}
        step={1}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
