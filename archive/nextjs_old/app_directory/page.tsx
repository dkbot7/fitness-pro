import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/brand/logos/fitpro-logo-original.png"
              alt="FitPro"
              width={96}
              height={96}
              priority
              className="h-20 w-20 sm:h-24 sm:w-24"
            />
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-fitpro-charcoal sm:text-5xl md:text-6xl">
            Seu personal trainer
            <span className="block text-fitpro-red">sempre disponível</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Treinos personalizados que evoluem com você. Sem mensalidade, sem academia cara.
          </p>

          {/* CTA Buttons - Only show when signed out */}
          <SignedOut>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-fitpro-red text-lg font-semibold shadow-lg transition-all hover:bg-fitpro-red-600 hover:shadow-xl sm:w-auto sm:px-8"
              >
                <Link href="/register">Começar grátis</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-2 text-lg sm:w-auto sm:px-8"
              >
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Sem cartão de crédito. Sem truques.
            </p>
          </SignedOut>

          {/* Signed In - Show Dashboard Access */}
          <SignedIn>
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <p className="text-xl text-fitpro-charcoal-700">Bem-vindo de volta!</p>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-12 h-12',
                    },
                  }}
                />
              </div>
              <Button asChild size="lg" className="w-full bg-fitpro-red px-8 shadow-lg hover:bg-fitpro-red-600 sm:w-auto">
                <Link href="/plano">Ver Meu Treino</Link>
              </Button>
            </div>
          </SignedIn>
        </div>

        {/* Social Proof */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid gap-6 text-center sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-fitpro-red">30+</div>
              <div className="mt-1 text-sm text-gray-600">Exercícios</div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-fitpro-red">100%</div>
              <div className="mt-1 text-sm text-gray-600">Grátis</div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-fitpro-red">Em PT-BR</div>
              <div className="mt-1 text-sm text-gray-600">Totalmente em português</div>
            </div>
          </div>
        </div>

        {/* Features - Only 3 main ones */}
        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-fitpro-charcoal">
            Por que FitPro?
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <Card className="border-0 shadow-md transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4 text-5xl">🎯</div>
                <h3 className="mb-2 text-xl font-semibold text-fitpro-charcoal">
                  Personalizado
                </h3>
                <p className="text-gray-600">
                  Seu plano se adapta aos seus objetivos e equipamentos
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4 text-5xl">📈</div>
                <h3 className="mb-2 text-xl font-semibold text-fitpro-charcoal">
                  Evolutivo
                </h3>
                <p className="text-gray-600">
                  Progresso automático baseado no seu feedback semanal
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4 text-5xl">⚡</div>
                <h3 className="mb-2 text-xl font-semibold text-fitpro-charcoal">
                  Simples
                </h3>
                <p className="text-gray-600">
                  Cronômetro integrado, instruções claras, zero complicação
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How it Works - Simplified */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-fitpro-charcoal">
            Como funciona
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-lg font-bold text-white">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-fitpro-charcoal">Configure seu perfil</h3>
                <p className="text-gray-600">
                  Responda 4 perguntas rápidas sobre seus objetivos e equipamentos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-lg font-bold text-white">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-fitpro-charcoal">Treine no seu ritmo</h3>
                <p className="text-gray-600">
                  Receba seu plano semanal personalizado e execute os treinos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-lg font-bold text-white">
                3
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-fitpro-charcoal">Evolua automaticamente</h3>
                <p className="text-gray-600">
                  Dê feedback e veja seu plano se ajustar toda semana
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <SignedOut>
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <div className="rounded-2xl bg-gradient-to-br from-fitpro-red to-fitpro-red-600 p-8 shadow-xl sm:p-12">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Pronto para começar?
              </h2>
              <p className="mb-8 text-lg text-white/90">
                Seu primeiro plano personalizado te espera
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-lg font-semibold text-fitpro-red hover:bg-gray-100 sm:px-12"
              >
                <Link href="/register">Criar conta grátis</Link>
              </Button>
              <p className="mt-4 text-sm text-white/75">
                Leva menos de 2 minutos
              </p>
            </div>
          </div>
        </SignedOut>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>FitPro - Seu personal trainer digital em português</p>
          <p className="mt-2">2026 - Feito com dedicação para brasileiros no mundo todo</p>
        </div>
      </footer>
    </main>
  );
}
