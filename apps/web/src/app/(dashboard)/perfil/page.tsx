'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PerfilPage() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações e preferências de treino</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="h-20 w-20 rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{user?.fullName || 'Usuário'}</p>
                <p className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-base">{user?.firstName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sobrenome</label>
                <p className="text-base">{user?.lastName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-base">{user?.primaryEmailAddress?.emailAddress || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Membro desde</label>
                <p className="text-base">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                    : '-'}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild variant="outline">
                <Link href="https://clerk.com/user">Editar informações da conta</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estatísticas Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Semana atual</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Treinos concluídos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa de conclusão</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
          </CardContent>
        </Card>

        {/* Workout Preferences Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preferências de Treino</CardTitle>
                <CardDescription>Configure seu plano personalizado</CardDescription>
              </div>
              <Button asChild>
                <Link href="/onboarding">Reconfigurar</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Objetivo:</span>
                <span className="font-medium">Não configurado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frequência:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Local:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nível:</span>
                <span className="font-medium">-</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-900">
                💡 Complete o onboarding para personalizar seu plano de treino
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/plano">Ver Plano de Treino</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/onboarding">Reconfigurar Preferências</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => {}}>
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Sobre o App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Versão:</span>
            <span className="font-medium">1.0.0 (MVP)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Última atualização:</span>
            <span className="font-medium">Janeiro 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Exercícios disponíveis:</span>
            <span className="font-medium">30+</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
