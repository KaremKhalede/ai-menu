/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Smart Cart feature has been refactored into `src/modules/smart-cart`.
 * This re-export preserves backward compatibility for the dynamic or static import
 * across components referencing `@/components/smart-cart`.
 *
 * Do NOT add new code here. Use `@/modules/smart-cart` directly.
 */
export { SmartCart as default } from '@/modules/smart-cart';
export * from '@/modules/smart-cart';
