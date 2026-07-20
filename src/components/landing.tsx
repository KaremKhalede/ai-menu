/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Landing feature has been refactored into `src/modules/landing`.
 * This re-export preserves backward compatibility for the dynamic or static import
 * across components referencing `@/components/landing`.
 *
 * Do NOT add new code here. Use `@/modules/landing` directly.
 */
export { Landing as default } from '@/modules/landing';
export * from '@/modules/landing';