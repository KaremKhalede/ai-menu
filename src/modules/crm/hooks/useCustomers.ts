'use client';

import { useState, useMemo } from 'react';
import { demoCustomers, segmentCustomers, type TargetSegment } from '@/lib/crm-engine';

export function useCustomers() {
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    let list = segmentCustomers(demoCustomers, segmentFilter as TargetSegment);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.favoriteDishes.some((d) => d.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, segmentFilter]);

  return {
    search,
    setSearch,
    segmentFilter,
    setSegmentFilter,
    expandedId,
    setExpandedId,
    customers: filteredCustomers,
  };
}
