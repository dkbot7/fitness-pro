import { useWorkoutPlan } from '@/lib/hooks/use-workout-plan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MUSCLE_GROUPS } from '@fitness-pro/shared';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState, PageLoading } from '@/components/ui/loading-state';

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
    pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Concluído', className: 'bg-green-100 text-green-800' },
    skipped: { label: 'Pulado', className: 'bg-gray-100 text-gray-800' },
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

export default function WorkoutPlan() {
  const { data, isLoading, error, refetch } = useWorkoutPlan();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-32 mt-2 animate-pulse rounded bg-gray-200"></div>
        </div>
        <LoadingState variant="card" lines={4} />
        <div className="mt-6">
          <LoadingState variant="list" lines={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Erro ao carregar plano de treino"
          message={error instanceof Error ? error.message : 'Não foi possível carregar seu plano de treino. Tente novamente.'}
          onRetry={() => refetch()}
        />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Complete seu perfil</CardTitle>
            <CardDescription>
              Se você ainda não completou o onboarding, faça isso primeiro para gerar seu plano de treino.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/onboarding">Ir para onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return <PageLoading message="Carregando seu plano de treino..." />;
  }

  const { plan, workouts, stats } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meu Plano de Treino</h1>
        <p className="text-gray-600">Semana {plan.weekNumber}</p>
      </div>

      {/* Stats Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progresso da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa de conclusão</p>
              <p className="text-2xl font-bold">{stats.completionRate}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-green-600 transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workouts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Treinos da Semana</h2>

        {workouts.map((workout) => (
          <Card key={workout.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
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
                <p className="text-sm text-gray-600">
                  {workout.exercises.length} exercícios
                </p>

                {workout.status === 'completed' && workout.completedAt && (
                  <p className="text-sm text-green-600">
                    Concluído em {new Date(workout.completedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link to={`/treino/${workout.id}`}>
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
              <CardTitle>Nenhum treino encontrado</CardTitle>
              <CardDescription>
                Complete o onboarding para gerar seu plano de treino.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/onboarding">Completar onboarding</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
