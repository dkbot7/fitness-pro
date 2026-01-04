'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Achievement {
  id: number;
  slug: string;
  namePt: string;
  descriptionPt: string;
  iconName: string;
  category: 'streak' | 'milestone' | 'special';
  requirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: Date | null;
  progress?: number; // Current progress towards unlocking
}

interface AchievementsGridProps {
  achievements: Achievement[];
  currentStreak?: number;
  totalWorkouts?: number;
}

// Rarity colors
const RARITY_COLORS = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
    icon: 'text-gray-600',
  },
  rare: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-900',
    icon: 'text-blue-600',
  },
  epic: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-900',
    icon: 'text-purple-600',
  },
  legendary: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    text: 'text-yellow-900',
    icon: 'text-yellow-600',
  },
};

export function AchievementsGrid({ achievements, currentStreak = 0, totalWorkouts = 0 }: AchievementsGridProps) {
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Get icon component by name
  const getIcon = (iconName: string): LucideIcon => {
    return (Icons as any)[iconName] || Icons.Award;
  };

  // Calculate progress for locked achievements
  const getProgress = (achievement: Achievement): number => {
    if (achievement.isUnlocked) return 100;

    if (achievement.category === 'streak') {
      return Math.min(100, (currentStreak / achievement.requirement) * 100);
    }

    if (achievement.category === 'milestone') {
      return Math.min(100, (totalWorkouts / achievement.requirement) * 100);
    }

    return achievement.progress || 0;
  };

  // Group achievements by category
  const groupedAchievements = {
    streak: achievements.filter((a) => a.category === 'streak'),
    milestone: achievements.filter((a) => a.category === 'milestone'),
    special: achievements.filter((a) => a.category === 'special'),
  };

  const categoryNames = {
    streak: 'Sequências',
    milestone: 'Marcos',
    special: 'Especiais',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conquistas</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{unlockedCount}/{totalCount}</p>
            <p className="text-xs text-gray-600">{completionPercentage}% completo</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-3">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Render each category */}
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
          if (categoryAchievements.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="mb-3 font-semibold text-gray-700">
                {categoryNames[category as keyof typeof categoryNames]}
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {categoryAchievements.map((achievement) => {
                  const Icon = getIcon(achievement.iconName);
                  const colors = RARITY_COLORS[achievement.rarity];
                  const progress = getProgress(achievement);
                  const isLocked = !achievement.isUnlocked;

                  return (
                    <div
                      key={achievement.id}
                      className={`group relative rounded-lg border-2 p-3 text-center transition-all ${
                        isLocked
                          ? 'border-gray-200 bg-gray-50 opacity-60 hover:opacity-80'
                          : `${colors.border} ${colors.bg} hover:shadow-md`
                      }`}
                      title={achievement.descriptionPt}
                    >
                      {/* Icon */}
                      <div className="mb-2 flex justify-center">
                        <div
                          className={`rounded-full p-2 ${
                            isLocked ? 'bg-gray-200' : 'bg-white'
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              isLocked ? 'text-gray-400' : colors.icon
                            }`}
                          />
                        </div>
                      </div>

                      {/* Name */}
                      <p
                        className={`text-xs font-semibold ${
                          isLocked ? 'text-gray-500' : colors.text
                        }`}
                      >
                        {achievement.namePt}
                      </p>

                      {/* Progress bar for locked achievements */}
                      {isLocked && progress > 0 && (
                        <div className="mt-2">
                          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{Math.round(progress)}%</p>
                        </div>
                      )}

                      {/* Unlocked date */}
                      {achievement.unlockedAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </p>
                      )}

                      {/* Lock icon overlay for locked achievements */}
                      {isLocked && (
                        <div className="absolute right-1 top-1">
                          <Icons.Lock className="h-3 w-3 text-gray-400" />
                        </div>
                      )}

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white group-hover:block">
                        <p className="font-semibold">{achievement.namePt}</p>
                        <p className="mt-1 opacity-90">{achievement.descriptionPt}</p>
                        {isLocked && (
                          <p className="mt-1 text-gray-300">
                            {achievement.category === 'streak' && `${currentStreak}/${achievement.requirement} dias`}
                            {achievement.category === 'milestone' && `${totalWorkouts}/${achievement.requirement} treinos`}
                          </p>
                        )}
                        {/* Arrow */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
