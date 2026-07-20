/**
 * modules/landing — public API
 *
 * Exporting page entry point, hooks, components, and types.
 */

/* ── Page (primary entry point) ── */
export { default as Landing } from './pages/LandingPage';

/* ── Hook ── */
export { useLanding } from './hooks/useLanding';

/* ── Components ── */
export { LandingNav } from './components/LandingNav';
export { LandingHero } from './components/LandingHero';
export { LandingFeatures } from './components/LandingFeatures';
export { LandingHowItWorks } from './components/LandingHowItWorks';
export { LandingDemoPreview } from './components/LandingDemoPreview';
export { LandingCTA } from './components/LandingCTA';
export { LandingFooter } from './components/LandingFooter';
