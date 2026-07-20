import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  format, 
  differenceInDays, 
  eachHourOfInterval, 
  eachDayOfInterval, 
  eachMonthOfInterval 
} from 'date-fns';

export function parsePeriod(period: string, from?: string, to?: string) {
  const now = new Date();
  
  if (period === 'today') {
    return { 
      startDate: startOfDay(now), 
      endDate: endOfDay(now), 
      unit: 'hour' as const
    };
  }
  
  if (period === 'last7days') {
    return {
      startDate: startOfDay(subDays(now, 6)), // 6 days ago + today = 7 days
      endDate: endOfDay(now),
      unit: 'day' as const
    };
  }

  if (period === 'last30days') {
    return {
      startDate: startOfDay(subDays(now, 29)),
      endDate: endOfDay(now),
      unit: 'day' as const
    };
  }

  if (period === 'custom' && from && to) {
    const start = startOfDay(new Date(from));
    const end = endOfDay(new Date(to));
    const diff = Math.abs(differenceInDays(end, start));
    
    // Auto-detect unit
    let unit: 'hour' | 'day' | 'month' = 'day';
    if (diff === 0) unit = 'hour'; // Same day
    else if (diff > 60) unit = 'month'; // Over 2 months
    else unit = 'day';

    return {
      startDate: start,
      endDate: end,
      unit
    };
  }

  // Fallback
  return { startDate: startOfDay(now), endDate: endOfDay(now), unit: 'hour' as const };
}

export function bucketData<T>(
  data: T[], 
  dateSelector: (item: T) => Date,
  valueSelector: (item: T) => number,
  unit: 'hour' | 'day' | 'month',
  startDate: Date,
  endDate: Date
) {
  const buckets: Record<string, number> = {};

  // Pre-fill buckets so we don't have gaps in the chart (e.g. hours with 0 orders)
  if (unit === 'hour') {
    eachHourOfInterval({ start: startDate, end: endDate }).forEach(d => {
      buckets[format(d, 'HH:00')] = 0;
    });
  } else if (unit === 'day') {
    eachDayOfInterval({ start: startDate, end: endDate }).forEach(d => {
      buckets[format(d, 'yyyy-MM-dd')] = 0;
    });
  } else if (unit === 'month') {
    eachMonthOfInterval({ start: startDate, end: endDate }).forEach(d => {
      buckets[format(d, 'yyyy-MM')] = 0;
    });
  }

  // Populate data
  for (const item of data) {
    const date = dateSelector(item);
    let label = '';
    
    if (unit === 'hour') {
      label = format(date, 'HH:00');
    } else if (unit === 'day') {
      label = format(date, 'yyyy-MM-dd');
    } else if (unit === 'month') {
      label = format(date, 'yyyy-MM');
    }

    if (buckets[label] !== undefined) {
      buckets[label] += valueSelector(item);
    }
  }

  // Convert to array of objects, sorted chronologically
  return Object.keys(buckets).sort().map(label => ({
    label,
    value: Number(buckets[label].toFixed(2))
  }));
}
