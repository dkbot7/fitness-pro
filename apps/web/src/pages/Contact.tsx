import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, MapPin, Clock, ArrowLeft } from 'lucide-react';

export default function Contact() {
  const handleWhatsAppClick = () => {
    const trainerNumber = '41222222222';
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre o FitPro.');
    window.open(`https://wa.me/${trainerNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/brand/logos/fitpro-logo-new.png"
              alt="FitPro"
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
            <span className="text-2xl font-bold text-fitpro-charcoal">FitPro</span>
          </Link>
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-fitpro-charcoal sm:text-4xl">
              Fale com Nossa Equipe
            </h1>
            <p className="text-lg text-gray-600">
              Suporte profissional para sua consultoria online
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Form Alternative - WhatsApp Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  WhatsApp
                </CardTitle>
                <CardDescription>
                  Fale conosco diretamente pelo WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  A forma mais rápida de nos contatar é através do WhatsApp.
                  Nossa equipe de personal trainers está pronta para responder dúvidas sobre
                  consultoria, planos personalizados e acompanhamento.
                </p>
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Enviar Mensagem no WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-fitpro-red" />
                  Email
                </CardTitle>
                <CardDescription>
                  Prefere escrever um email?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Você também pode nos enviar um email. Respondemos em até 24 horas
                  durante dias úteis.
                </p>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600 mb-1">Email de Suporte:</p>
                  <a
                    href="mailto:contato@fitpro.vip"
                    className="text-lg font-semibold text-fitpro-red hover:underline"
                  >
                    contato@fitpro.vip
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info Cards */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="mx-auto mb-3 h-10 w-10 text-fitpro-red" />
                <h3 className="mb-2 font-semibold text-gray-900">Horário de Atendimento</h3>
                <p className="text-sm text-gray-600">
                  Segunda a Sexta<br />
                  9h às 18h (Horário de Brasília)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="mx-auto mb-3 h-10 w-10 text-fitpro-red" />
                <h3 className="mb-2 font-semibold text-gray-900">Localização</h3>
                <p className="text-sm text-gray-600">
                  Consultoria 100% online<br />
                  Brasil e exterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <MessageCircle className="mx-auto mb-3 h-10 w-10 text-fitpro-red" />
                <h3 className="mb-2 font-semibold text-gray-900">Resposta Rápida</h3>
                <p className="text-sm text-gray-600">
                  WhatsApp: resposta imediata<br />
                  Email: até 24h úteis
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Quick Link */}
          <div className="mt-8">
            <Card className="bg-fitpro-red text-white">
              <CardContent className="py-6 text-center">
                <h3 className="mb-2 text-xl font-bold">
                  Procurando respostas rápidas?
                </h3>
                <p className="mb-4 opacity-90">
                  Confira nossa seção de perguntas frequentes
                </p>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="bg-white text-fitpro-red hover:bg-gray-100"
                >
                  <Link to="/#faq">Ver Perguntas Frequentes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
