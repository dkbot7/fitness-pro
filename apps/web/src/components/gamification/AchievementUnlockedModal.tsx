'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Achievement {
  id: number;
  slug: string;
  namePt: string;
  descriptionPt: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementUnlockedModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

// Rarity colors and labels
const RARITY_CONFIG = {
  common: {
    gradient: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-400',
    label: 'Comum',
    emoji: '⚪',
  },
  rare: {
    gradient: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-400',
    label: 'Raro',
    emoji: '🔵',
  },
  epic: {
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-400',
    label: 'Épico',
    emoji: '🟣',
  },
  legendary: {
    gradient: 'from-yellow-400 to-orange-500',
    glow: 'shadow-yellow-400',
    label: 'Lendário',
    emoji: '🟡',
  },
};

export function AchievementUnlockedModal({
  achievement,
  onClose,
}: AchievementUnlockedModalProps) {
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        delay: Math.random() * 0.5,
      }));

      // Play celebration sound (if available)
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100, 50, 200]);
        }
      } catch {
        // Ignore vibration errors
      }

      // Set confetti and trigger visibility in separate microtasks
      requestAnimationFrame(() => {
        setConfetti(particles);
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });

      return () => {
        setIsVisible(false);
      };
    }
  }, [achievement]);

  if (!achievement) return null;

  const IconComponent: LucideIcon = (Icons as any)[achievement.iconName] || Icons.Award;

  const config = RARITY_CONFIG[achievement.rarity];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="pointer-events-none absolute h-2 w-2 animate-confetti rounded-full bg-gradient-to-r from-yellow-400 to-pink-500"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Modal Card */}
      <Card
        className={`relative max-w-md transform transition-transform duration-500 ${
          isVisible ? 'scale-100' : 'scale-75'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6 text-center">
          {/* Header */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600">🎉 Conquista Desbloqueada!</p>
            <p className="mt-1 text-xs text-gray-500">
              {config.emoji} {config.label}
            </p>
          </div>

          {/* Icon with glow effect */}
          <div className="mb-6 flex justify-center">
            <div
              className={`animate-bounce rounded-full bg-gradient-to-br ${config.gradient} p-6 shadow-2xl ${config.glow}`}
              style={{
                boxShadow: `0 0 40px ${
                  achievement.rarity === 'legendary'
                    ? 'rgba(251, 191, 36, 0.6)'
                    : achievement.rarity === 'epic'
                    ? 'rgba(147, 51, 234, 0.6)'
                    : achievement.rarity === 'rare'
                    ? 'rgba(59, 130, 246, 0.6)'
                    : 'rgba(156, 163, 175, 0.4)'
                }`,
              }}
            >
              <IconComponent className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Achievement Name */}
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{achievement.namePt}</h2>

          {/* Description */}
          <p className="mb-6 text-gray-600">{achievement.descriptionPt}</p>

          {/* CTA Button */}
          <div className="space-y-2">
            <Button onClick={handleClose} className="w-full" size="lg">
              Continuar Treinando
            </Button>
            <Button
              onClick={() => {
                handleClose();
                // Navigate to achievements page
                window.location.href = '/conquistas';
              }}
              variant="outline"
              className="w-full"
            >
              Ver Todas Conquistas
            </Button>
          </div>

          {/* Motivational quote */}
          <p className="mt-4 text-xs italic text-gray-500">
            "{achievement.rarity === 'legendary' && 'Você é uma lenda viva! 🔥'}
            {achievement.rarity === 'epic' && 'Esforço épico merece reconhecimento épico! 💪'}
            {achievement.rarity === 'rare' && 'Sua dedicação está dando frutos! 🌟'}
            {achievement.rarity === 'common' && 'Todo grande caminho começa com um passo! 🎯'}"
          </p>
        </CardContent>
      </Card>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
