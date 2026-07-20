/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Settings feature has been refactored into `src/modules/settings`.
 * This re-export preserves backward compatibility for the dynamic import in
 * `src/app/dashboard/page.tsx` which references `@/components/admin-settings`.
 *
 * Do NOT add new code here. Use `@/modules/settings` directly.
 */
export { SettingsPage as default } from '@/modules/settings';
export * from '@/modules/settings';