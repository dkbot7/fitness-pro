import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';
import {
  onboardingSchema,
  type OnboardingFormData,
} from '@/lib/validations/onboarding';
import { GoalSelector } from '@/components/onboarding/GoalSelector';
import { FrequencySelector } from '@/components/onboarding/FrequencySelector';
import { EquipmentSelector } from '@/components/onboarding/EquipmentSelector';
import { LimitationsSelector } from '@/components/onboarding/LimitationsSelector';

const steps = [
  { id: 1, title: 'Informações Pessoais' },
  { id: 2, title: 'Qual é seu objetivo?' },
  { id: 3, title: 'Com que frequência você treina?' },
  { id: 4, title: 'Equipamentos e limitações' },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const onboardingStatus = useOnboardingStatus();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: '',
      goal: undefined,
      goalDescription: '',
      frequencyPerWeek: 3,
      location: 'gym',
      experienceLevel: 'beginner',
      equipment: ['bodyweight'],
      otherEquipment: '',
      limitations: [],
      limitationsDescription: '',
      whatsappNumber: '',
    },
  });

  const formValues = watch();

  // Load saved data and detect last completed step
  useEffect(() => {
    if (!onboardingStatus.isLoading && onboardingStatus.profile) {
      const profile = onboardingStatus.profile;

      // Populate form with saved data
      if (profile.fullName) setValue('fullName', profile.fullName);
      if (profile.whatsappNumber) setValue('whatsappNumber', profile.whatsappNumber);
      if (profile.currentWeightKg) setValue('currentWeightKg', profile.currentWeightKg);
      if (profile.heightCm) setValue('heightCm', profile.heightCm);
      if (profile.age) setValue('age', profile.age);
      if (profile.gender) setValue('gender', profile.gender as any);
      if (profile.goal) setValue('goal', profile.goal as any);
      if (profile.goalDescription) setValue('goalDescription', profile.goalDescription);
      if (profile.frequencyPerWeek) setValue('frequencyPerWeek', profile.frequencyPerWeek);
      if (profile.location) setValue('location', profile.location as any);
      if (profile.experienceLevel) setValue('experienceLevel', profile.experienceLevel as any);
      if (profile.equipment) setValue('equipment', profile.equipment);
      if (profile.otherEquipment) setValue('otherEquipment', profile.otherEquipment);
      if (profile.limitations) setValue('limitations', profile.limitations);
      if (profile.limitationsDescription) setValue('limitationsDescription', profile.limitationsDescription);

      // Set current step to next incomplete step
      // lastCompletedStep: 0 = start at 1, 1 = start at 2, etc.
      const nextStep = Math.min(onboardingStatus.lastCompletedStep + 1, steps.length);
      setCurrentStep(nextStep);

      setIsLoadingData(false);
    } else if (!onboardingStatus.isLoading) {
      // No saved data, start fresh
      setIsLoadingData(false);
    }
  }, [onboardingStatus.isLoading, onboardingStatus.profile]);

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      // First, save Step 4 data (equipment and limitations)
      const step4Saved = await saveStep4Data();
      if (!step4Saved) {
        setIsSubmitting(false);
        return;
      }

      const token = await getToken();
      if (!token) {
        toast({
          title: 'Erro de autenticação',
          description: 'Você precisa estar logado para completar o onboarding.',
          variant: 'destructive',
        });
        return;
      }

      // Then mark onboarding as complete
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';
      const response = await fetch(`${apiUrl}/api/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);

        toast({
          title: 'Erro ao salvar',
          description: errorData.error || 'Não foi possível salvar suas informações. Tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      // Success! Show success message
      const result = await response.json();
      toast({
        title: 'Cadastro completo!',
        description: result.message || 'O personal trainer entrará em contato via WhatsApp para criar seu plano personalizado.',
      });

      // Redirect to thank you page after successful onboarding
      navigate('/obrigado');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Erro inesperado',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      // All fields are required in Step 1
      return (
        formValues.fullName &&
        formValues.fullName.length >= 3 &&
        formValues.whatsappNumber &&
        formValues.whatsappNumber.length >= 10 &&
        formValues.currentWeightKg &&
        formValues.currentWeightKg > 0 &&
        formValues.heightCm &&
        formValues.heightCm > 0 &&
        formValues.age &&
        formValues.age > 0 &&
        formValues.gender &&
        formValues.gender !== ''
      );
    }
    if (currentStep === 2) return !!formValues.goal;
    if (currentStep === 3)
      return !!formValues.frequencyPerWeek && !!formValues.location && !!formValues.experienceLevel;
    if (currentStep === 4) return formValues.equipment && formValues.equipment.length > 0;
    return true;
  };

  const saveGoalData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: 'Erro de autenticação',
          description: 'Você precisa estar logado.',
          variant: 'destructive',
        });
        return false;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';
      const response = await fetch(`${apiUrl}/api/onboarding/step2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          goal: formValues.goal,
          goalDescription: formValues.goalDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Erro ao salvar',
          description: errorData.error || 'Não foi possível salvar suas informações.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving goal data:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao salvar suas informações.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const saveStep3Data = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: 'Erro de autenticação',
          description: 'Você precisa estar logado.',
          variant: 'destructive',
        });
        return false;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';
      const response = await fetch(`${apiUrl}/api/onboarding/step3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          frequencyPerWeek: formValues.frequencyPerWeek,
          location: formValues.location,
          experienceLevel: formValues.experienceLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Erro ao salvar',
          description: errorData.error || 'Não foi possível salvar suas informações.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving step3 data:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao salvar suas informações.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const saveStep4Data = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: 'Erro de autenticação',
          description: 'Você precisa estar logado.',
          variant: 'destructive',
        });
        return false;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';
      const response = await fetch(`${apiUrl}/api/onboarding/step4`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipment: formValues.equipment,
          otherEquipment: formValues.otherEquipment,
          limitations: formValues.limitations,
          limitationsDescription: formValues.limitationsDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Erro ao salvar',
          description: errorData.error || 'Não foi possível salvar suas informações.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving step4 data:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao salvar suas informações.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const saveInitialData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: 'Erro de autenticação',
          description: 'Você precisa estar logado.',
          variant: 'destructive',
        });
        return false;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';
      const response = await fetch(`${apiUrl}/api/onboarding/initial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formValues.fullName,
          whatsappNumber: formValues.whatsappNumber,
          currentWeightKg: formValues.currentWeightKg,
          heightCm: formValues.heightCm,
          age: formValues.age,
          gender: formValues.gender,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Erro ao salvar',
          description: errorData.error || 'Não foi possível salvar suas informações.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving initial data:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao salvar suas informações.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleNext = async () => {
    // Save initial data after step 1
    if (currentStep === 1) {
      setIsSubmitting(true);
      const saved = await saveInitialData();
      setIsSubmitting(false);
      if (!saved) return; // Don't proceed if save failed
    }

    // Save goal data after step 2
    if (currentStep === 2) {
      setIsSubmitting(true);
      const saved = await saveGoalData();
      setIsSubmitting(false);
      if (!saved) return; // Don't proceed if save failed
    }

    // Save step3 data after step 3
    if (currentStep === 3) {
      setIsSubmitting(true);
      const saved = await saveStep3Data();
      setIsSubmitting(false);
      if (!saved) return; // Don't proceed if save failed
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Show loading while fetching saved data
  if (isLoadingData || onboardingStatus.isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando seus dados...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
                step.id <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Passo {currentStep} de {steps.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 &&
              'Informe seus dados para contato e informações básicas'}
            {currentStep === 2 &&
              'Escolha seu objetivo principal para personalizarmos seu treino'}
            {currentStep === 3 && 'Defina quantas vezes por semana você pode treinar'}
            {currentStep === 4 &&
              'Selecione os equipamentos disponíveis e nos conte sobre limitações físicas'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Info & WhatsApp */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Full Name Field (Required) */}
                <div className="space-y-2 pb-6 border-b">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">
                    Nome Completo *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formValues.fullName || ''}
                    onChange={(e) => setValue('fullName', e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    maxLength={100}
                  />
                  {formValues.fullName && formValues.fullName.length < 3 && (
                    <p className="text-xs text-red-600">
                      Nome muito curto. Digite seu nome completo (mínimo 3 caracteres)
                    </p>
                  )}
                  {errors.fullName && (
                    <p className="text-xs text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* WhatsApp Field (Required) */}
                <div className="space-y-2 pb-6 border-b">
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-900">
                    WhatsApp para Contato *
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    O personal trainer entrará em contato por este número
                  </p>
                  <input
                    id="whatsappNumber"
                    type="tel"
                    value={formValues.whatsappNumber || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                      setValue('whatsappNumber', value);
                    }}
                    placeholder="41999999999"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    maxLength={15}
                  />
                  {formValues.whatsappNumber && formValues.whatsappNumber.length < 10 && (
                    <p className="text-xs text-red-600">
                      Número muito curto. Digite com DDD (mínimo 10 dígitos)
                    </p>
                  )}
                  {errors.whatsappNumber && (
                    <p className="text-xs text-red-600">
                      {errors.whatsappNumber.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Use apenas números, com DDD. Exemplo: 41999999999
                  </p>
                </div>

                {/* Optional Info */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700">
                    Informações pessoais (obrigatório)
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="currentWeightKg" className="block text-sm font-medium mb-2">
                        Peso (kg) *
                      </label>
                      <input
                        id="currentWeightKg"
                        type="number"
                        value={formValues.currentWeightKg || ''}
                        onChange={(e) => setValue('currentWeightKg', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="70"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="heightCm" className="block text-sm font-medium mb-2">
                        Altura (cm) *
                      </label>
                      <input
                        id="heightCm"
                        type="number"
                        value={formValues.heightCm || ''}
                        onChange={(e) => setValue('heightCm', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="170"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium mb-2">
                        Idade *
                      </label>
                      <input
                        id="age"
                        type="number"
                        value={formValues.age || ''}
                        onChange={(e) => setValue('age', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="25"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium mb-2">
                        Gênero *
                      </label>
                      <select
                        id="gender"
                        value={formValues.gender || ''}
                        onChange={(e) => setValue('gender', e.target.value as any)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goal */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <GoalSelector
                    value={formValues.goal || ''}
                    onChange={(value) => setValue('goal', value)}
                  />
                  {errors.goal && (
                    <p className="text-sm text-destructive">{errors.goal.message}</p>
                  )}
                </div>

                {/* Goal Description */}
                <div className="space-y-2">
                  <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700">
                    Descreva seus objetivos (opcional)
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    Conte-nos mais sobre o que você quer alcançar, suas motivações, metas específicas, etc.
                  </p>
                  <textarea
                    id="goalDescription"
                    value={formValues.goalDescription || ''}
                    onChange={(e) => setValue('goalDescription', e.target.value)}
                    placeholder="Exemplo: Quero perder 10kg nos próximos 3 meses para melhorar minha saúde e disposição no dia a dia..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] resize-y"
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500">
                    {(formValues.goalDescription?.length || 0)}/1000 caracteres
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Frequency & Location */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Frequência de treino
                  </label>
                  <FrequencySelector
                    value={formValues.frequencyPerWeek}
                    onChange={(value) => setValue('frequencyPerWeek', value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Onde você treina?
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card
                      className={`cursor-pointer transition-all hover:border-primary ${
                        formValues.location === 'home' && 'border-primary bg-primary/5'
                      }`}
                      onClick={() => setValue('location', 'home')}
                    >
                      <CardContent className="p-4 text-center">
                        <span className="font-medium">🏠 Em Casa</span>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all hover:border-primary ${
                        formValues.location === 'gym' && 'border-primary bg-primary/5'
                      }`}
                      onClick={() => setValue('location', 'gym')}
                    >
                      <CardContent className="p-4 text-center">
                        <span className="font-medium">🏋️ Academia</span>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Nível de experiência
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Card
                      className={`cursor-pointer transition-all hover:border-primary ${
                        formValues.experienceLevel === 'beginner' &&
                        'border-primary bg-primary/5'
                      }`}
                      onClick={() => setValue('experienceLevel', 'beginner')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="font-medium">Iniciante</div>
                        <div className="text-xs text-muted-foreground">
                          &lt;6 meses
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all hover:border-primary ${
                        formValues.experienceLevel === 'intermediate' &&
                        'border-primary bg-primary/5'
                      }`}
                      onClick={() => setValue('experienceLevel', 'intermediate')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="font-medium">Intermediário</div>
                        <div className="text-xs text-muted-foreground">
                          6-24 meses
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all hover:border-primary ${
                        formValues.experienceLevel === 'advanced' &&
                        'border-primary bg-primary/5'
                      }`}
                      onClick={() => setValue('experienceLevel', 'advanced')}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="font-medium">Avançado</div>
                        <div className="text-xs text-muted-foreground">
                          &gt;2 anos
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Equipment & Limitations */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <EquipmentSelector
                    value={formValues.equipment || []}
                    onChange={(value) => setValue('equipment', value)}
                    otherEquipment={formValues.otherEquipment}
                    onOtherEquipmentChange={(value) => setValue('otherEquipment', value)}
                  />
                  {errors.equipment && (
                    <p className="text-sm text-destructive">
                      {errors.equipment.message}
                    </p>
                  )}
                </div>

                <div>
                  <LimitationsSelector
                    value={formValues.limitations || []}
                    onChange={(value) => setValue('limitations', value)}
                    limitationsDescription={formValues.limitationsDescription}
                    onDescriptionChange={(value) => setValue('limitationsDescription', value)}
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Voltar
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                >
                  {isSubmitting && (currentStep === 1 || currentStep === 2 || currentStep === 3) ? 'Salvando...' : 'Próximo'}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting || !canProceed()}>
                  {isSubmitting ? 'Salvando...' : 'Finalizar'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
