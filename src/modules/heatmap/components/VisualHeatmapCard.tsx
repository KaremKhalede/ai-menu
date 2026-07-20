'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MockMenuHeatmap } from './MockMenuHeatmap';
import { heatColor } from '../utils';
import type { HeatmapSummaryData } from '../types';

interface VisualHeatmapCardProps {
  data: HeatmapSummaryData;
}

export function VisualHeatmapCard({ data }: VisualHeatmapCardProps) {
  return (
    <Card className="glass-card border-0 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#d4a853]" />
            <CardTitle className="text-base font-bold text-[#f0ece4]">
              خريطة حرارية للقائمة
            </CardTitle>
          </div>
          <Badge variant="outline" className="border-[#d4a853]/30 text-[#d4a853] text-[10px]">
            مباشر
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <MockMenuHeatmap data={data} />

        {/* Color legend scale */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-[10px] text-[#8a8578]">منخفض</span>
          <div className="flex h-2.5 w-32 rounded-full overflow-hidden">
            {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((v, i) => (
              <div key={i} className="flex-1" style={{ background: heatColor(v) }} />
            ))}
          </div>
          <span className="text-[10px] text-[#8a8578]">مرتفع</span>
        </div>

        {/* Hotspots stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {data.topHotspots.map((hotspot, i) => (
            <motion.div
              key={hotspot.zone}
              className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
            >
              <p className="text-xs font-semibold text-[#f0ece4]">{hotspot.zone}</p>
              <p className="text-[10px] text-[#8a8578]">{hotspot.count.toLocaleString('ar-SA')} نقر</p>
              <p className="text-[10px] font-medium" style={{ color: heatColor(hotspot.percentage / 100) }}>
                {hotspot.percentage}%
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
