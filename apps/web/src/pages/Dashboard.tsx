import { useUser } from '@clerk/clerk-react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
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

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Complete seu perfil</CardTitle>
            <CardDescription className="text-blue-700">
              Configure suas preferências e gere seu plano de treino personalizado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/onboarding">Começar onboarding</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">Meu Plano de Treino</CardTitle>
            <CardDescription className="text-green-700">
              Veja seus treinos da semana e acompanhe seu progresso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default" className="bg-green-600 hover:bg-green-700">
              <Link to="/plano">Ver plano</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
