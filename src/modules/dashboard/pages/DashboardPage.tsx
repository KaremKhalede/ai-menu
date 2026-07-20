'use client';

import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader } from '../components/DashboardHeader';
import { KpiCardRow1 } from '../components/KpiCardRow1';
import { KpiCardRow2 } from '../components/KpiCardRow2';
import { RevenueChart } from '../components/RevenueChart';
import { ConversionFunnel } from '../components/ConversionFunnel';
import { PeakHoursChart } from '../components/PeakHoursChart';
import { AiInsightsPanel } from '../components/AiInsightsPanel';
import { DropOffPanel } from '../components/DropOffPanel';
import { QuickActions } from '../components/QuickActions';
import type { ViewType } from '@/lib/types';

/**
 * Dashboard page — intentionally thin orchestration layer.
 *
 * This component only:
 *  1. Pulls data and actions from `useDashboard`
 *  2. Lays out the page grid
 *  3. Routes props to the correct section components
 *
 * All business logic → hooks
 * All UI details → section components
 */
export default function DashboardPage() {
  const { user, setView, allInsights, dropOffAnalysis } = useDashboard();

  return (
    <div className="bg-[#0a0a0f] text-[#f0ece4] py-6">

      {/* ── Page header ── */}
      <DashboardHeader userName={user?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ── A. Main KPI row (6 cards) ── */}
        <KpiCardRow1 />

        {/* ── B. AI Engine KPI row (4 cards) ── */}
        <KpiCardRow2 />

        {/* ── C. Revenue area chart ── */}
        <RevenueChart />

        {/* ── D. Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* LEFT column (RTL: appears right) */}
          <div className="space-y-4 sm:space-y-6">
            <ConversionFunnel />
            <PeakHoursChart />
          </div>

          {/* RIGHT column (RTL: appears left) */}
          <div className="space-y-4 sm:space-y-6">
            <AiInsightsPanel insights={allInsights} />
            <DropOffPanel items={dropOffAnalysis} />
            <QuickActions
              onNavigate={(view: ViewType) => setView(view)}
              onSmartSort={() => {
                import('../services/smartSort').then(({ triggerSmartSort }) =>
                  triggerSmartSort()
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
