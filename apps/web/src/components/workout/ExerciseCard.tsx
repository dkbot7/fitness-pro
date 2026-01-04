'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MUSCLE_GROUPS } from '@fitness-pro/shared';
import type { WorkoutExercise } from '@/lib/api-client';
import { VideoPlayer } from './VideoPlayer';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseNumber: number;
  workoutId?: number;
}

export function ExerciseCard({ exercise, exerciseNumber, workoutId }: ExerciseCardProps) {
  // Generate unique storage key for this exercise
  const storageKey = workoutId
    ? `workout-${workoutId}-exercise-${exercise.id}`
    : null;

  // Initialize from localStorage if available
  const [completedSets, setCompletedSets] = useState<boolean[]>(() => {
    if (typeof window === 'undefined' || !storageKey) {
      return new Array(exercise.sets).fill(false);
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure array length matches current sets count
        if (Array.isArray(parsed) && parsed.length === exercise.sets) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load exercise progress:', error);
    }

    return new Array(exercise.sets).fill(false);
  });

  // Save to localStorage whenever completedSets changes
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(completedSets));
      } catch (error) {
        console.error('Failed to save exercise progress:', error);
      }
    }
  }, [completedSets, storageKey]);

  const toggleSet = (index: number) => {
    setCompletedSets((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];

      // Haptic feedback on mobile when marking a set as complete
      if (updated[index] && 'vibrate' in navigator) {
        navigator.vibrate(50); // 50ms vibration
      }

      return updated;
    });
  };

  const completedCount = completedSets.filter(Boolean).length;
  const allCompleted = completedCount === exercise.sets;

  return (
    <Card className={`transition-all ${allCompleted ? 'border-green-500 bg-green-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {exerciseNumber}. {exercise.exerciseName}
            </CardTitle>
            <div className="mt-1 flex flex-wrap gap-1">
              {exercise.muscleGroups.map((mg) => (
                <span
                  key={mg}
                  className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                >
                  {MUSCLE_GROUPS[mg as keyof typeof MUSCLE_GROUPS] || mg}
                </span>
              ))}
            </div>
          </div>
          <div className="ml-4 text-right">
            <p className="text-sm font-medium text-gray-600">
              {completedCount}/{exercise.sets} séries
            </p>
            {allCompleted && (
              <span className="mt-1 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                ✓ Completo
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Player */}
        <VideoPlayer
          videoUrl={exercise.videoUrl}
          thumbnailUrl={exercise.thumbnailUrl}
          exerciseName={exercise.exerciseName}
        />

        {/* Exercise Details */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-xs font-medium text-gray-600">Séries</p>
            <p className="text-lg font-bold">{exercise.sets}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Repetições</p>
            <p className="text-lg font-bold">
              {exercise.repsMin && exercise.repsMax
                ? `${exercise.repsMin}-${exercise.repsMax}`
                : exercise.repsMin || exercise.repsMax || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Descanso</p>
            <p className="text-lg font-bold">
              {exercise.restSeconds >= 60
                ? `${Math.floor(exercise.restSeconds / 60)}min ${exercise.restSeconds % 60 > 0 ? `${exercise.restSeconds % 60}s` : ''}`
                : `${exercise.restSeconds}s`}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Dificuldade</p>
            <p className="text-lg font-bold capitalize">{exercise.difficulty}</p>
          </div>
        </div>

        {/* Notes */}
        {exercise.notesPt && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-900">
              <strong>Dica:</strong> {exercise.notesPt}
            </p>
          </div>
        )}

        {/* Set Tracking */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Marcar séries:</p>
          <div className="grid grid-cols-4 gap-2">
            {completedSets.map((completed, index) => (
              <button
                key={index}
                onClick={() => toggleSet(index)}
                className={`rounded-lg border-2 py-3 text-center font-semibold transition-all ${
                  completed
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {completed ? '✓' : index + 1}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
