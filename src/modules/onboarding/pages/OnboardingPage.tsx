'use client';

import { AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../hooks/useOnboarding';
import { ProgressBar } from '../components/ProgressBar';
import { OnboardingBackground } from '../components/OnboardingBackground';
import { StepType } from '../components/StepType';
import { StepInfo } from '../components/StepInfo';
import { StepAI } from '../components/StepAI';
import { StepSuccess } from '../components/StepSuccess';

/**
 * Onboarding wizard page.
 *
 * This component is intentionally thin — it only:
 *   1. Calls `useOnboarding` to get all state and handlers
 *   2. Renders the shell (background + card + progress bar)
 *   3. Routes the active step to the correct step component
 *
 * All business logic lives in `useOnboarding`.
 * All UI details live in the step components.
 */
export default function OnboardingPage() {
  const {
    step,
    goNext,
    goBack,
    selectedType,
    setSelectedType,
    acceptAI,
    setAcceptAI,
    localRest,
    updateRest,
    handleFinish,
  } = useOnboarding();

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
    >
      <OnboardingBackground />

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-card p-6 sm:p-8">
          <ProgressBar step={step} />

          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <StepType
                key="step1"
                selected={selectedType}
                onSelect={setSelectedType}
                onNext={goNext}
              />
            )}

            {step === 2 && (
              <StepInfo
                key="step2"
                data={localRest}
                onChange={updateRest}
                onNext={goNext}
                onBack={goBack}
              />
            )}

            {step === 3 && (
              <StepAI
                key="step3"
                type={selectedType}
                acceptAI={acceptAI}
                setAcceptAI={setAcceptAI}
                onNext={goNext}
                onBack={goBack}
              />
            )}

            {step === 4 && (
              <StepSuccess
                key="step4"
                onGoMenu={handleFinish}
                onGoDashboard={handleFinish}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
