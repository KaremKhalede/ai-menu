/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Auto Menu Generator feature has been refactored into `src/modules/auto-menu-generator`.
 * This re-export preserves backward compatibility for the dynamic import in
 * `src/app/dashboard/page.tsx` which references `@/components/auto-menu-generator`.
 *
 * Do NOT add new code here. Use `@/modules/auto-menu-generator` directly.
 */
export { AutoMenuGeneratorPage as default } from '@/modules/auto-menu-generator';
export * from '@/modules/auto-menu-generator';