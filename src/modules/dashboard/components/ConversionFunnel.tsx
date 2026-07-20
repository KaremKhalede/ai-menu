'use client';

import { motion } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { conversionFunnel } from '@/lib/demo-data';
import { FUNNEL_BAR_COLORS } from '../constants/chartConfig';

/**
 * Funnel visualization — renders animated bars representing each conversion stage.
 */
function ConversionFunnelViz() {
  const maxCount = conversionFunnel[0].count;

  return (
    <div className="space-y-2.5">
      {conversionFunnel.map((step, i) => {
        const widthPct = (step.count / maxCount) * 100;
        const dropOff =
          i > 0
            ? (
                ((conversionFunnel[i - 1].count - step.count) /
                  conversionFunnel[i - 1].count) *
                100
              ).toFixed(1)
            : null;

        return (
          <div key={step.stage}>
            {dropOff && (
              <div className="flex justify-center mb-1">
                <span className="text-[11px] font-medium text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full">
                  ↓ تسرب {dropOff}%
                </span>
              </div>
            )}
            <div className="relative group">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                style={{ width: `${widthPct}%`, transformOrigin: 'right' }}
                className={`h-11 rounded-xl bg-gradient-to-l ${FUNNEL_BAR_COLORS[i]} flex items-center justify-between px-4 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm font-bold text-[#0a0a0f] z-10">{step.stage}</span>
                <div className="flex items-center gap-2 z-10">
                  <span className="text-xs font-semibold text-[#0a0a0f]/80">
                    {step.count.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-[11px] font-bold text-[#0a0a0f]/60 bg-black/10 px-2 py-0.5 rounded-full">
                    {step.percentage}%
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Conversion funnel card — wraps the visualization with a Card and legend.
 */
export function ConversionFunnel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65, duration: 0.5 }}
    >
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="h-5 w-5 text-[#d4a853]" />
            <CardTitle className="text-lg font-bold text-[#f0ece4]">قمع التحويل</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ConversionFunnelViz />
          <div className="flex items-center gap-4 mt-4 text-[11px] text-[#8a8578]">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#d4a853]" />
              <span>مرحلة التحويل</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-red-500/30 border border-red-400" />
              <span>نسبة التسرب</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
