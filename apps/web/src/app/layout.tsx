import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fitness Pro - Seu Personal Trainer Digital',
  description: 'Personal trainer digital em português para brasileiros no exterior',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
