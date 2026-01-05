import { Outlet, Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Fitness Pro
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/plano"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Meu Plano
                </Link>
                <Link
                  to="/onboarding"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Configurar
                </Link>
                <Link
                  to="/perfil"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Perfil
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
