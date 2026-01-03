'use client';

import { useWorkoutPlan, useCompleteWorkout } from '@/lib/hooks/use-workout-plan';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutTimer } from '@/components/workout/WorkoutTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

interface WorkoutPageProps {
  params: {
    id: string;
  };
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const router = useRouter();
  const { data, isLoading, error } = useWorkoutPlan();
  const completeWorkoutMutation = useCompleteWorkout();
  const [isCompleting, setIsCompleting] = useState(false);

  const workoutId = parseInt(params.id, 10);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded bg-gray-200"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Erro ao carregar treino</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              {error instanceof Error ? error.message : 'Treino não encontrado'}
            </p>
            <Button asChild variant="outline">
              <Link href="/plano">Voltar ao plano</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const workout = data.workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Treino não encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/plano">Voltar ao plano</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = workout.status === 'completed';
  const defaultRestTime = workout.exercises[0]?.restSeconds || 60;

  const handleCompleteWorkout = async () => {
    if (isCompleting) return;

    const confirmed = window.confirm(
      'Tem certeza que deseja marcar este treino como concluído?'
    );

    if (!confirmed) return;

    setIsCompleting(true);

    try {
      await completeWorkoutMutation.mutateAsync(workoutId);
      // Redirect to feedback page
      router.push(`/treino/${workoutId}/feedback`);
    } catch (error) {
      alert('Erro ao concluir treino. Tente novamente.');
      setIsCompleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/plano"
          className="mb-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Voltar ao plano
        </Link>
        <h1 className="text-3xl font-bold">{DAYS_OF_WEEK[workout.dayOfWeek - 1]}</h1>
        <p className="text-gray-600">
          {workout.exercises.length} exercícios • Semana {data.plan.weekNumber}
        </p>
        {isCompleted && (
          <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            ✓ Treino concluído
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Exercises */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Exercícios do Treino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Complete todas as séries de cada exercício. Marque as séries conforme você as
                completa e use o cronômetro para controlar o tempo de descanso.
              </p>
            </CardContent>
          </Card>

          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} exerciseNumber={index + 1} />
          ))}

          {/* Complete Workout Button */}
          {!isCompleted && (
            <Card className="border-2 border-green-500 bg-green-50">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-green-900">
                  Terminou o treino?
                </h3>
                <p className="mb-4 text-sm text-green-800">
                  Ao concluir o treino, você poderá dar feedback sobre a dificuldade para que
                  possamos ajustar seus próximos treinos.
                </p>
                <Button
                  onClick={handleCompleteWorkout}
                  disabled={isCompleting}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isCompleting ? 'Concluindo...' : 'Concluir Treino ✓'}
                </Button>
              </CardContent>
            </Card>
          )}

          {isCompleted && (
            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold">Treino já concluído</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Você já completou este treino. Continue com os próximos treinos da semana!
                </p>
                <Button asChild className="w-full">
                  <Link href="/plano">Ver plano completo</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Timer */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <WorkoutTimer defaultSeconds={defaultRestTime} />

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Resumo do Treino</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de exercícios:</span>
                  <span className="font-semibold">{workout.exercises.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de séries:</span>
                  <span className="font-semibold">
                    {workout.exercises.reduce((sum, ex) => sum + ex.sets, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tempo estimado:</span>
                  <span className="font-semibold">
                    {Math.round(
                      (workout.exercises.reduce(
                        (sum, ex) => sum + ex.sets * (ex.restSeconds + 45),
                        0
                      ) /
                        60) *
                        1.2
                    )}{' '}
                    min
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
