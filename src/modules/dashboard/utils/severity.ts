import type { SeverityConfig } from '../types';

/**
 * Returns Tailwind color/bg/border/dot/label tokens for a drop-off severity level.
 */
export function getSeverityConfig(severity: 'high' | 'medium' | 'low'): SeverityConfig {
  switch (severity) {
    case 'high':
      return {
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        dot: 'bg-red-400',
        label: 'مرتفع',
      };
    case 'medium':
      return {
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
        label: 'متوسط',
      };
    case 'low':
      return {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'منخفض',
      };
  }
}

/** Returns the correct border class for an AI insight card. */
export function getInsightBorder(type: 'success' | 'warning' | 'info'): string {
  switch (type) {
    case 'success': return 'border-emerald-500/30';
    case 'warning': return 'border-amber-500/30';
    case 'info':    return 'border-orange-500/30';
  }
}

/** Returns the icon component for an AI insight type. */
export function getInsightIconClass(type: 'success' | 'warning' | 'info'): string {
  switch (type) {
    case 'success': return 'h-5 w-5 text-emerald-400 shrink-0';
    case 'warning': return 'h-5 w-5 text-amber-400 shrink-0';
    case 'info':    return 'h-5 w-5 text-orange-400 shrink-0';
  }
}
