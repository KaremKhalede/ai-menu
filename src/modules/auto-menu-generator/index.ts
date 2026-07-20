/**
 * modules/auto-menu-generator — public API
 *
 * Exporting page entry point, hooks, components, and types.
 */

/* ── Page (primary entry point) ── */
export { default as AutoMenuGeneratorPage } from './pages/AutoMenuGeneratorPage';

/* ── Hook ── */
export { useAutoMenuGenerator } from './hooks/useAutoMenuGenerator';

/* ── Components ── */
export { StepInputForm } from './components/StepInputForm';
export { DishCard } from './components/DishCard';
export { StepPreview } from './components/StepPreview';
export { StepSuccess } from './components/StepSuccess';

/* ── Types ── */
export type { Step, CuisineOption, PriceRangeOption } from './types';
