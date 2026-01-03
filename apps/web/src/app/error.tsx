'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-red-600">Ops! Algo deu errado</CardTitle>
          <CardDescription>
            Encontramos um erro inesperado. Não se preocupe, seus dados estão seguros.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">
              <strong>Erro:</strong> {error.message || 'Erro desconhecido'}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-red-600">
                ID do erro: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              Tentar novamente
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = '/')}
            >
              Voltar à página inicial
            </Button>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-900">
              💡 Se o problema persistir, tente:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-blue-800">
              <li>Recarregar a página (F5)</li>
              <li>Limpar o cache do navegador</li>
              <li>Fazer logout e login novamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
