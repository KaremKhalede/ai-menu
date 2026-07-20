/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Dish Detail feature has been refactored into `src/modules/dish-detail`.
 * This re-export preserves backward compatibility for the dynamic or static import
 * across components referencing `@/components/dish-detail`.
 *
 * Do NOT add new code here. Use `@/modules/dish-detail` directly.
 */
export { DishDetail as default } from '@/modules/dish-detail';
export * from '@/modules/dish-detail';