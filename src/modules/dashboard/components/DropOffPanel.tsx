'use client';

import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSeverityConfig } from '../utils/severity';
import type { DropOffRow } from '../types';

interface DropOffPanelProps {
  items: DropOffRow[];
}

/**
 * Drop-off analysis card — one row per funnel stage with severity badge.
 */
export function DropOffPanel({ items }: DropOffPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
    >
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-[#d4a853]" />
            <CardTitle className="text-lg font-bold text-[#f0ece4]">تحليل التسرب</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, i) => {
            const sev = getSeverityConfig(item.severity);
            return (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15 + i * 0.08, duration: 0.4 }}
                className={`p-3 rounded-xl border ${sev.border} bg-white/[0.02]`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${sev.dot}`} />
                    <p className="text-sm font-semibold text-[#f0ece4]">{item.stage}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-xs font-bold ${sev.color}`}>{item.rate}%</span>
                    <span
                      className={`text-[10px] ${sev.color} ${sev.bg} px-1.5 py-0.5 rounded-full`}
                    >
                      {sev.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8a8578] leading-relaxed mr-4">{item.suggestion}</p>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
