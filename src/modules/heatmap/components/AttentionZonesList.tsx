'use client';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { scaleIn } from '../constants';
import { heatColor } from '../utils';
import type { HeatmapSummaryData } from '../types';

interface AttentionZonesListProps {
  attentionZones: HeatmapSummaryData['attentionZones'];
}

export function AttentionZonesList({ attentionZones }: AttentionZonesListProps) {
  return (
    <Card className="glass-card border-0 overflow-hidden w-full">
      <CardHeader className="pb-3 text-right">
        <div className="flex items-center gap-2 justify-start">
          <Eye className="h-5 w-5 text-[#d4a853]" />
          <CardTitle className="text-base font-bold text-[#f0ece4]">
            مناطق الاهتمام
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attentionZones.map((zone, i) => (
            <motion.div
              key={zone.section}
              custom={i}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="p-3 rounded-xl border transition-colors text-right"
              style={{
                background: `linear-gradient(135deg, ${heatColor(zone.attention / 100)}0d 0%, rgba(18,18,26,0.4) 100%)`,
                borderColor: `${heatColor(zone.attention / 100)}28`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-[#f0ece4]">{zone.section}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: `${heatColor(zone.attention / 100)}22`,
                      color: heatColor(zone.attention / 100),
                    }}
                  >
                    {zone.attention}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#8a8578] leading-relaxed mb-2">{zone.description}</p>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${heatColor((zone.attention / 100) * 0.6)}, ${heatColor(zone.attention / 100)})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.attention}%` }}
                  transition={{ duration: 0.7, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
