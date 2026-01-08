import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';

// Page imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import WorkoutPlan from './pages/WorkoutPlan';
import WorkoutDetail from './pages/WorkoutDetail';
import WorkoutFeedback from './pages/WorkoutFeedback';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import NotFound from './pages/NotFound';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login/*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <SignIn
                routing="path"
                path="/login"
                signUpUrl="/register"
                afterSignInUrl="/dashboard"
              />
            </div>
          }
        />
        <Route
          path="/register/*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <SignUp
                routing="path"
                path="/register"
                signInUrl="/login"
                afterSignUpUrl="/onboarding"
              />
            </div>
          }
        />

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/plano" element={<WorkoutPlan />} />
          <Route path="/treino/:id" element={<WorkoutDetail />} />
          <Route path="/treino/:id/feedback" element={<WorkoutFeedback />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/conquistas" element={<Achievements />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
