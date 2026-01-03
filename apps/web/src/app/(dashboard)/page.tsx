import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
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
              <Link href="/onboarding">Começar onboarding</Link>
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
              <Link href="/plano">Ver plano</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
