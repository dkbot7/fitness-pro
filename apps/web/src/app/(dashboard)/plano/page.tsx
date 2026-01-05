'use client';

import { useWorkoutPlan } from '@/lib/hooks/use-workout-plan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MUSCLE_GROUPS } from '@fitness-pro/shared';

const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

function getWorkoutTypeLabel(workoutType: string): string {
  const muscleGroups = workoutType.split('_');
  return muscleGroups
    .map((mg) => MUSCLE_GROUPS[mg as keyof typeof MUSCLE_GROUPS] || mg)
    .join(', ');
}

function getStatusBadge(status: string) {
  const badges = {
    pending: { label: 'Pendente', className: 'bg-warning-light text-warning' },
    completed: { label: 'Concluído', className: 'bg-success-light text-success' },
    skipped: { label: 'Pulado', className: 'bg-muted text-muted-foreground' },
  };

  const badge = badges[status as keyof typeof badges] || badges.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

export default function PlanoPage() {
  const { data, isLoading, error } = useWorkoutPlan();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
          <div className="h-24 animate-pulse rounded bg-muted"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded bg-muted"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-fitpro-charcoal">Erro ao carregar plano</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/onboarding">Completar onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { plan, workouts, stats } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fitpro-charcoal">Meu Plano de Treino</h1>
        <p className="text-muted-foreground">Semana {plan.weekNumber}</p>
      </div>

      {/* Stats Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-fitpro-charcoal">Progresso da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Concluídos</p>
              <p className="text-2xl font-bold text-success">{stats.completed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de conclusão</p>
              <p className="text-2xl font-bold">{stats.completionRate}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-success transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workouts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-fitpro-charcoal">Treinos da Semana</h2>

        {workouts.map((workout) => (
          <Card key={workout.id} className="transition-shadow hover:shadow-lg hover:border-fitpro-red">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-fitpro-charcoal">
                    {DAYS_OF_WEEK[workout.dayOfWeek - 1]}
                  </CardTitle>
                  <CardDescription>
                    {getWorkoutTypeLabel(workout.workoutType)}
                  </CardDescription>
                </div>
                {getStatusBadge(workout.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {workout.exercises.length} exercícios
                </p>

                {workout.status === 'completed' && workout.completedAt && (
                  <p className="text-sm text-success">
                    Concluído em {new Date(workout.completedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/treino/${workout.id}`}>
                      {workout.status === 'completed' ? 'Ver treino' : 'Iniciar treino'}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {workouts.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-fitpro-charcoal">Nenhum treino encontrado</CardTitle>
              <CardDescription>
                Complete o onboarding para gerar seu plano de treino.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/onboarding">Completar onboarding</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
