'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { AchievementsGrid } from '@/components/gamification/AchievementsGrid';
import { StreakCard } from '@/components/gamification/StreakCard';
import Link from 'next/link';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function ConquistasPage() {
  const { user, isLoaded } = useUser();

  // Fetch achievements
  const { data: achievementsData, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['user-achievements'],
    queryFn: async () => {
      const res = await fetch('/api/gamification/achievements', {
        headers: {
          'Authorization': `Bearer ${await user?.getToken()}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch achievements');
      }
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch streak
  const { data: streakData, isLoading: isLoadingStreak } = useQuery({
    queryKey: ['user-streak'],
    queryFn: async () => {
      const res = await fetch('/api/gamification/streak', {
        headers: {
          'Authorization': `Bearer ${await user?.getToken()}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch streak');
      }
      return res.json();
    },
    enabled: !!user,
  });

  const isLoading = !isLoaded || isLoadingAchievements || isLoadingStreak;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded bg-gray-200"></div>
          <div className="h-96 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const achievements = achievementsData?.achievements || [];
  const currentStreak = streakData?.streak?.currentStreak || 0;
  const longestStreak = streakData?.streak?.longestStreak || 0;
  const totalWorkouts = streakData?.streak?.totalWorkoutsCompleted || 0;

  const unlockedCount = achievements.filter((a: any) => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/plano"
          className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar ao plano
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 p-3">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Minhas Conquistas</h1>
            <p className="text-gray-600">
              {unlockedCount} de {totalCount} desbloqueadas
            </p>
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="mb-6">
        <StreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          totalWorkouts={totalWorkouts}
        />
      </div>

      {/* Motivational Message */}
      {unlockedCount > 0 && (
        <div className="mb-6 rounded-lg border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
          <p className="text-center text-lg font-semibold text-gray-800">
            🎉 Parabéns! Você já desbloqueou {unlockedCount} conquista{unlockedCount > 1 ? 's' : ''}!
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            Continue treinando para desbloquear as {totalCount - unlockedCount} restantes.
          </p>
        </div>
      )}

      {unlockedCount === 0 && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-center text-sm text-blue-900">
            💡 <strong>Dica:</strong> Complete seu primeiro treino para desbloquear sua primeira conquista!
          </p>
        </div>
      )}

      {/* Achievements Grid */}
      <AchievementsGrid
        achievements={achievements}
        currentStreak={currentStreak}
        totalWorkouts={totalWorkouts}
      />

      {/* Footer Tips */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-3 font-semibold text-gray-800">Como desbloquear conquistas?</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            🔥 <strong>Sequências:</strong> Treine em dias consecutivos para desbloquear badges de streak
          </p>
          <p>
            🏆 <strong>Marcos:</strong> Complete treinos para atingir milestones (5, 10, 25, 50...)
          </p>
          <p>
            ⭐ <strong>Especiais:</strong> Complete desafios únicos como "Semana Perfeita" ou "Madrugador"
          </p>
          <p>
            💎 <strong>Raridade:</strong> Cinza = Comum, Azul = Raro, Roxo = Épico, Dourado = Lendário
          </p>
        </div>
      </div>
    </div>
  );
}
