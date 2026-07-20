/**
 * modules/dashboard — public API
 *
 * The page is the primary entry point. All other exports are for
 * targeted reuse (e.g. embedding a KPI row in another page).
 * Internal constants, utils, and services are NOT re-exported —
 * they are implementation details that can evolve freely.
 *
 *   import { DashboardPage } from '@/modules/dashboard';
 */

/* ── Page (primary entry point) ── */
export { default as DashboardPage } from './pages/DashboardPage';

/* ── Hook ── */
export { useDashboard } from './hooks/useDashboard';

/* ── Section components (for targeted reuse) ── */
export { DashboardHeader } from './components/DashboardHeader';
export { KpiCardRow1 } from './components/KpiCardRow1';
export { KpiCardRow2 } from './components/KpiCardRow2';
export { RevenueChart } from './components/RevenueChart';
export { ConversionFunnel } from './components/ConversionFunnel';
export { PeakHoursChart } from './components/PeakHoursChart';
export { AiInsightsPanel } from './components/AiInsightsPanel';
export { DropOffPanel } from './components/DropOffPanel';
export { QuickActions } from './components/QuickActions';

/* ── Module-specific types ── */
export type {
  FunnelStep,
  DropOffRow,
  SeverityConfig,
  KpiRow1Item,
  KpiRow2Item,
} from './types';
