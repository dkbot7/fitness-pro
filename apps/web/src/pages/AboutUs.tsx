import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Trophy, Target, Heart } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Sobre a <span className="text-gray-900">FIT</span><span className="text-fitpro-red">PRO</span>
            </h1>
            <p className="text-xl text-gray-600">
              Consultoria online de personal training profissional para transformar seu corpo, onde quer que você esteja
            </p>
          </div>
        </div>
      </section>

      {/* O que é o FITPRO */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              O que é a <span className="text-gray-900">FIT</span><span className="text-fitpro-red">PRO</span>?
            </h2>

            <div className="space-y-6 text-lg text-gray-700">
              <p>
                A <strong>FITPRO</strong> é uma consultoria online de personal training que oferece acompanhamento profissional
                personalizado para pessoas que buscam transformar seus corpos e alcançar seus objetivos fitness,
                independentemente de onde estejam no mundo.
              </p>

              <p>
                Diferente de aplicativos automáticos com treinos prontos, na FITPRO você tem um personal trainer
                <strong> real e dedicado</strong> que cria seu plano de treino sob medida, acompanha sua evolução e
                ajusta sua programação mensalmente de acordo com seus resultados e feedback.
              </p>

              <p>
                Nossa missão é democratizar o acesso a consultoria profissional de qualidade, permitindo que você
                tenha os mesmos resultados de quem treina presencialmente com um personal trainer, mas com a
                flexibilidade de treinar quando e onde quiser.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fitpro-red/10">
                    <Target className="h-6 w-6 text-fitpro-red" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Personalizado</h3>
                  <p className="mt-2 text-sm text-gray-600">100% adaptado a você</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fitpro-red/10">
                    <Trophy className="h-6 w-6 text-fitpro-red" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Profissional</h3>
                  <p className="mt-2 text-sm text-gray-600">Acompanhamento expert</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fitpro-red/10">
                    <Award className="h-6 w-6 text-fitpro-red" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Flexível</h3>
                  <p className="mt-2 text-sm text-gray-600">Treine onde quiser</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fitpro-red/10">
                    <Heart className="h-6 w-6 text-fitpro-red" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Resultados</h3>
                  <p className="mt-2 text-sm text-gray-600">Transformação real</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Seu Personal Trainer */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Seu Personal Trainer
            </h2>

            <Card className="overflow-hidden border-gray-200">
              <CardContent className="p-0">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Foto do Personal - Placeholder */}
                  <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-8 md:p-12">
                    <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-white shadow-lg">
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-fitpro-red/10">
                          <Award className="h-12 w-12 text-fitpro-red" />
                        </div>
                        <p className="text-sm text-gray-500">Foto do Personal Trainer</p>
                        <p className="text-xs text-gray-400">(A ser adicionada)</p>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Personal */}
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      [Nome do Personal Trainer]
                    </h3>
                    <p className="mb-6 text-lg text-fitpro-red font-semibold">
                      Personal Trainer & Atleta de Fisiculturismo
                    </p>

                    <div className="space-y-4 text-gray-700">
                      <p>
                        [Descrição do personal trainer - experiência, filosofia de treino, especialidades, etc.]
                      </p>

                      <div className="pt-4">
                        <h4 className="mb-3 font-semibold text-gray-900">Títulos e Conquistas:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <Trophy className="mt-1 h-4 w-4 flex-shrink-0 text-fitpro-red" />
                            <span>[Título 1 - Ex: Campeão Regional de Fisiculturismo 2023]</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Trophy className="mt-1 h-4 w-4 flex-shrink-0 text-fitpro-red" />
                            <span>[Título 2 - Ex: 3º Lugar Nacional de Fisiculturismo 2022]</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Trophy className="mt-1 h-4 w-4 flex-shrink-0 text-fitpro-red" />
                            <span>[Título 3 - Ex: Certificação Internacional em Musculação]</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Award className="mt-1 h-4 w-4 flex-shrink-0 text-fitpro-red" />
                            <span>CREF: [Número a confirmar]</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-fitpro-red py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Pronto para começar sua transformação?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Faça sua avaliação gratuita e descubra como podemos te ajudar
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white px-8 py-6 text-lg font-semibold text-fitpro-red shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
            >
              <Link to="/register">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
