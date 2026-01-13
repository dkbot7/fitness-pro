/**
 * Program Info Card Component
 *
 * Displays the user's training program information from the methodology system
 */

import { useProgramInfo, useMethodologyAvailable } from '@/hooks/use-methodology-hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Dumbbell, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProgramInfoCard() {
  const { data: availability, isLoading: checkingAvailability } = useMethodologyAvailable();
  const { data: programData, isLoading: loadingProgram } = useProgramInfo();

  if (checkingAvailability || loadingProgram) {
    return <ProgramInfoSkeleton />;
  }

  if (!availability?.available) {
    return null; // Don't show if not available
  }

  const program = programData?.program;

  if (!program) {
    return null;
  }

  const goalLabels: Record<string, string> = {
    lose_weight: 'Emagrecimento',
    gain_muscle: 'Ganho de Massa Muscular',
    maintenance: 'Manutenção',
  };

  const splitLabels: Record<string, string> = {
    full_body: 'Full Body',
    upper_lower: 'Upper/Lower',
    ppl: 'Push/Pull/Legs',
    pplul: 'Push/Pull/Upper/Lower',
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Seu Programa de Treino
            </CardTitle>
            <CardDescription className="mt-1">
              Baseado em metodologia científica
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            🧬 Methodology
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Objetivo</p>
            <p className="font-semibold">{goalLabels[program.goal]}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Split</p>
            <p className="font-semibold">{splitLabels[program.recommendedSplit]}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Frequência</p>
            <p className="font-semibold">{program.frequencyPerWeek}x por semana</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="font-semibold">{program.volumeLandmark}</p>
          </div>
        </div>

        {/* Volume Distribution */}
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Distribuição Semanal (séries/semana):</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Peito</span>
              <span className="font-semibold">{program.setsPerWeekChest}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Costas</span>
              <span className="font-semibold">{program.setsPerWeekBack}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Pernas</span>
              <span className="font-semibold">{program.setsPerWeekLegs}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Ombros</span>
              <span className="font-semibold">{program.setsPerWeekShoulders}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Braços</span>
              <span className="font-semibold">{program.setsPerWeekArms}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span>Core</span>
              <span className="font-semibold">{program.setsPerWeekCore}</span>
            </div>
          </div>
        </div>

        {/* Training Parameters */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">
            <Dumbbell className="h-3 w-3 mr-1" />
            RPE {program.trainingIntensityRpe}
          </Badge>
          <Badge variant="outline">
            <Info className="h-3 w-3 mr-1" />
            Descanso: {program.restBetweenSetsSec}s
          </Badge>
          <Badge variant="outline">
            <Info className="h-3 w-3 mr-1" />
            Duração: {program.sessionDurationMin} min
          </Badge>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Este programa foi selecionado automaticamente com base no seu perfil e objetivos,
            seguindo as mais recentes evidências científicas de treinamento.
          </AlertDescription>
        </Alert>

        {/* Action Button */}
        <Link to="/methodology/plan">
          <Button className="w-full" size="lg">
            Ver Detalhes do Programa
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ProgramInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
