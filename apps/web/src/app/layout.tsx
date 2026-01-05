import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FitPro - Treinos Personalizados com IA',
  description: 'Seu personal trainer virtual com inteligência artificial que cria treinos adaptados ao seu perfil e evolui com você',
  manifest: '/brand/icons/web-app-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FitPro',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#DC2626', // FitPro Red
  icons: {
    icon: '/brand/logos/fitpro-logo-original.png',
    apple: '/brand/logos/fitpro-logo-original.png',
  },
  openGraph: {
    title: 'FitPro - Treinos Personalizados com IA',
    description: 'Seu personal trainer virtual com IA',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={inter.className}>
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
