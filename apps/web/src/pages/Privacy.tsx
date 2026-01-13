import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, UserCheck, Database, Mail, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fitpro-red/10">
              <Shield className="h-8 w-8 text-fitpro-red" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-fitpro-charcoal sm:text-4xl">
              Política de Privacidade
            </h1>
            <p className="text-sm text-gray-600">
              Última atualização: 12 de janeiro de 2026
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="py-6">
              <p className="leading-relaxed text-gray-700">
                No FitPro, levamos sua privacidade a sério. Esta política descreve como coletamos,
                usamos e protegemos suas informações pessoais quando você usa nosso serviço.
              </p>
            </CardContent>
          </Card>

          {/* Key Points */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <Lock className="mx-auto mb-3 h-10 w-10 text-green-600" />
                <h3 className="mb-2 font-semibold">Dados Seguros</h3>
                <p className="text-sm text-gray-600">
                  Criptografia em todas as transmissões
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Eye className="mx-auto mb-3 h-10 w-10 text-blue-600" />
                <h3 className="mb-2 font-semibold">Transparência</h3>
                <p className="text-sm text-gray-600">
                  Você sabe exatamente o que coletamos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <UserCheck className="mx-auto mb-3 h-10 w-10 text-purple-600" />
                <h3 className="mb-2 font-semibold">Seu Controle</h3>
                <p className="text-sm text-gray-600">
                  Você decide sobre seus dados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6">
            {/* Section 1 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <Database className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    1. Informações que Coletamos
                  </h2>
                </div>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Informações de Cadastro:</h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm">
                      <li>Nome completo</li>
                      <li>Email (fornecido via Clerk Authentication)</li>
                      <li>Número do WhatsApp</li>
                      <li>Dados físicos: idade, peso, altura, gênero (opcional)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Informações de Treino:</h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm">
                      <li>Objetivo de fitness (perder peso, ganhar massa, manutenção)</li>
                      <li>Frequência de treino preferida</li>
                      <li>Local de treino (casa ou academia)</li>
                      <li>Equipamentos disponíveis</li>
                      <li>Limitações físicas ou lesões</li>
                      <li>Histórico e feedback de treinos completados</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Informações Técnicas:</h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm">
                      <li>Endereço IP</li>
                      <li>Tipo de navegador e dispositivo</li>
                      <li>Páginas visitadas e tempo de uso</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <UserCheck className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    2. Como Usamos Suas Informações
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>Usamos suas informações para:</p>
                  <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>
                      <strong>Criar seu plano de treino personalizado:</strong> Seus dados físicos e objetivos
                      são usados para gerar treinos adequados ao seu nível e equipamentos.
                    </li>
                    <li>
                      <strong>Acompanhar seu progresso:</strong> Registramos treinos completados
                      e feedback para ajustar seu plano.
                    </li>
                    <li>
                      <strong>Comunicação:</strong> Enviamos notificações importantes sobre seu plano
                      e novidades do FitPro (você pode desativar a qualquer momento).
                    </li>
                    <li>
                      <strong>Suporte ao cliente:</strong> Usamos seu email e WhatsApp para responder
                      dúvidas e fornecer assistência.
                    </li>
                    <li>
                      <strong>Melhorar o serviço:</strong> Analisamos dados agregados e anônimos
                      para melhorar nossos algoritmos e experiência.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <Lock className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    3. Proteção de Dados
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>Implementamos medidas de segurança robustas:</p>
                  <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>
                      <strong>Criptografia SSL/TLS:</strong> Todas as comunicações entre você
                      e nossos servidores são criptografadas.
                    </li>
                    <li>
                      <strong>Autenticação segura:</strong> Usamos Clerk, um provedor líder
                      de autenticação com padrões de segurança de nível empresarial.
                    </li>
                    <li>
                      <strong>Infraestrutura Cloudflare:</strong> Seus dados são armazenados
                      em servidores seguros da Cloudflare com proteção DDoS e redundância.
                    </li>
                    <li>
                      <strong>Acesso limitado:</strong> Apenas membros autorizados da equipe
                      FitPro têm acesso aos dados, apenas quando necessário para suporte.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <Eye className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    4. Compartilhamento de Dados
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p className="font-semibold">
                    Nós NÃO vendemos seus dados pessoais. Nunca.
                  </p>
                  <p>Compartilhamos dados apenas nas seguintes situações:</p>
                  <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>
                      <strong>Provedores de serviço essenciais:</strong>
                      <ul className="list-circle ml-6 mt-1 space-y-1">
                        <li>Clerk (autenticação e gerenciamento de usuários)</li>
                        <li>Cloudflare (hospedagem e banco de dados)</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Obrigações legais:</strong> Quando exigido por lei, ordem judicial
                      ou autoridade governamental.
                    </li>
                    <li>
                      <strong>Proteção de direitos:</strong> Para proteger os direitos, propriedade
                      ou segurança do FitPro, nossos usuários ou o público.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <UserCheck className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    5. Seus Direitos
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>Você tem total controle sobre seus dados:</p>
                  <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>
                      <strong>Acessar:</strong> Solicite uma cópia de todos os dados que temos sobre você.
                    </li>
                    <li>
                      <strong>Corrigir:</strong> Atualize informações incorretas ou desatualizadas a qualquer momento.
                    </li>
                    <li>
                      <strong>Excluir:</strong> Solicite a exclusão completa da sua conta e dados associados.
                    </li>
                    <li>
                      <strong>Exportar:</strong> Baixe seus dados em formato legível.
                    </li>
                    <li>
                      <strong>Revogar consentimento:</strong> Cancele permissões específicas a qualquer momento.
                    </li>
                  </ul>
                  <p className="mt-4">
                    Para exercer qualquer destes direitos, entre em contato conosco através do email{' '}
                    <a href="mailto:contato@fitpro.vip" className="font-semibold text-fitpro-red hover:underline">
                      contato@fitpro.vip
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <Database className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    6. Retenção de Dados
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Mantemos seus dados apenas enquanto você for um usuário ativo ou conforme
                    necessário para cumprir obrigações legais.
                  </p>
                  <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>
                      <strong>Conta ativa:</strong> Dados mantidos enquanto você usar o FitPro.
                    </li>
                    <li>
                      <strong>Após cancelamento:</strong> Dados excluídos automaticamente após 90 dias
                      de inatividade, a menos que solicitado antes.
                    </li>
                    <li>
                      <strong>Dados financeiros:</strong> Mantidos por até 5 anos conforme exigido
                      pela legislação fiscal brasileira.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    7. Cookies e Tecnologias Similares
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>Usamos cookies e tecnologias similares para:</p>
                  <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>Manter você conectado à sua conta</li>
                    <li>Lembrar suas preferências</li>
                    <li>Entender como você usa o FitPro</li>
                    <li>Melhorar a performance do site</li>
                  </ul>
                  <p className="mt-4">
                    Você pode controlar cookies através das configurações do seu navegador.
                    Note que desabilitar cookies pode afetar algumas funcionalidades.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="shadow-md">
              <CardContent className="py-6">
                <div className="mb-4 flex items-center gap-3">
                  <Mail className="h-8 w-8 text-fitpro-red" />
                  <h2 className="text-xl font-bold text-fitpro-charcoal">
                    8. Alterações nesta Política
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Podemos atualizar esta política de privacidade periodicamente.
                    Notificaremos você sobre mudanças significativas através de:
                  </p>
                  <ul className="list-disc space-y-2 pl-6 text-sm">
                    <li>Email para o endereço cadastrado</li>
                    <li>Aviso no aplicativo</li>
                    <li>Atualização da data "Última atualização" no topo desta página</li>
                  </ul>
                  <p className="mt-4">
                    Recomendamos que você revise esta política periodicamente para se manter informado
                    sobre como protegemos seus dados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <Card className="mt-8 border-2 border-fitpro-red bg-fitpro-red/5 shadow-lg">
            <CardContent className="py-6 text-center">
              <Mail className="mx-auto mb-3 h-10 w-10 text-fitpro-red" />
              <h2 className="mb-2 text-xl font-bold text-fitpro-charcoal">
                Dúvidas sobre Privacidade?
              </h2>
              <p className="mb-6 text-gray-700">
                Se você tiver qualquer dúvida sobre esta política ou sobre como tratamos seus dados,
                estamos aqui para ajudar.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">
                  Email:{' '}
                  <a href="mailto:contato@fitpro.vip" className="text-fitpro-red hover:underline">
                    contato@fitpro.vip
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  Ou visite nossa <Link to="/contato" className="font-semibold text-fitpro-red hover:underline">página de contato</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
