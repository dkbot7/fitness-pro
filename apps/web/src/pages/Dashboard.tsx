import { useUser } from '@clerk/clerk-react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading-state';
import { ProgramInfoCard } from '@/components/methodology/ProgramInfoCard';
import { Dumbbell, Target } from 'lucide-react';

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <PageLoading message="Carregando seu dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo, {user.firstName || 'atleta'}!</CardTitle>
          <CardDescription>
            Seu personal trainer digital está pronto para começar.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Methodology Program Info */}
      <ProgramInfoCard />

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Complete seu perfil</CardTitle>
            </div>
            <CardDescription className="text-blue-700">
              Configure suas preferências e gere seu plano de treino personalizado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/onboarding">Começar onboarding</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Meu Plano de Treino</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Veja seus treinos da semana e acompanhe seu progresso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 w-full">
              <Link to="/plano">Ver plano</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
