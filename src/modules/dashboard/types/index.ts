import type { AIInsight } from '@/lib/types';

export type { AIInsight };

/** One row in the conversion funnel. */
export interface FunnelStep {
  stage: string;
  count: number;
  percentage: number;
}

/** One row in the drop-off analysis table. */
export interface DropOffRow {
  stage: string;
  rate: number;
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
}

/** Visual config derived from a severity level. */
export interface SeverityConfig {
  color: string;
  bg: string;
  border: string;
  dot: string;
  label: string;
}

/** A single KPI card in row-1 (main KPIs). */
export interface KpiRow1Item {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendUp: boolean;
  highlight?: true;
  invertTrend?: true;
}

/** A single KPI card in row-2 (AI engine KPIs). */
export interface KpiRow2Item {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  subtext?: string;
}
