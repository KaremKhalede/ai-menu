'use client';

import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { KPI_ROW2 } from '../constants/kpis';

/**
 * The 4-card AI Engine KPI row, shown below the main KPI row.
 */
export function KpiCardRow2() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit className="h-4 w-4 text-[#d4a853]" />
        <h2 className="text-sm font-bold text-[#d4a853]">محرك إيرادات الذكاء الاصطناعي</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {KPI_ROW2.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
            >
              <Card className="glass-card border-0 p-0 overflow-hidden">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#d4a853]/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[#d4a853]" />
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#8a8578]">{kpi.label}</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-[#f0ece4] mb-0.5 leading-tight">
                    {kpi.value}
                  </p>
                  {kpi.subtext && (
                    <p className="text-[10px] sm:text-xs text-[#8a8578]/70">{kpi.subtext}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
