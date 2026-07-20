/**
 * modules/smart-cart — public API
 *
 * Exporting page entry point, hooks, components, and types.
 */

/* ── Page (primary entry point) ── */
export { default as SmartCart } from './pages/SmartCartPage';

/* ── Hook ── */
export { useSmartCart } from './hooks/useSmartCart';

/* ── Components ── */
export { QuantityControls } from './components/QuantityControls';
export { CartItemRow } from './components/CartItemRow';
export { AiUpsellCard } from './components/AiUpsellCard';
export { EmptyState } from './components/EmptyState';
export { CartSummary } from './components/CartSummary';

/* ── Utils ── */
export { getUpsellSuggestion } from './utils';

/* ── Types ── */
export type { SmartCartProps, UpsellSuggestion } from './types';
