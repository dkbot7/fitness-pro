import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Heart, Globe, TrendingUp, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Emocional e Direto */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fitpro-red-50 via-white to-fitpro-red-50">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img
                src="/brand/logos/fitpro-logo-original.png"
                alt="FitPro"
                className="h-16 w-16 sm:h-20 sm:w-20"
              />
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-fitpro-charcoal sm:text-5xl md:text-6xl lg:text-7xl">
              Manter seu corpo de brasileira,{' '}
              <span className="block text-fitpro-red">
                mesmo morando fora do Brasil
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700 sm:text-xl md:text-2xl">
              Treinos em português que funcionam com qualquer equipamento.
              <span className="block mt-2 font-semibold text-fitpro-charcoal">
                Você não precisa de uma academia brasileira para ter resultados brasileiros.
              </span>
            </p>

            {/* CTA Buttons - Only show when signed out */}
            <SignedOut>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-fitpro-red px-10 py-7 text-xl font-bold shadow-2xl transition-all hover:scale-105 hover:bg-fitpro-red-600 hover:shadow-2xl sm:w-auto"
                >
                  <Link to="/register">Começar Meu Plano Grátis</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                ✓ Grátis para sempre &nbsp;&nbsp; ✓ Sem cartão de crédito &nbsp;&nbsp; ✓ 100% em português
              </p>

              {/* Social Proof Badge */}
              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-md">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-fitpro-red-100 border-2 border-white"></div>
                  <div className="h-8 w-8 rounded-full bg-fitpro-red-200 border-2 border-white"></div>
                  <div className="h-8 w-8 rounded-full bg-fitpro-red-300 border-2 border-white"></div>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-bold text-fitpro-red">500+</span> brasileiras no exterior já treinam com a gente
                </p>
              </div>
            </SignedOut>

            {/* Signed In */}
            <SignedIn>
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-bold text-fitpro-charcoal">Bem-vinda de volta!</p>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-14 h-14',
                      },
                    }}
                  />
                </div>
                <Button asChild size="lg" className="w-full bg-fitpro-red px-12 py-7 text-xl font-bold shadow-lg hover:bg-fitpro-red-600 sm:w-auto">
                  <Link to="/plano">Ver Meu Treino</Link>
                </Button>
              </div>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Social Proof - Depoimentos de Brasileiras */}
      <section className="border-y border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wide text-gray-600">
              Brasileiras que estão transformando seus corpos no exterior
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <Card className="border-0 bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fitpro-red to-fitpro-red-600"></div>
                    <div>
                      <p className="font-bold text-fitpro-charcoal">Sofia M.</p>
                      <p className="text-sm text-gray-600">🇬🇧 Londres, Reino Unido</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Morando em Londres, achei que nunca mais ia conseguir treinar direito. O FitPro me salvou! Treino em casa, em português, e já perdi 8kg."
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fitpro-red to-fitpro-red-600"></div>
                    <div>
                      <p className="font-bold text-fitpro-charcoal">Camila R.</p>
                      <p className="text-sm text-gray-600">🇨🇦 Toronto, Canadá</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Academia aqui é caríssima! Com o FitPro treino em casa com os halteres que comprei. Resultado em 2 meses: -6kg e muito mais forte!"
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fitpro-red to-fitpro-red-600"></div>
                    <div>
                      <p className="font-bold text-fitpro-charcoal">Juliana S.</p>
                      <p className="text-sm text-gray-600">🇺🇸 Miami, EUA</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Finalmente encontrei um app em português! Não preciso ficar traduzindo exercício. Estou na semana 8 e já vejo diferença no espelho."
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* O Problema - Empatia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-fitpro-charcoal sm:text-4xl">
              Sabemos como é difícil treinar no exterior
            </h2>
            <p className="mb-12 text-xl text-gray-700">
              Academia cara, equipamento limitado, apps só em inglês...
              <br />
              <span className="font-semibold text-fitpro-charcoal">
                Você merece uma solução que funciona para você.
              </span>
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-4 text-4xl">💸</div>
                <h3 className="mb-2 font-semibold text-fitpro-charcoal">Academia cara</h3>
                <p className="text-sm text-gray-600">
                  £50-100/mês que você não quer gastar
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-4 text-4xl">🏋️</div>
                <h3 className="mb-2 font-semibold text-fitpro-charcoal">Equipamento limitado</h3>
                <p className="text-sm text-gray-600">
                  Treinar em casa com o que você tem
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-4 text-4xl">🗣️</div>
                <h3 className="mb-2 font-semibold text-fitpro-charcoal">Apps só em inglês</h3>
                <p className="text-sm text-gray-600">
                  Cansada de traduzir tudo na cabeça
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Solução */}
      <section className="bg-gradient-to-br from-fitpro-red to-fitpro-red-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
              A solução perfeita para brasileiras no exterior
            </h2>
            <p className="mb-12 text-center text-xl opacity-90">
              Tudo o que você precisa para manter seu corpo em forma, do seu jeito
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-0 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
                <CardContent className="p-8 text-center">
                  <HomeIcon className="mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-3 text-xl font-bold">Casa ou Academia</h3>
                  <p className="opacity-90">
                    Treinos adaptados para qualquer lugar. Halteres? Elástico? Só peso corporal? Funciona com tudo.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
                <CardContent className="p-8 text-center">
                  <Globe className="mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-3 text-xl font-bold">100% em Português</h3>
                  <p className="opacity-90">
                    Nomes de exercícios, instruções, tudo em português brasileiro. Como você merece.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-3 text-xl font-bold">Evolui com Você</h3>
                  <p className="opacity-90">
                    Seu plano se ajusta toda semana baseado no seu feedback. Você sempre progride.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-fitpro-charcoal sm:text-4xl">
              Como funciona
            </h2>
            <p className="mb-12 text-center text-xl text-gray-700">
              Simples e rápido. Você começa em menos de 5 minutos.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-6 rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-2xl font-bold text-white">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold text-fitpro-charcoal">
                    Responda 4 perguntas rápidas
                  </h3>
                  <p className="text-lg text-gray-700">
                    Seu objetivo, frequência de treino, onde você treina e equipamentos disponíveis.
                    Leva 2 minutos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-2xl font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold text-fitpro-charcoal">
                    Receba seu plano personalizado
                  </h3>
                  <p className="text-lg text-gray-700">
                    Geramos automaticamente sua primeira semana com exercícios específicos
                    para você. Tudo em português, com cronômetro integrado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-2xl font-bold text-white">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold text-fitpro-charcoal">
                    Veja seu corpo mudar
                  </h3>
                  <p className="text-lg text-gray-700">
                    Dê feedback após cada treino. Toda segunda-feira, ajustamos seu plano
                    automaticamente. Você evolui toda semana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Resultados - Prova Social */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-fitpro-charcoal sm:text-4xl">
              Brasileiras que já estão vendo resultados
            </h2>
            <p className="mb-12 text-center text-xl text-gray-700">
              Você também pode conseguir
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Ana Paula', location: 'Dublin', result: '-10kg em 3 meses' },
                { name: 'Mariana', location: 'Berlin', result: 'Ganhou massa magra' },
                { name: 'Patricia', location: 'Paris', result: '-15kg em 5 meses' },
                { name: 'Fernanda', location: 'Sydney', result: 'Corpo definido' },
                { name: 'Beatriz', location: 'Amsterdam', result: '-7kg em 2 meses' },
                { name: 'Carolina', location: 'Barcelona', result: 'Mais forte e confiante' },
              ].map((person, i) => (
                <Card key={i} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 h-48 rounded-lg bg-gradient-to-br from-fitpro-red-100 to-fitpro-red-200"></div>
                    <p className="mb-1 font-bold text-fitpro-charcoal">{person.name}</p>
                    <p className="mb-2 text-sm text-gray-600">{person.location}</p>
                    <p className="text-sm font-semibold text-fitpro-red">{person.result}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Poderoso */}
      <SignedOut>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-3xl bg-gradient-to-br from-fitpro-red via-fitpro-red-600 to-fitpro-red-700 p-12 text-center shadow-2xl sm:p-16">
                <Heart className="mx-auto mb-6 h-16 w-16 text-white" />
                <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                  Pronta para começar?
                </h2>
                <p className="mb-8 text-xl text-white/90 sm:text-2xl">
                  Seu plano personalizado está esperando você
                </p>
                <p className="mb-10 text-lg text-white/80">
                  Junte-se a 500+ brasileiras que já estão transformando seus corpos no exterior
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-white px-12 py-8 text-2xl font-bold text-fitpro-red shadow-xl transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <Link to="/register">Sim, Quero Meu Corpo de Brasileira</Link>
                </Button>
                <p className="mt-6 text-sm text-white/75">
                  ✓ Grátis para sempre &nbsp; ✓ Sem cartão &nbsp; ✓ Cancele quando quiser
                </p>
                <p className="mt-4 text-xs text-white/60">
                  Leva menos de 2 minutos para começar
                </p>
              </div>
            </div>
          </div>
        </section>
      </SignedOut>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-fitpro-charcoal">
              Perguntas frequentes
            </h2>

            <div className="space-y-6">
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-start gap-3 text-lg font-bold text-fitpro-charcoal">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Funciona sem equipamento?
                  </h3>
                  <p className="ml-8 text-gray-700">
                    Sim! Nossos treinos se adaptam aos equipamentos que você tem. Pode ser só peso corporal,
                    halteres, elásticos, ou tudo junto. Você escolhe no início.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-start gap-3 text-lg font-bold text-fitpro-charcoal">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Quanto tempo leva para ver resultados?
                  </h3>
                  <p className="ml-8 text-gray-700">
                    A maioria das nossas usuárias vê mudanças visíveis em 4-6 semanas. Com consistência,
                    resultados significativos aparecem em 2-3 meses.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-start gap-3 text-lg font-bold text-fitpro-charcoal">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    É realmente grátis?
                  </h3>
                  <p className="ml-8 text-gray-700">
                    Sim, 100% grátis. Sem pegadinhas, sem plano premium escondido, sem limite de tempo.
                    Todos os recursos são gratuitos para sempre.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-start gap-3 text-lg font-bold text-fitpro-charcoal">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Preciso ter experiência com treino?
                  </h3>
                  <p className="ml-8 text-gray-700">
                    Não! Temos treinos para iniciantes, intermediários e avançados. O plano se adapta ao
                    seu nível. Você escolhe sua experiência no onboarding.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-start gap-3 text-lg font-bold text-fitpro-charcoal">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Como o treino evolui?
                  </h3>
                  <p className="ml-8 text-gray-700">
                    Após cada treino, você dá feedback (fácil/ok/difícil). Toda segunda-feira,
                    ajustamos automaticamente seu plano baseado no seu progresso. Você sempre é desafiada na medida certa.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-start gap-3 text-lg font-bold text-fitpro-charcoal">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Funciona no celular?
                  </h3>
                  <p className="ml-8 text-gray-700">
                    Sim! O FitPro funciona perfeitamente no navegador do celular. É responsivo e foi
                    feito pensando mobile-first. Adicione à tela inicial para usar como app.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Melhorado */}
      <footer className="border-t-2 border-fitpro-red bg-fitpro-charcoal py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src="/brand/logos/fitpro-logo-original.png"
                    alt="FitPro"
                    className="h-10 w-10"
                  />
                  <span className="text-xl font-bold">FitPro</span>
                </div>
                <p className="text-sm text-gray-400">
                  Seu personal trainer digital em português. Feito por brasileiros, para brasileiras no mundo todo.
                </p>
              </div>

              {/* Produto */}
              <div>
                <h3 className="mb-4 font-semibold">Produto</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/register" className="hover:text-white">Como funciona</Link></li>
                  <li><Link to="/register" className="hover:text-white">Começar grátis</Link></li>
                  <li><Link to="/login" className="hover:text-white">Entrar</Link></li>
                </ul>
              </div>

              {/* Suporte */}
              <div>
                <h3 className="mb-4 font-semibold">Suporte</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                  <li className="hover:text-white">Contato</li>
                  <li className="hover:text-white">Privacidade</li>
                </ul>
              </div>

              {/* Trust Signals */}
              <div>
                <h3 className="mb-4 font-semibold">Segurança</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-green-400" />
                    Dados 100% seguros
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-green-400" />
                    Privacidade garantida
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-green-400" />
                    Grátis para sempre
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-700 pt-8 text-center">
              <p className="text-sm text-gray-400">
                © 2026 FitPro - Feito com dedicação para brasileiras no exterior
              </p>
              <p className="mt-2 text-xs text-gray-500">
                🇧🇷 Orgulhosamente brasileiro
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
