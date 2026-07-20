/**
 * modules/settings — public API
 *
 * Exporting page entry point, hooks, components, and types.
 */

/* ── Page (primary entry point) ── */
export { default as SettingsPage } from './pages/SettingsPage';

/* ── Hook ── */
export { useAdminSettings } from './hooks/useAdminSettings';

/* ── Components ── */
export { SectionCard } from './components/SectionCard';
export { ProfileSection } from './components/ProfileSection';
export { RestaurantInfoSection } from './components/RestaurantInfoSection';
export { VoicePersonalitySection } from './components/VoicePersonalitySection';
export { TeamSection } from './components/TeamSection';
export { SecuritySection } from './components/SecuritySection';
export { SubscriptionSection } from './components/SubscriptionSection';

/* ── Types ── */
export type { Restaurant, User, PersonalityMode } from './types';
export type { UseAdminSettingsReturn } from './hooks/useAdminSettings';
