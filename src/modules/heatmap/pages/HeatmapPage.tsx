'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { defaultData } from '../constants';
import { useHeatmap } from '../hooks/useHeatmap';
import { SummaryKpiCards } from '../components/SummaryKpiCards';
import { VisualHeatmapCard } from '../components/VisualHeatmapCard';
import { DishHeatCardList } from '../components/DishHeatCardList';
import { ScrollDepthChart } from '../components/ScrollDepthChart';
import { AttentionZonesList } from '../components/AttentionZonesList';
import type { HeatmapSummaryData } from '../types';

interface HeatmapPageProps {
  data?: HeatmapSummaryData;
}

/**
 * Heatmap Page.
 *
 * This orchestrator is extremely thin and focused (under 115 lines):
 *  - Handles data states and mode switches using useHeatmap hook.
 *  - Coordinates metric cards, radial maps, dish lists, scroll depths, and attention zones.
 */
export default function HeatmapPage({ data: propData }: HeatmapPageProps) {
  const data = propData ?? defaultData;
  const {
    activeView,
    setActiveView,
    activeDishes,
    valueLabel,
    viewButtons,
    maxDishStat,
    activeTitle,
  } = useHeatmap(data);

  return (
    <div dir="rtl" className="space-y-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold gold-gradient-text flex items-center gap-2">
            <Flame className="h-7 w-7 text-[#d4a853]" />
            خريطة حرارية
          </h2>
          <p className="text-sm text-[#8a8578] mt-1">
            تتبّع تفاعل الزبائن مع القائمة الرقمية في الوقت الحقيقي
          </p>
        </div>

        {/* View mode toolbar */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {viewButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeView === btn.key;
            return (
              <Button
                key={btn.key}
                size="sm"
                variant="ghost"
                onClick={() => setActiveView(btn.key)}
                className={cn(
                  'gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'gold-gradient text-[#0a0a0f] shadow-lg shadow-[#d4a853]/20 font-bold'
                    : 'text-[#8a8578] hover:text-[#f0ece4] hover:bg-white/[0.04]',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {btn.label}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* KPI Stats Cards */}
      <SummaryKpiCards data={data} />

      {/* Visual Heatmap Overlay and active Dishes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Visual Map column */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <VisualHeatmapCard data={data} />
        </motion.div>

        {/* Dish activity list column */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <DishHeatCardList
            activeTitle={activeTitle}
            activeView={activeView}
            activeDishes={activeDishes}
            maxDishStat={maxDishStat}
            valueLabel={valueLabel}
          />
        </motion.div>
      </div>

      {/* Scrolling depth metrics and category attention scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Scroll depth charts */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex"
        >
          <ScrollDepthChart
            distribution={data.scrollDepthDistribution}
            avg={data.scrollDepthAvg}
          />
        </motion.div>

        {/* Attention zones breakdown list */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex"
        >
          <AttentionZonesList attentionZones={data.attentionZones} />
        </motion.div>
      </div>
    </div>
  );
}
