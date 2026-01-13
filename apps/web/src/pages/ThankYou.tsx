import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';

export default function ThankYou() {
  const navigate = useNavigate();
  const onboardingStatus = useOnboardingStatus();

  const handleWhatsAppClick = () => {
    const trainerNumber = '41222222222'; // Número do personal trainer

    // Build comprehensive report with user's onboarding data
    const profile = onboardingStatus.profile;

    if (!profile) {
      // Fallback message if profile data isn't loaded
      const message = encodeURIComponent('Olá! Acabei de completar meu cadastro no FitPro e gostaria de agendar minha consulta.');
      window.open(`https://wa.me/${trainerNumber}?text=${message}`, '_blank');
      return;
    }

    // Format goal
    const goalMap: Record<string, string> = {
      'lose_weight': 'Perder Peso',
      'gain_muscle': 'Ganhar Massa Muscular',
      'maintenance': 'Manutenção/Condicionamento'
    };

    // Format location
    const locationMap: Record<string, string> = {
      'home': 'Em Casa',
      'gym': 'Academia'
    };

    // Format experience level
    const experienceMap: Record<string, string> = {
      'beginner': 'Iniciante (<6 meses)',
      'intermediate': 'Intermediário (6-24 meses)',
      'advanced': 'Avançado (>2 anos)'
    };

    // Format gender
    const genderMap: Record<string, string> = {
      'male': 'Masculino',
      'female': 'Feminino',
      'other': 'Outro'
    };

    // Format equipment
    const equipmentMap: Record<string, string> = {
      'full_gym': 'Academia Completa',
      'bodyweight': 'Peso Corporal',
      'dumbbells': 'Halteres',
      'resistance_bands': 'Faixas Elasticas',
      'pull_up_bar': 'Barra Fixa',
      'bench': 'Banco',
      'barbell': 'Barra',
      'squat_rack': 'Rack de Agachamento',
      'cable_machine': 'Polia/Crossover',
      'leg_press_machine': 'Leg Press',
      'leg_extension_machine': 'Cadeira Extensora',
      'shoulder_press_machine': 'Maquina de Desenvolvimento',
    };

    // Build the message - Simple format without emojis
    let message = '*NOVO CADASTRO - FITPRO*\n\n';

    // Personal Info
    message += '*DADOS PESSOAIS*\n';
    if (profile.fullName) message += `Nome: ${profile.fullName}\n`;
    if (profile.whatsappNumber) message += `WhatsApp: ${profile.whatsappNumber}\n`;
    if (profile.age) message += `Idade: ${profile.age} anos\n`;
    if (profile.gender) message += `Genero: ${genderMap[profile.gender] || profile.gender}\n`;
    if (profile.currentWeightKg) message += `Peso: ${profile.currentWeightKg}kg\n`;
    if (profile.heightCm) message += `Altura: ${profile.heightCm}cm\n`;

    message += '\n';

    // Goal
    message += '*OBJETIVO*\n';
    if (profile.goal) message += `${goalMap[profile.goal] || profile.goal}\n`;
    if (profile.goalDescription) message += `Descricao: ${profile.goalDescription}\n`;

    message += '\n';

    // Training Preferences
    message += '*PREFERENCIAS DE TREINO*\n';
    if (profile.frequencyPerWeek) message += `Frequencia: ${profile.frequencyPerWeek}x por semana\n`;
    if (profile.location) message += `Local: ${locationMap[profile.location] || profile.location}\n`;
    if (profile.experienceLevel) message += `Nivel: ${experienceMap[profile.experienceLevel] || profile.experienceLevel}\n`;

    message += '\n';

    // Equipment
    if (profile.equipment && profile.equipment.length > 0) {
      message += '*EQUIPAMENTOS DISPONIVEIS*\n';
      const translatedEquipment = profile.equipment.map(eq => equipmentMap[eq] || eq);
      message += translatedEquipment.join(', ') + '\n';
      if (profile.otherEquipment) {
        message += `Outros: ${profile.otherEquipment}\n`;
      }
      message += '\n';
    }

    // Limitations
    if ((profile.limitations && profile.limitations.length > 0) || profile.limitationsDescription) {
      message += '*LIMITACOES FISICAS*\n';
      if (profile.limitations && profile.limitations.length > 0) {
        message += profile.limitations.join(', ') + '\n';
      }
      if (profile.limitationsDescription) {
        message += `Detalhes: ${profile.limitationsDescription}\n`;
      }
      message += '\n';
    }

    message += '================================\n';
    message += 'Gostaria de agendar minha consulta para criar meu plano personalizado!';

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${trainerNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Cadastro Completo!
          </CardTitle>
          <CardDescription className="text-lg">
            Obrigado por escolher nossa consultoria
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* WhatsApp Button - FIRST */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-gray-900 font-semibold">
                📱 Inicie sua consultoria agora!
              </p>
              <p className="text-gray-600 text-sm">
                Clique no botão verde e envie suas respostas para o seu personal trainer
              </p>
            </div>
            <Button
              onClick={handleWhatsAppClick}
              className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Enviar Respostas ao Personal Trainer pelo WhatsApp
            </Button>
          </div>

          {/* Próximos Passos - SECOND */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-blue-900 text-lg">
              📞 Próximos Passos da Consultoria:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Envie suas informações via WhatsApp (clique no botão acima)</li>
              <li>Seu personal trainer entrará em contato em até 24h</li>
              <li>Realizarão consulta para entender seus objetivos e rotina</li>
              <li>Receberá seu plano de treino 100% personalizado</li>
              <li>Acompanhamento contínuo via WhatsApp durante toda jornada</li>
            </ol>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/plano')}
            >
              Ver Meu Treino
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
