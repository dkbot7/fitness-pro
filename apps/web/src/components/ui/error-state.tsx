import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  title = 'Erro ao carregar',
  message = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.',
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-900">{title}</CardTitle>
        </div>
        <CardDescription className="text-red-700">{message}</CardDescription>
      </CardHeader>
      {showRetry && onRetry && (
        <CardContent>
          <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
