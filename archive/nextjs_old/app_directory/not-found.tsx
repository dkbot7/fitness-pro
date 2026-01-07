import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-6xl font-bold text-gray-300">404</div>
          <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          <CardDescription>
            A página que você está procurando não existe ou foi movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-7xl">🏋️</div>

          <p className="text-sm text-gray-600">
            Parece que você se perdeu durante o treino!
          </p>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">Voltar à página inicial</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/plano">Ver meu plano de treino</Link>
            </Button>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">Links úteis:</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/onboarding" className="hover:text-blue-600">
                  Configurar preferências
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="hover:text-blue-600">
                  Ver perfil
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600">
                  Fazer login
                </Link>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
