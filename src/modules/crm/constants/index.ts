import type { ChartConfig } from '@/components/ui/chart';

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35 },
  }),
};

export const segmentColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  repeat: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
  high_value: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low_value: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const segmentDotColors: Record<string, string> = {
  new: 'bg-blue-500',
  repeat: 'bg-emerald-500',
  inactive: 'bg-red-500',
  high_value: 'bg-yellow-500',
  low_value: 'bg-gray-500',
};

export const statusBadge: Record<string, { label: string; cls: string }> = {
  draft: { label: 'مسودة', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  scheduled: { label: 'مجدوّلة', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  sent: { label: 'مرسلة', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'مكتملة', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

export const pieChartConfig: ChartConfig = {
  new: { label: 'جدد', color: '#3b82f6' },
  repeat: { label: 'متكررين', color: '#10b981' },
  inactive: { label: 'غير نشطين', color: '#ef4444' },
  high_value: { label: 'قيمة عالية', color: '#d4a853' },
};

export const barChartConfig: ChartConfig = {
  revenue: { label: 'الإيرادات (ر.س)', color: '#d4a853' },
};
