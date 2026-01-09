import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  onboardingSchema,
  type OnboardingFormData,
} from '@/lib/validations/onboarding';
import { GoalSelector } from '@/components/onboarding/GoalSelector';
import { FrequencySelector } from '@/components/onboarding/FrequencySelector';
import { EquipmentSelector } from '@/components/onboarding/EquipmentSelector';
import { LimitationsSelector } from '@/components/onboarding/LimitationsSelector';

const steps = [
  { id: 1, title: 'Qual é seu objetivo?' },
  { id: 2, title: 'Com que frequência você treina?' },
  { id: 3, title: 'Quais equipamentos você tem?' },
  { id: 4, title: 'Alguma limitação física?' },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goal: undefined,
      frequencyPerWeek: 3,
      location: 'gym',
      experienceLevel: 'beginner',
      equipment: ['bodyweight'],
      limitations: [],
    },
  });

  const formValues = watch();

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

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
        throw new Error(errorData.error || 'Failed to save onboarding');
      }

      // Redirect to workout plan after successful onboarding
      navigate('/plano');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Erro ao salvar suas informações. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!formValues.goal;
    if (currentStep === 2)
      return !!formValues.frequencyPerWeek && !!formValues.location && !!formValues.experienceLevel;
    if (currentStep === 3) return formValues.equipment && formValues.equipment.length > 0;
    return true; // Step 4 is optional
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
              'Escolha seu objetivo principal para personalizarmos seu treino'}
            {currentStep === 2 && 'Defina quantas vezes por semana você pode treinar'}
            {currentStep === 3 &&
              'Selecione os equipamentos que você tem disponível'}
            {currentStep === 4 &&
              'Nos conte sobre lesões ou limitações para evitarmos exercícios inadequados'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Goal */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <GoalSelector
                  value={formValues.goal || ''}
                  onChange={(value) => setValue('goal', value)}
                />
                {errors.goal && (
                  <p className="text-sm text-destructive">{errors.goal.message}</p>
                )}
              </div>
            )}

            {/* Step 2: Frequency & Location */}
            {currentStep === 2 && (
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

            {/* Step 3: Equipment */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <EquipmentSelector
                  value={formValues.equipment || []}
                  onChange={(value) => setValue('equipment', value)}
                />
                {errors.equipment && (
                  <p className="text-sm text-destructive">
                    {errors.equipment.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 4: Limitations */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <LimitationsSelector
                  value={formValues.limitations || []}
                  onChange={(value) => setValue('limitations', value)}
                />
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
                  disabled={!canProceed()}
                >
                  Próximo
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
