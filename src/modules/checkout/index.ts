/**
 * modules/checkout — public API
 *
 * Exporting page entry point, hooks, components, and types.
 */

/* ── Page (primary entry point) ── */
export { default as Checkout } from './pages/CheckoutPage';

/* ── Hook ── */
export { useCheckout } from './hooks/useCheckout';

/* ── Components ── */
export { ConfettiParticles } from './components/ConfettiParticles';
export { StepOrderSummary } from './components/StepOrderSummary';
export { StepPaymentDetails } from './components/StepPaymentDetails';
export { StepSuccessConfirm } from './components/StepSuccessConfirm';

/* ── Services ── */
export { submitOrder } from './services/order';

/* ── Utils ── */
export { formatPrice } from './utils';

/* ── Types ── */
export type { Step, OrderPayload, OrderItemPayload } from './types';
