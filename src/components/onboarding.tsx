/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Onboarding feature has been moved to `src/modules/onboarding`.
 * This re-export preserves backwards-compatibility for any code that
 * still imports from `@/components/onboarding`.
 *
 * Do NOT add new code here. Use `@/modules/onboarding` directly.
 */
export { OnboardingPage as default } from '@/modules/onboarding';