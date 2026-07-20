'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import type { OnboardingStep, OnboardingRestaurant } from '../types';

/* ─────────────────────────────────────────────────────── */

/**
 * Drives all state and side-effects for the onboarding wizard.
 *
 * Returns:
 *  - Current step + navigation helpers
 *  - Restaurant form state + updater
 *  - AI acceptance flag + setter
 *  - `handleFinish` — persists state and navigates to /dashboard
 */
export function useOnboarding() {
  const { restaurant, setRestaurant } = useStore(
    useShallow((state) => ({
      restaurant: state.restaurant,
      setRestaurant: state.setRestaurant,
    }))
  );
  const router = useRouter();

  const [step, setStep] = useState<OnboardingStep>(1);
  const [selectedType, setSelectedType] = useState<string>(restaurant.type || '');
  const [acceptAI, setAcceptAI] = useState<boolean>(true);
  const [localRest, setLocalRest] = useState<OnboardingRestaurant>(restaurant);

  /* ── Keyboard shortcut: Enter → advance ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (step === 1 && selectedType) setStep(2);
      else if (step === 2 && localRest.name.trim()) setStep(3);
      // step 3 is handled by the button inside StepAI
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, selectedType, localRest.name]);

  /* ── Navigation helpers ── */
  const goTo = (s: OnboardingStep) => setStep(s);
  const goNext = () => setStep((s) => Math.min(s + 1, 4) as OnboardingStep);
  const goBack = () => setStep((s) => Math.max(s - 1, 1) as OnboardingStep);

  /* ── Restaurant form updater ── */
  const updateRest = (partial: Partial<OnboardingRestaurant>) =>
    setLocalRest((prev) => ({ ...prev, ...partial }));

  /* ── Finish ── */
  const handleFinish = () => {
    setRestaurant({ ...localRest, type: selectedType });
    router.push('/dashboard');
  };

  return {
    step,
    goTo,
    goNext,
    goBack,
    selectedType,
    setSelectedType,
    acceptAI,
    setAcceptAI,
    localRest,
    updateRest,
    handleFinish,
  };
}
