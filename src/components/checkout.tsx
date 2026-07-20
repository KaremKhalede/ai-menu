/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Checkout feature has been refactored into `src/modules/checkout`.
 * This re-export preserves backward compatibility for the dynamic or static import
 * across components referencing `@/components/checkout`.
 *
 * Do NOT add new code here. Use `@/modules/checkout` directly.
 */
export { Checkout as default } from '@/modules/checkout';
export * from '@/modules/checkout';