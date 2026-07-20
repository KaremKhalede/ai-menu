'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPI_ROW1 } from '../constants/kpis';
import { fadeUp, stagger } from '../utils/animations';

/**
 * The 6-card main KPI row at the top of the dashboard.
 */
export function KpiCardRow1() {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {KPI_ROW1.map((kpi, i) => {
        const Icon = kpi.icon;
        const isHighlight = !!kpi.highlight;
        // invertTrend: for drop-off rate, -3% (trendUp=true) means improving → show green
        const isTrendPositive = kpi.trendUp;

        return (
          <motion.div key={kpi.label} custom={i} variants={fadeUp}>
            <Card
              className={`glass-card border-0 p-0 overflow-hidden ${
                isHighlight ? 'ring-1 ring-[#d4a853]/30' : ''
              }`}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      isHighlight ? 'bg-[#d4a853]/20' : 'bg-[#d4a853]/10'
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 ${
                        isHighlight ? 'text-[#e8c47c]' : 'text-[#d4a853]'
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      isTrendPositive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {isTrendPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {kpi.trend}
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-[#f0ece4] mb-0.5 leading-tight">
                  {kpi.value}
                </p>
                <p className="text-[11px] sm:text-xs text-[#8a8578] truncate">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
