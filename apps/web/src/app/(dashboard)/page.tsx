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

      {/* TODO: Check if user has completed onboarding */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Complete seu perfil</CardTitle>
          <CardDescription className="text-blue-700">
            Precisamos de algumas informações para criar seu plano de treino personalizado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/onboarding">Começar agora</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
