import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Fitness Pro
          </h1>
          <p className="mb-2 text-xl text-gray-600">
            Seu personal trainer digital em português
          </p>
          <p className="mb-8 text-lg text-gray-500">
            Treinos personalizados que se adaptam automaticamente ao seu progresso
          </p>

          {/* CTA Buttons - Only show when signed out */}
          <SignedOut>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/register">Criar conta grátis</Link>
              </Button>
            </div>

            {/* Quick Access */}
            <div className="mt-8">
              <Button asChild variant="link">
                <Link href="/onboarding">Ir para Dashboard →</Link>
              </Button>
            </div>
          </SignedOut>

          {/* Signed In - Show Dashboard Access */}
          <SignedIn>
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <p className="text-lg text-gray-700">Bem-vindo de volta! 👋</p>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-12 h-12',
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/plano">Ver Meu Plano de Treino</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/onboarding">Configurar Preferências</Link>
                </Button>
              </div>
            </div>
          </SignedIn>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Planos criados especialmente para seus objetivos: emagrecer, ganhar massa ou manter forma
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Adaptativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seu plano se ajusta automaticamente toda semana com base no seu feedback
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💪</span>
                Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                30+ exercícios com instruções em português, cronômetro e acompanhamento de progresso
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                Casa ou Academia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Treinos adaptados para equipamentos que você tem disponível
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                Flexível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Escolha sua frequência: de 2 a 6 treinos por semana
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🇧🇷</span>
                Em Português
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Feito especialmente para brasileiros no exterior
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">Como funciona</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Complete o Onboarding</h3>
                <p className="text-gray-600">
                  Conte sobre seus objetivos, experiência e equipamentos disponíveis
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Receba seu Plano Personalizado</h3>
                <p className="text-gray-600">
                  Geramos automaticamente sua Semana 1 com exercícios específicos para você
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Execute os Treinos</h3>
                <p className="text-gray-600">
                  Use nosso cronômetro, marque as séries e acompanhe seu progresso
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                4
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Dê Feedback</h3>
                <p className="text-gray-600">
                  Após cada treino, nos diga se foi fácil, ok ou difícil
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                5
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Evolua Automaticamente</h3>
                <p className="text-gray-600">
                  Toda segunda-feira, seu plano é ajustado baseado no seu feedback
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold">Pronto para começar?</h2>
              <p className="mb-6 text-gray-600">
                Crie sua conta grátis e receba seu primeiro plano de treino personalizado
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/register">Começar agora</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Já tenho conta</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
