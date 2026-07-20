/**
 * modules/dish-detail — public API
 *
 * Exporting page entry point, hooks, components, and types.
 */

/* ── Page (primary entry point) ── */
export { default as DishDetail } from './pages/DishDetailPage';

/* ── Hook ── */
export { useDishDetail } from './hooks/useDishDetail';

/* ── Components ── */
export { SparklesIcon } from './components/SparklesIcon';
export { DishHeroSection } from './components/DishHeroSection';
export { DishInfoSection } from './components/DishInfoSection';
export { DishAddonsSection } from './components/DishAddonsSection';
export { DishPairingsSection } from './components/DishPairingsSection';
export { AiChatButton } from './components/AiChatButton';
export { DishAddToCartSticky } from './components/DishAddToCartSticky';

/* ── Utils ── */
export { getDishEmoji, calculateTotalPrice } from './utils';

/* ── Types ── */
export type { Dish, Addon } from './types';
