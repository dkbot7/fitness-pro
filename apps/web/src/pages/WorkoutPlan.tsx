import { useWorkoutPlan } from '@/lib/hooks/use-workout-plan';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MUSCLE_GROUPS } from '@fitness-pro/shared';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState, PageLoading } from '@/components/ui/loading-state';
import { WeekNavigator } from '@/components/training/WeekNavigator';
import { MessageCircle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

interface DaySchedule {
  dayOfWeek: number; // 1-7
  dayName: string;
  workout: any | null; // null if rest day
  isRestDay: boolean;
}

function createWeekCalendar(workouts: any[]): DaySchedule[] {
  return [1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
    const workout = workouts.find((w) => w.dayOfWeek === dayNum);
    return {
      dayOfWeek: dayNum,
      dayName: DAYS_OF_WEEK[dayNum - 1],
      workout: workout || null,
      isRestDay: !workout,
    };
  });
}

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

// Component for "Waiting for Personal Trainer" state
function WaitingForPlan() {
  const onboardingStatus = useOnboardingStatus();
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    const trainerNumber = '41222222222';
    const profile = onboardingStatus.profile;

    if (!profile) {
      const message = encodeURIComponent('Olá! Completei meu cadastro no FitPro e gostaria de agendar minha consulta.');
      window.open(`https://wa.me/${trainerNumber}?text=${message}`, '_blank');
      return;
    }

    // Format maps
    const goalMap: Record<string, string> = {
      'lose_weight': 'Perder Peso',
      'gain_muscle': 'Ganhar Massa Muscular',
      'maintenance': 'Manutenção/Condicionamento'
    };
    const locationMap: Record<string, string> = {
      'home': 'Em Casa',
      'gym': 'Academia'
    };
    const experienceMap: Record<string, string> = {
      'beginner': 'Iniciante (<6 meses)',
      'intermediate': 'Intermediário (6-24 meses)',
      'advanced': 'Avançado (>2 anos)'
    };
    const genderMap: Record<string, string> = {
      'male': 'Masculino',
      'female': 'Feminino',
      'other': 'Outro'
    };

    // Format equipment
    const equipmentMap: Record<string, string> = {
      'full_gym': 'Academia Completa',
      'bodyweight': 'Peso Corporal',
      'dumbbells': 'Halteres',
      'resistance_bands': 'Faixas Elasticas',
      'pull_up_bar': 'Barra Fixa',
      'bench': 'Banco',
      'barbell': 'Barra',
      'squat_rack': 'Rack de Agachamento',
      'cable_machine': 'Polia/Crossover',
      'leg_press_machine': 'Leg Press',
      'leg_extension_machine': 'Cadeira Extensora',
      'shoulder_press_machine': 'Maquina de Desenvolvimento',
    };

    // Build the message - Simple format without emojis
    let message = '*NOVO CADASTRO - FITPRO*\n\n';

    message += '*DADOS PESSOAIS*\n';
    if (profile.fullName) message += `Nome: ${profile.fullName}\n`;
    if (profile.whatsappNumber) message += `WhatsApp: ${profile.whatsappNumber}\n`;
    if (profile.age) message += `Idade: ${profile.age} anos\n`;
    if (profile.gender) message += `Genero: ${genderMap[profile.gender] || profile.gender}\n`;
    if (profile.currentWeightKg) message += `Peso: ${profile.currentWeightKg}kg\n`;
    if (profile.heightCm) message += `Altura: ${profile.heightCm}cm\n`;
    message += '\n';

    message += '*OBJETIVO*\n';
    if (profile.goal) message += `${goalMap[profile.goal] || profile.goal}\n`;
    if (profile.goalDescription) message += `Descricao: ${profile.goalDescription}\n`;
    message += '\n';

    message += '*PREFERENCIAS DE TREINO*\n';
    if (profile.frequencyPerWeek) message += `Frequencia: ${profile.frequencyPerWeek}x por semana\n`;
    if (profile.location) message += `Local: ${locationMap[profile.location] || profile.location}\n`;
    if (profile.experienceLevel) message += `Nivel: ${experienceMap[profile.experienceLevel] || profile.experienceLevel}\n`;
    message += '\n';

    if (profile.equipment && profile.equipment.length > 0) {
      message += '*EQUIPAMENTOS DISPONIVEIS*\n';
      const translatedEquipment = profile.equipment.map(eq => equipmentMap[eq] || eq);
      message += translatedEquipment.join(', ') + '\n';
      if (profile.otherEquipment) {
        message += `Outros: ${profile.otherEquipment}\n`;
      }
      message += '\n';
    }

    if ((profile.limitations && profile.limitations.length > 0) || profile.limitationsDescription) {
      message += '*LIMITACOES FISICAS*\n';
      if (profile.limitations && profile.limitations.length > 0) {
        message += profile.limitations.join(', ') + '\n';
      }
      if (profile.limitationsDescription) {
        message += `Detalhes: ${profile.limitationsDescription}\n`;
      }
      message += '\n';
    }

    message += '================================\n';
    message += 'Gostaria de agendar minha consulta para criar meu plano personalizado!';

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${trainerNumber}?text=${encodedMessage}`, '_blank');
  };

  const profile = onboardingStatus.profile;

  // Format maps for display
  const goalMap: Record<string, string> = {
    'lose_weight': 'Perder Peso',
    'gain_muscle': 'Ganhar Massa Muscular',
    'maintenance': 'Manutenção/Condicionamento'
  };
  const locationMap: Record<string, string> = {
    'home': 'Em Casa',
    'gym': 'Academia'
  };
  const experienceMap: Record<string, string> = {
    'beginner': 'Iniciante',
    'intermediate': 'Intermediário',
    'advanced': 'Avançado'
  };
  const equipmentMap: Record<string, string> = {
    'full_gym': 'Academia Completa',
    'bodyweight': 'Peso Corporal',
    'dumbbells': 'Halteres',
    'resistance_bands': 'Faixas Elásticas',
    'pull_up_bar': 'Barra Fixa',
    'bench': 'Banco',
    'barbell': 'Barra',
    'squat_rack': 'Rack de Agachamento',
    'cable_machine': 'Polia/Crossover',
    'leg_press_machine': 'Leg Press',
    'leg_extension_machine': 'Cadeira Extensora',
    'shoulder_press_machine': 'Máquina de Desenvolvimento',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Seu Treino Está Sendo Elaborado</h1>
        <p className="text-gray-600 text-lg">
          O personal trainer está criando seu plano personalizado
        </p>
      </div>

      {/* Status Card */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📞 Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Envie suas respostas ao personal pelo WhatsApp (clique no botão abaixo)</li>
            <li>Aguarde o contato do personal trainer para agendar sua consulta</li>
            <li>Realize a entrevista para alinhamento de objetivos</li>
            <li>Receba seu plano de treino personalizado aqui no app</li>
          </ol>
        </CardContent>
      </Card>

      {/* User Responses Summary */}
      {profile && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📋 Suas Respostas</CardTitle>
            <CardDescription>Revise as informações que você forneceu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Dados Pessoais</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {profile.fullName && (
                  <div>
                    <span className="text-gray-600">Nome:</span> <span className="font-medium">{profile.fullName}</span>
                  </div>
                )}
                {profile.age && (
                  <div>
                    <span className="text-gray-600">Idade:</span> <span className="font-medium">{profile.age} anos</span>
                  </div>
                )}
                {profile.currentWeightKg && (
                  <div>
                    <span className="text-gray-600">Peso:</span> <span className="font-medium">{profile.currentWeightKg}kg</span>
                  </div>
                )}
                {profile.heightCm && (
                  <div>
                    <span className="text-gray-600">Altura:</span> <span className="font-medium">{profile.heightCm}cm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Goal */}
            {profile.goal && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Objetivo</h3>
                <p className="text-sm">
                  <span className="font-medium">{goalMap[profile.goal] || profile.goal}</span>
                </p>
                {profile.goalDescription && (
                  <p className="text-sm text-gray-600 mt-1">{profile.goalDescription}</p>
                )}
              </div>
            )}

            {/* Training Preferences */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Preferências de Treino</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {profile.frequencyPerWeek && (
                  <div>
                    <span className="text-gray-600">Frequência:</span> <span className="font-medium">{profile.frequencyPerWeek}x/semana</span>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <span className="text-gray-600">Local:</span> <span className="font-medium">{locationMap[profile.location] || profile.location}</span>
                  </div>
                )}
                {profile.experienceLevel && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Nível:</span> <span className="font-medium">{experienceMap[profile.experienceLevel] || profile.experienceLevel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Equipment */}
            {profile.equipment && profile.equipment.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Equipamentos</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.equipment.map((eq: string) => (
                    <span key={eq} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {equipmentMap[eq] || eq}
                    </span>
                  ))}
                </div>
                {profile.otherEquipment && (
                  <p className="text-sm text-gray-600 mt-2">Outros: {profile.otherEquipment}</p>
                )}
              </div>
            )}

            {/* Limitations */}
            {((profile.limitations && profile.limitations.length > 0) || profile.limitationsDescription) && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Limitações Físicas</h3>
                {profile.limitations && profile.limitations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.limitations.map((lim: string) => (
                      <span key={lim} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        {lim}
                      </span>
                    ))}
                  </div>
                )}
                {profile.limitationsDescription && (
                  <p className="text-sm text-gray-600">{profile.limitationsDescription}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            Envie suas respostas agora para o personal trainer
          </p>
          <Button
            onClick={handleWhatsAppClick}
            className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Enviar Respostas via WhatsApp
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/onboarding')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refazer Cadastro
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function WorkoutPlan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const weekParam = searchParams.get('week');
  const selectedWeek = weekParam ? parseInt(weekParam, 10) : undefined;

  const { data, isLoading, error, refetch } = useWorkoutPlan(selectedWeek);

  const handleWeekChange = (week: number) => {
    setSearchParams({ week: week.toString() });
  };

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

  // If error or no data, show "waiting for plan" state
  if (error || !data || !data.workouts || data.workouts.length === 0) {
    return <WaitingForPlan />;
  }

  const { plan, workouts, stats } = data;

  // Use plan data for week navigation
  const currentWeek = plan.currentWeek || plan.weekNumber;
  const totalWeeks = plan.totalWeeks || 8;
  const displayedWeek = selectedWeek || currentWeek;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Plano de Treino</h1>
          <p className="text-gray-600">Acompanhe seu progresso semanal</p>
        </div>
        <Button
          variant="outline"
          asChild
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Link to="/onboarding">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refazer Cadastro
          </Link>
        </Button>
      </div>

      {/* Week Navigator */}
      <WeekNavigator
        currentWeek={currentWeek}
        selectedWeek={displayedWeek}
        totalWeeks={totalWeeks}
        onWeekChange={handleWeekChange}
      />

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

      {/* Workouts List - 7 Day Calendar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Seu Plano Semanal</h2>

        {/* Generate 7-day calendar */}
        {createWeekCalendar(workouts).map((day) => (
          <Card
            key={day.dayOfWeek}
            className={`transition-shadow ${
              day.isRestDay ? 'bg-gray-50 border-gray-200' : 'hover:shadow-lg'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{day.dayName}</CardTitle>
                  {day.workout ? (
                    <CardDescription>
                      {getWorkoutTypeLabel(day.workout.workoutType)}
                    </CardDescription>
                  ) : (
                    <CardDescription className="text-gray-500">
                      Dia de descanso
                    </CardDescription>
                  )}
                </div>
                {day.isRestDay && (
                  <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    Descanso
                  </span>
                )}
                {day.workout && getStatusBadge(day.workout.status)}
              </div>
            </CardHeader>

            {day.workout ? (
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {day.workout.exercises.length} exercícios
                  </p>

                  {day.workout.status === 'completed' && day.workout.completedAt && (
                    <p className="text-sm text-green-600">
                      Concluído em{' '}
                      {new Date(day.workout.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/treino/${day.workout.id}`}>
                        {day.workout.status === 'completed'
                          ? 'Ver treino'
                          : 'Iniciar treino'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <p className="text-center text-gray-500 py-4">
                  Dia de recuperação muscular
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
