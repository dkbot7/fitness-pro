import { useUser, useAuth } from '@clerk/clerk-react';
import { SignOutButton } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StreakCard } from '@/components/gamification/StreakCard';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Goal labels mapping
const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Emagrecer',
  gain_muscle: 'Ganhar Massa Muscular',
  maintenance: 'Manter Forma',
};

// Location labels
const LOCATION_LABELS: Record<string, string> = {
  home: 'Em Casa',
  gym: 'Academia',
};

// Experience labels
const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';

  // Fetch user profile
  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const res = await fetch(`${apiUrl}/api/users/me/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 404) {
          return null; // No profile yet
        }
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      return res.json();
    },
    enabled: isLoaded && !!user,
    retry: 1,
  });

  // Fetch user stats
  const { data: statsData, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const res = await fetch(`${apiUrl}/api/users/me/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch stats');
      }
      return res.json();
    },
    enabled: isLoaded && !!user,
    retry: 1,
  });

  // Fetch user streak
  const { data: streakData, isLoading: isLoadingStreak, error: streakError } = useQuery({
    queryKey: ['user-streak'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const res = await fetch(`${apiUrl}/api/gamification/streak`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch streak');
      }
      return res.json();
    },
    enabled: isLoaded && !!user,
    retry: 1,
  });

  const profile = profileData?.profile;
  const stats = statsData?.stats;
  const currentStreak = streakData?.streak?.currentStreak || 0;
  const longestStreak = streakData?.streak?.longestStreak || 0;
  const totalWorkouts = streakData?.streak?.totalWorkoutsCompleted || 0;
  const isLoading = !isLoaded || isLoadingProfile || isLoadingStats || isLoadingStreak;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações e preferências de treino</p>
      </div>

      {/* Streak Card */}
      {totalWorkouts > 0 && (
        <div className="mb-6">
          <StreakCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalWorkouts={totalWorkouts}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="h-20 w-20 rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{user?.fullName || 'Usuário'}</p>
                <p className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-base">{user?.firstName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sobrenome</label>
                <p className="text-base">{user?.lastName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-base">{user?.primaryEmailAddress?.emailAddress || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Membro desde</label>
                <p className="text-base">
                  {stats?.memberSince
                    ? new Date(stats.memberSince).toLocaleDateString('pt-BR')
                    : user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                    : '-'}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild variant="outline">
                <a href="https://accounts.clerk.dev/user" target="_blank" rel="noopener noreferrer">
                  Editar informações da conta
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estatísticas Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Semana atual</p>
              <p className="text-2xl font-bold">{stats?.currentWeekNumber || 1}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Treinos concluídos</p>
              <p className="text-2xl font-bold">{stats?.totalWorkoutsCompleted || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa de conclusão</p>
              <p className="text-2xl font-bold">{stats?.overallCompletionRate || 0}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Semanas treinadas</p>
              <p className="text-2xl font-bold">{stats?.totalWeeks || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Workout Preferences Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preferências de Treino</CardTitle>
                <CardDescription>Configure seu plano personalizado</CardDescription>
              </div>
              <Button asChild>
                <Link to="/onboarding">Reconfigurar</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Objetivo:</span>
                  <span className="font-medium">{GOAL_LABELS[profile.goal] || profile.goal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequência:</span>
                  <span className="font-medium">{profile.frequencyPerWeek}x/semana</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Local:</span>
                  <span className="font-medium">
                    {LOCATION_LABELS[profile.location] || profile.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nível:</span>
                  <span className="font-medium">
                    {EXPERIENCE_LABELS[profile.experienceLevel] || profile.experienceLevel}
                  </span>
                </div>
                {profile.equipment && profile.equipment.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equipamentos:</span>
                    <span className="font-medium">{profile.equipment.length} selecionados</span>
                  </div>
                )}
                {profile.limitations && profile.limitations.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Limitações:</span>
                    <span className="font-medium">{profile.limitations.length} informadas</span>
                  </div>
                )}
                {profile.onboardingCompletedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Perfil criado em:</span>
                    <span className="font-medium">
                      {new Date(profile.onboardingCompletedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objetivo:</span>
                    <span className="font-medium">Não configurado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequência:</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Local:</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nível:</span>
                    <span className="font-medium">-</span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-900">
                    💡 Complete o onboarding para personalizar seu plano de treino
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/plano">Ver Plano de Treino</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/conquistas">Ver Conquistas</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/onboarding">Reconfigurar Preferências</Link>
            </Button>
            <SignOutButton>
              <Button variant="outline" className="w-full justify-start text-red-600">
                Sair da Conta
              </Button>
            </SignOutButton>
          </CardContent>
        </Card>
      </div>

      {/* Current Week Progress */}
      {stats?.currentWeek && stats.currentWeek.total > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Progresso desta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.currentWeek.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{stats.currentWeek.completed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxa</p>
                <p className="text-2xl font-bold">{stats.currentWeek.completionRate}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${stats.currentWeek.completionRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* App Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Sobre o App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Versão:</span>
            <span className="font-medium">1.0.0 (MVP)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Última atualização:</span>
            <span className="font-medium">Janeiro 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Exercícios disponíveis:</span>
            <span className="font-medium">30+</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
