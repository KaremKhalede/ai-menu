/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Menu Editor feature has been refactored into `src/modules/menu`.
 * This re-export preserves backward compatibility for the dynamic or static import
 * across components referencing `@/components/menu-editor`.
 *
 * Do NOT add new code here. Use `@/modules/menu` directly.
 */
export { MenuEditor as default } from '@/modules/menu';
export * from '@/modules/menu';