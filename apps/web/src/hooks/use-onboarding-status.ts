import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

export interface OnboardingProfile {
  fullName: string | null;
  whatsappNumber: string;
  currentWeightKg: number | null;
  heightCm: number | null;
  age: number | null;
  gender: string | null;
  goal: string | null;
  goalDescription: string | null;
  frequencyPerWeek: number | null;
  location: string | null;
  experienceLevel: string | null;
  equipment: string[] | null;
  otherEquipment: string | null;
  limitations: string[] | null;
  limitationsDescription: string | null;
  onboardingCompletedAt: string | null;
}

export interface OnboardingStatus {
  isLoading: boolean;
  isCompleted: boolean;
  profile: OnboardingProfile | null;
  lastCompletedStep: number; // 0 = no steps, 1-4 = completed steps
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useOnboardingStatus(): OnboardingStatus {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<OnboardingStatus>({
    isLoading: true,
    isCompleted: false,
    profile: null,
    lastCompletedStep: 0,
    error: null,
    refetch: async () => {},
  });

  const fetchStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, isLoading: true, error: null }));

      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.fitpro.vip';
      const response = await fetch(`${apiUrl}/api/onboarding/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If 404, user hasn't started onboarding yet
        if (response.status === 404) {
          setStatus({
            isLoading: false,
            isCompleted: false,
            profile: null,
            lastCompletedStep: 0,
            error: null,
            refetch: fetchStatus,
          });
          return;
        }
        throw new Error('Failed to fetch onboarding status');
      }

      const data = await response.json();
      const profile = data.profile as OnboardingProfile;

      // Determine last completed step
      let lastCompletedStep = 0;

      // Step 1: Personal info (all required fields)
      if (
        profile.fullName &&
        profile.whatsappNumber &&
        profile.currentWeightKg &&
        profile.heightCm &&
        profile.age &&
        profile.gender
      ) {
        lastCompletedStep = 1;
      }

      // Step 2: Goal
      if (lastCompletedStep >= 1 && profile.goal) {
        lastCompletedStep = 2;
      }

      // Step 3: Frequency, location, experience
      if (
        lastCompletedStep >= 2 &&
        profile.frequencyPerWeek &&
        profile.location &&
        profile.experienceLevel
      ) {
        lastCompletedStep = 3;
      }

      // Step 4: Equipment (final step before completion)
      if (
        lastCompletedStep >= 3 &&
        profile.equipment &&
        profile.equipment.length > 0
      ) {
        lastCompletedStep = 4;
      }

      setStatus({
        isLoading: false,
        isCompleted: !!profile.onboardingCompletedAt,
        profile,
        lastCompletedStep,
        error: null,
        refetch: fetchStatus,
      });
    } catch (error) {
      setStatus({
        isLoading: false,
        isCompleted: false,
        profile: null,
        lastCompletedStep: 0,
        error: error instanceof Error ? error : new Error('Unknown error'),
        refetch: fetchStatus,
      });
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return status;
}
