/**
 * modules/onboarding — public API
 *
 * The page is the primary entry point. Hooks and components are exported
 * for potential targeted reuse (e.g. embedding a step in another flow).
 * Internal constants, utils, and types are not re-exported — they are
 * implementation details that can evolve freely.
 *
 *   import { OnboardingPage } from '@/modules/onboarding';
 */

/* ── Page (primary entry point) ── */
export { default as OnboardingPage } from './pages/OnboardingPage';

/* ── Hook (for embedding wizard state elsewhere) ── */
export { useOnboarding } from './hooks/useOnboarding';

/* ── Step components (for targeted reuse) ── */
export { ProgressBar } from './components/ProgressBar';
export { StepType } from './components/StepType';
export { StepInfo } from './components/StepInfo';
export { StepAI } from './components/StepAI';
export { StepSuccess } from './components/StepSuccess';

/* ── Module-specific types ── */
export type { OnboardingStep, OnboardingRestaurant } from './types';
