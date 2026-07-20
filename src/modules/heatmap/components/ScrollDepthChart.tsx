'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { heatColor } from '../utils';
import type { HeatmapSummaryData } from '../types';

interface ScrollDepthChartProps {
  distribution: HeatmapSummaryData['scrollDepthDistribution'];
  avg: number;
}

export function ScrollDepthChart({ distribution, avg }: ScrollDepthChartProps) {
  const maxCount = Math.max(...distribution.map((d) => d.count));

  return (
    <Card className="glass-card border-0 overflow-hidden w-full">
      <CardHeader className="pb-3 text-right">
        <div className="flex items-center gap-2 justify-start">
          <BarChart3 className="h-5 w-5 text-[#d4a853]" />
          <CardTitle className="text-base font-bold text-[#f0ece4]">
            عمق التمرير
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {distribution.map((bucket, i) => {
            const pct = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
            const intensity = pct / 100;
            return (
              <div key={bucket.range} className="flex items-center gap-3">
                <span className="text-xs text-[#8a8578] w-20 text-left shrink-0">{bucket.range}</span>
                <div className="flex-1 h-6 rounded-md bg-white/[0.04] overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-md"
                    style={{
                      background: `linear-gradient(90deg, ${heatColor(intensity * 0.6)}, ${heatColor(intensity)})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                  />
                  <span className="absolute inset-0 flex items-center justify-end px-2 text-[10px] font-medium text-white/80">
                    {bucket.count.toLocaleString('ar-SA')}
                  </span>
                </div>
                <span className="text-xs text-[#8a8578] w-10 text-left shrink-0">{bucket.percentage}%</span>
              </div>
            );
          })}

          {/* Average line indicator */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.06] justify-start">
            <TrendingUp className="h-4 w-4 text-[#d4a853]" />
            <span className="text-xs text-[#8a8578]">متوسط عمق التمرير:</span>
            <span className="text-sm font-bold text-[#d4a853]">{avg}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
