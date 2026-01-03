'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after 30 seconds or on second visit
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
          localStorage.setItem('pwa-install-prompt-seen', 'true');
        }, 30000); // 30 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted PWA install');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom">
      <Card className="border-blue-500 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Instalar Fitness Pro</CardTitle>
            <button
              onClick={handleDismiss}
              className="rounded-full p-1 hover:bg-gray-100"
              aria-label="Fechar"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <CardDescription>
            Instale o app para acesso rápido e offline aos seus treinos!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Acesso instantâneo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Funciona offline
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Notificações de treino
            </li>
          </ul>

          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1" size="sm">
              Instalar
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Agora não
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
