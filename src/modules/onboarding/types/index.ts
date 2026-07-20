import type { Restaurant } from '@/lib/types';

export type { Restaurant };

/** The 1-based step index for the onboarding wizard. */
export type OnboardingStep = 1 | 2 | 3 | 4;

/** Shape of the local restaurant state managed during onboarding. */
export type OnboardingRestaurant = Restaurant;
