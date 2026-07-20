import { segmentColors } from '../constants';
import type { Customer } from '../types';

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCustomerSegmentBadge(c: Customer): { label: string; cls: string } {
  if (c.tags.includes('high_value')) return { label: 'قيمة عالية', cls: segmentColors.high_value };
  if (c.tags.includes('inactive')) return { label: 'غير نشط', cls: segmentColors.inactive };
  if (c.tags.includes('new')) return { label: 'جديد', cls: segmentColors.new };
  if (c.tags.includes('repeat')) return { label: 'متكرر', cls: segmentColors.repeat };
  return { label: 'قيمة منخفضة', cls: segmentColors.low_value };
}
