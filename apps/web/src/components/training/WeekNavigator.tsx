import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WeekNavigatorProps {
  currentWeek: number;
  selectedWeek: number;
  totalWeeks: number;
  onWeekChange: (week: number) => void;
}

export function WeekNavigator({
  currentWeek,
  selectedWeek,
  totalWeeks,
  onWeekChange,
}: WeekNavigatorProps) {
  const canGoPrevious = selectedWeek > 1;
  const canGoNext = selectedWeek < totalWeeks;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onWeekChange(selectedWeek - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onWeekChange(selectedWeek + 1);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6 border border-purple-200 dark:border-purple-800">
      {/* Previous Week Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Week Info */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Semana {selectedWeek} de {totalWeeks}
          </h2>
        </div>

        {/* Current Week Badge */}
        {selectedWeek === currentWeek && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Semana Atual
          </Badge>
        )}
        {selectedWeek < currentWeek && (
          <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
            Concluída
          </Badge>
        )}
        {selectedWeek > currentWeek && (
          <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
            Futura
          </Badge>
        )}
      </div>

      {/* Next Week Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!canGoNext}
        className="gap-1"
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
