'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WorkoutTimerProps {
  defaultSeconds?: number;
}

export function WorkoutTimer({ defaultSeconds = 60 }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState(defaultSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play sound when timer ends
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Ignore audio play errors (browser restrictions)
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (seconds === 0) {
      setSeconds(customTime);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(customTime);
  };

  const handleQuickSet = (time: number) => {
    setSeconds(time);
    setCustomTime(time);
    setIsRunning(false);
  };

  const getProgressPercentage = () => {
    return ((customTime - seconds) / customTime) * 100;
  };

  const isTimerComplete = seconds === 0 && !isRunning;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cronômetro de Descanso</h3>

        {/* Timer Display */}
        <div className="relative">
          <div
            className={`flex items-center justify-center rounded-lg border-4 py-8 text-5xl font-bold transition-colors ${
              isTimerComplete
                ? 'border-green-500 bg-green-50 text-green-700'
                : isRunning
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-gray-50 text-gray-700'
            }`}
          >
            {formatTime(seconds)}
          </div>

          {/* Progress Bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-1000 ${
                isTimerComplete ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex-1" size="lg">
              {seconds === 0 ? 'Reiniciar' : 'Iniciar'}
            </Button>
          ) : (
            <Button onClick={handlePause} className="flex-1" variant="secondary" size="lg">
              Pausar
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" size="lg">
            Resetar
          </Button>
        </div>

        {/* Quick Set Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={() => handleQuickSet(30)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            30s
          </Button>
          <Button
            onClick={() => handleQuickSet(60)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            1min
          </Button>
          <Button
            onClick={() => handleQuickSet(90)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            1:30
          </Button>
          <Button
            onClick={() => handleQuickSet(120)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            2min
          </Button>
        </div>

        {isTimerComplete && (
          <div className="rounded-lg bg-green-100 p-3 text-center text-sm font-medium text-green-800">
            ✓ Descanso completo! Próxima série
          </div>
        )}
      </div>

      {/* Hidden audio element for timer completion sound */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0OVarn7K5aFg5Dmuv0u2gdBjWO1PLPfS0GJ3nG8OCUQQYT"
      />
    </Card>
  );
}
