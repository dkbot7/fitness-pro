'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FeedbackPageProps {
  params: {
    id: string;
  };
}

type DifficultyRating = 'easy' | 'ok' | 'hard';

export default function FeedbackPage({ params }: FeedbackPageProps) {
  const router = useRouter();
  const workoutId = parseInt(params.id, 10);

  const [selectedRating, setSelectedRating] = useState<DifficultyRating | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const difficultyOptions = [
    {
      value: 'easy' as DifficultyRating,
      label: 'Fácil',
      emoji: '😊',
      description: 'Poderia ter feito mais séries ou usado mais peso',
      color: 'green',
      bgColor: 'bg-green-50 hover:bg-green-100 border-green-300',
      selectedColor: 'bg-green-500 border-green-600 text-white',
    },
    {
      value: 'ok' as DifficultyRating,
      label: 'Ok',
      emoji: '💪',
      description: 'Desafiador mas consegui completar bem',
      color: 'blue',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-300',
      selectedColor: 'bg-blue-500 border-blue-600 text-white',
    },
    {
      value: 'hard' as DifficultyRating,
      label: 'Difícil',
      emoji: '😰',
      description: 'Muito desafiador, tive dificuldade para completar',
      color: 'red',
      bgColor: 'bg-red-50 hover:bg-red-100 border-red-300',
      selectedColor: 'bg-red-500 border-red-600 text-white',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRating) {
      setError('Por favor, selecione como foi o treino');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutId,
          difficultyRating: selectedRating,
          durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar feedback');
      }

      // Success - redirect to plan
      router.push('/plano');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar feedback');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/treino/${workoutId}`}
          className="mb-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Voltar ao treino
        </Link>
        <h1 className="text-3xl font-bold">Como foi o treino?</h1>
        <p className="text-gray-600">
          Seu feedback nos ajuda a ajustar seu plano para a próxima semana
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Difficulty Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Qual foi a dificuldade do treino? *</CardTitle>
            <CardDescription>
              Seja honesto! Usaremos essa informação para ajustar a intensidade na próxima semana.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedRating(option.value)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  selectedRating === option.value ? option.selectedColor : option.bgColor
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{option.label}</p>
                    <p
                      className={`text-sm ${
                        selectedRating === option.value ? 'text-white/90' : 'text-gray-600'
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                  {selectedRating === option.value && (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Duration */}
        <Card>
          <CardHeader>
            <CardTitle>Quanto tempo durou o treino?</CardTitle>
            <CardDescription>Opcional - nos ajuda a estimar melhor seus treinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="300"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="Ex: 45"
                className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-600">minutos</span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Observações adicionais</CardTitle>
            <CardDescription>
              Opcional - compartilhe como se sentiu, dificuldades, etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Senti dificuldade no agachamento, mas o resto foi tranquilo..."
              rows={4}
              maxLength={500}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">{notes.length}/500 caracteres</p>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!selectedRating || isSubmitting}
            size="lg"
            className="flex-1"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/plano">Pular</Link>
          </Button>
        </div>

        {/* Info Box */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Como usamos seu feedback?</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>
                • <strong>Fácil demais:</strong> Aumentamos a carga na próxima semana (+10%)
              </li>
              <li>
                • <strong>Ok:</strong> Mantemos a progressão natural do plano
              </li>
              <li>
                • <strong>Muito difícil:</strong> Reduzimos a carga para recuperação (-10%)
              </li>
            </ul>
            <p className="mt-2 text-xs text-blue-700">
              * Ajustes são feitos automaticamente toda segunda-feira com base no feedback da semana
              anterior
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
