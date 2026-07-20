'use client';

import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { triggerSmartSort } from '../services/smartSort';
import { ALL_INSIGHTS } from '../constants/kpis';
import { conversionFunnel, dropOffAnalysis, dailyRevenue, hourlyOrders } from '@/lib/demo-data';

/**
 * Provides all state and derived data the DashboardPage needs.
 * Keeps the page component under 150 lines.
 */
export function useDashboard() {
  const { user, setView } = useStore(
    useShallow((state) => ({
      user: state.user,
      setView: state.setView,
    }))
  );

  return {
    /* auth */
    user,

    /* navigation */
    setView,

    /* data */
    allInsights: ALL_INSIGHTS,
    conversionFunnel,
    dropOffAnalysis,
    dailyRevenue,
    hourlyOrders,

    /* actions */
    onSmartSort: triggerSmartSort,
  };
}
