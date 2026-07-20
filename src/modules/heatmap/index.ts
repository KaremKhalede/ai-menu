/**
 * modules/heatmap — public API
 *
 * Exporting page entry point, hooks, components, and types.
 */

/* ── Page (primary entry point) ── */
export { default as HeatmapPage } from './pages/HeatmapPage';

/* ── Hook ── */
export { useHeatmap } from './hooks/useHeatmap';

/* ── Components ── */
export { HeatmapDot } from './components/HeatmapDot';
export { DishHeatCard } from './components/DishHeatCard';
export { MockMenuHeatmap } from './components/MockMenuHeatmap';
export { ScrollDepthChart } from './components/ScrollDepthChart';
export { SummaryKpiCards } from './components/SummaryKpiCards';
export { AttentionZonesList } from './components/AttentionZonesList';
export { VisualHeatmapCard } from './components/VisualHeatmapCard';
export { DishHeatCardList } from './components/DishHeatCardList';

/* ── Types ── */
export type {
  DishStat,
  Hotspot,
  AttentionZone,
  HeatmapSummaryData,
  ViewMode,
} from './types';
