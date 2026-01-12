import { Link } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Dumbbell, Home as HomeIcon, Star, MessageCircle, Clock, Users, Zap, Target, Trophy, Globe } from 'lucide-react';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/brand/logos/fitpro-logo-new.png"
              alt="FitPro"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">
              <span className="text-gray-900">FIT</span>
              <span className="text-fitpro-red">PRO</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/plano">
                    <HomeIcon className="mr-1 h-4 w-4" />
                    Meu Treino
                  </Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm" className="bg-fitpro-red hover:bg-fitpro-red/90">
                  <Link to="/register">Avaliação Grátis</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section - Minimal & Focused */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Trust Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-fitpro-red/10 px-4 py-2 text-sm font-medium text-fitpro-red">
              <Trophy className="h-4 w-4" />
              Torne-se a sua melhor versão
            </div>

            {/* Hero Headline - Clear Value Prop */}
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Consultoria Online com Personal Trainer,{' '}
              <span className="text-fitpro-red">
                em qualquer lugar do mundo
              </span>
            </h1>

            {/* Subheadline - Specific Benefit */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Treinos 100% personalizados que vão te levar do ANTES para o DEPOIS em menos tempo e com mais qualidade
            </p>

            {/* Single Clear CTA */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="w-full bg-fitpro-red px-8 py-6 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:bg-fitpro-red/90 sm:w-auto"
              >
                <Link to="/register">Faça uma Avaliação Agora Mesmo</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" /> Treinos com Consistência
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" /> Progressão de Carga
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" /> 100% On-Line
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple 3 Steps */}
      <section id="como-funciona" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Como funciona a consultoria
              </h2>
              <p className="text-lg text-gray-600">
                Processo profissional em 3 etapas simples
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-xl font-bold text-white">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    Avaliação Inicial Completa
                  </h3>
                  <p className="text-gray-600">
                    Preencha o questionário <Link to="/register" className="text-fitpro-red font-semibold hover:underline">(clique aqui)</Link> e envie ele diretamente para O WHATSAPP do seu novo personal trainer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-xl font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    Consulta com Personal Trainer
                  </h3>
                  <p className="text-gray-600">
                    Depois que enviar as informações do questionário por whatsapp, o seu personal vai conversar com você para te entender melhor e montar o melhor plano de treinos para o seu objetivo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-fitpro-red text-xl font-bold text-white">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    Treinamento e Acompanhamento
                  </h3>
                  <p className="text-gray-600">
                    Você recebe um treino 100% personalizado, feito sob medida para sua realidade. O app oferece cronômetro integrado que te guia durante os exercícios e controla o tempo de descanso. Todo mês, seu personal ajusta o treino de acordo com seu progresso, baseado nas atualizações do app e no feedback direto via WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Focused on User Value */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Por que escolher nossa consultoria
              </h2>
              <p className="text-lg text-gray-600">
                Acompanhamento profissional de verdade, não é treino pronto
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fitpro-red/10">
                  <Users className="h-7 w-7 text-fitpro-red" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Personal Dedicado
                </h3>
                <p className="text-gray-600">
                  Tenha um profissional experiente focado 100% em você. Planos criados por humanos, não por algoritmos. Acompanhamento real que entende suas necessidades.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fitpro-red/10">
                  <Globe className="h-7 w-7 text-fitpro-red" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Onde Você Estiver
                </h3>
                <p className="text-gray-600">
                  Sua transformação não tem fronteiras. Esteja no Brasil, Europa, Ásia ou em qualquer lugar do mundo - seu personal trainer vai com você, sempre.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fitpro-red/10">
                  <MessageCircle className="h-7 w-7 text-fitpro-red" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Suporte via WhatsApp
                </h3>
                <p className="text-gray-600">
                  Acesso direto ao seu personal a qualquer hora. Envie vídeos dos seus treinos, tire dúvidas na hora e receba correções personalizadas. É como ter um personal no seu bolso.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fitpro-red/10">
                  <Dumbbell className="h-7 w-7 text-fitpro-red" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Qualquer Equipamento
                </h3>
                <p className="text-gray-600">
                  Sem desculpas. Treine com o que você tem: academia completa, halteres em casa ou apenas peso corporal no hotel. Seu plano se adapta à sua realidade.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fitpro-red/10">
                  <Target className="h-7 w-7 text-fitpro-red" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Plano 100% Seu
                </h3>
                <p className="text-gray-600">
                  Cada corpo é único, seu treino também deve ser. Construímos seu plano considerando seus objetivos, rotina, equipamentos disponíveis e limitações. Zero genérico.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fitpro-red/10">
                  <Clock className="h-7 w-7 text-fitpro-red" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  App com Cronômetro
                </h3>
                <p className="text-gray-600">
                  Treinos guiados com precisão. Cronômetro inteligente controla execução e descanso automaticamente. Você só precisa focar nos exercícios e nos resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - 3 Tiers */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Investimento em consultoria profissional
              </h2>
              <p className="text-lg text-gray-600">
                Planos transparentes para sua transformação
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Trial Plan */}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Avaliação Gratuita</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                    <span className="text-gray-600">/7 dias</span>
                  </div>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Análise das Respostas do Formulário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Avaliação por fotos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Consulta via whatsapp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Primeiras Orientações Personalizadas</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/register">Avaliação Grátis</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Plan - Most Popular */}
              <Card className="relative border-2 border-fitpro-red shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-fitpro-red px-4 py-1 text-sm font-semibold text-white">
                    Mais Popular
                  </span>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Mensal</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">R$ 297,80</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Tudo do teste grátis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Acompanhamento contínuo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Ajustes no plano</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Suporte via WhatsApp</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-fitpro-red hover:bg-fitpro-red/90">
                    <Link to="/register">Começar Agora</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quarterly Plan */}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Trimestral</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">R$ 253,13</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <p className="mb-4 text-sm text-green-600 font-semibold">
                    Economize 15% • R$ 759,39 total
                  </p>
                  <ul className="mb-6 space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Tudo do plano mensal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">15% de desconto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">3 meses garantidos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-600">Melhor custo-benefício</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/register">Começar Agora</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Real Testimonials */}
      <section className="border-y border-gray-100 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wide text-gray-600">
              Alunos transformando seus corpos com consultoria profissional
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <Card className="border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-700">
                    "Morando em Londres, não encontrei uma academia com professores que falam português. Agora tenho meu tão sonhado "bumbum na nuca" e um personal trainer que me entende"
                  </p>
                  <p className="font-semibold text-gray-900">Sofia M.</p>
                  <p className="text-sm text-gray-600">Londres, Reino Unido</p>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-700">
                    "Trabalho muito e não tinha tempo de ir à academia. A consultoria online se encaixou perfeitamente. Treino em casa e tenho acompanhamento de um personal trainer de verdade"
                  </p>
                  <p className="font-semibold text-gray-900">Ricardo P.</p>
                  <p className="text-sm text-gray-600">São Paulo, Brasil</p>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-700">
                    "Finalmente encontrei um personal que realmente acompanha meu progresso. Não é app automático, é consultoria de verdade. Eu envio os vídeos e ele corrige minha postura"
                  </p>
                  <p className="font-semibold text-gray-900">Juliana S.</p>
                  <p className="text-sm text-gray-600">Miami, EUA</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Reduced */}
      <section id="faq" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Perguntas frequentes
            </h2>

            <div className="space-y-4">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-2 flex items-start gap-3 text-lg font-bold text-gray-900">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Como é o acompanhamento do personal?
                  </h3>
                  <p className="ml-8 text-gray-600">
                    Você tem contato direto via WhatsApp com seu personal trainer. Tire dúvidas, envie vídeos,
                    receba feedback. É consultoria real, não app automático.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-2 flex items-start gap-3 text-lg font-bold text-gray-900">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Funciona no Brasil e no exterior?
                  </h3>
                  <p className="ml-8 text-gray-600">
                    Sim! Nossa consultoria é 100% online. Funciona em qualquer lugar do mundo com internet.
                    Brasil, Europa, Estados Unidos, Ásia - onde você estiver.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-2 flex items-start gap-3 text-lg font-bold text-gray-900">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Preciso de equipamentos?
                  </h3>
                  <p className="ml-8 text-gray-600">
                    Não! Adaptamos o treino aos equipamentos que você tem. Pode ser só peso corporal,
                    halteres, elásticos, ou academia completa.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-2 flex items-start gap-3 text-lg font-bold text-gray-900">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-fitpro-red" />
                    Posso cancelar quando quiser?
                  </h3>
                  <p className="ml-8 text-gray-600">
                    Sim! Cancele a qualquer momento, sem multa ou burocracia. Seu acesso continua
                    até o fim do período pago.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Strong */}
      <section className="bg-fitpro-red py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Pronto para transformar seu corpo?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Junte-se a 500+ alunos com acompanhamento profissional
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white px-8 py-6 text-lg font-semibold text-fitpro-red shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
            >
              <Link to="/register">Faça uma Avaliação Agora Mesmo</Link>
            </Button>
            <p className="mt-4 text-sm opacity-75">
              Sem cartão de crédito • Cancele quando quiser • Brasil e exterior
            </p>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <img
                    src="/brand/logos/fitpro-logo-new.png"
                    alt="FitPro"
                    className="h-8 w-8"
                  />
                  <span className="text-lg font-bold">
                    <span className="text-gray-900">FIT</span>
                    <span className="text-fitpro-red">PRO</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Consultoria online com personal trainer profissional. Brasil e exterior.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-900">Produto</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#como-funciona" className="hover:text-gray-900">Como funciona</a></li>
                  <li><Link to="/register" className="hover:text-gray-900">Teste grátis</Link></li>
                  <li><Link to="/login" className="hover:text-gray-900">Entrar</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-900">Suporte</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#faq" className="hover:text-gray-900">FAQ</a></li>
                  <li><Link to="/contato" className="hover:text-gray-900">Contato</Link></li>
                  <li><Link to="/privacidade" className="hover:text-gray-900">Privacidade</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-900">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>CNPJ: XX.XXX.XXX/0001-XX</li>
                  <li className="text-xs">© 2026 FitPro</li>
                  <li className="text-xs">Consultoria profissional</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
