'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy, TrendingUp } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
}

export function StreakCard({ currentStreak, longestStreak, totalWorkouts }: StreakCardProps) {
  // Streak status
  const getStreakStatus = () => {
    if (currentStreak === 0) return { text: 'Comece hoje!', color: 'text-gray-600' };
    if (currentStreak < 3) return { text: 'Aquecendo 🔥', color: 'text-orange-600' };
    if (currentStreak < 7) return { text: 'Pegando fogo! 🔥🔥', color: 'text-orange-500' };
    if (currentStreak < 14) return { text: 'Em chamas! 🔥🔥🔥', color: 'text-red-500' };
    return { text: 'Lendário! 🔥🔥🔥🔥', color: 'text-red-600' };
  };

  const status = getStreakStatus();

  // Next milestone
  const nextMilestone = () => {
    if (currentStreak < 3) return { target: 3, name: 'Aquecendo' };
    if (currentStreak < 7) return { target: 7, name: 'Semana Completa' };
    if (currentStreak < 14) return { target: 14, name: 'Fortalecendo' };
    if (currentStreak < 30) return { target: 30, name: 'Mês de Ferro' };
    if (currentStreak < 60) return { target: 60, name: 'Imparável' };
    if (currentStreak < 100) return { target: 100, name: 'Lenda Viva' };
    return null;
  };

  const milestone = nextMilestone();

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Sequência de Treinos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Streak - Main focus */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Flame className={`h-12 w-12 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
            <div>
              <p className="text-5xl font-bold text-orange-600">{currentStreak}</p>
              <p className="text-sm text-gray-600">dias seguidos</p>
            </div>
          </div>
          <p className={`mt-2 font-medium ${status.color}`}>{status.text}</p>
        </div>

        {/* Progress to next milestone */}
        {milestone && (
          <div className="rounded-lg bg-white p-3">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600">Próxima conquista:</span>
              <span className="font-medium">{milestone.name}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                style={{ width: `${(currentStreak / milestone.target) * 100}%` }}
              ></div>
            </div>
            <p className="mt-1 text-right text-xs text-gray-500">
              {currentStreak}/{milestone.target} dias
            </p>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white p-3 text-center">
            <Trophy className="mx-auto h-5 w-5 text-yellow-600" />
            <p className="mt-1 text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs text-gray-600">Recorde</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-blue-600" />
            <p className="mt-1 text-2xl font-bold">{totalWorkouts}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
        </div>

        {/* Motivational message */}
        {currentStreak > 0 && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <p className="text-center text-sm text-orange-900">
              <strong>Não perca sua sequência!</strong><br />
              Treine hoje para manter os {currentStreak} dias.
            </p>
          </div>
        )}

        {currentStreak === 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-center text-sm text-blue-900">
              💡 <strong>Dica:</strong> Completar treinos em dias consecutivos desbloqueia badges especiais!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
