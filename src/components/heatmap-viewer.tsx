/**
 * @deprecated
 * This file is a Strangler Pattern shim.
 * The Heatmap Viewer feature has been refactored into `src/modules/heatmap`.
 * This re-export preserves backward compatibility for the dynamic import in
 * `src/app/dashboard/page.tsx` which references `@/components/heatmap-viewer`.
 *
 * Do NOT add new code here. Use `@/modules/heatmap` directly.
 */
export { HeatmapPage as default } from '@/modules/heatmap';
export * from '@/modules/heatmap';