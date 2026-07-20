'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Flame, Clock, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { stagger, fadeUp } from '../constants';
import type { HeatmapSummaryData } from '../types';

interface SummaryKpiCardsProps {
  data: HeatmapSummaryData;
}

export function SummaryKpiCards({ data }: SummaryKpiCardsProps) {
  const cards = [
    {
      label: 'إجمالي التفاعلات',
      value: data.totalInteractions.toLocaleString('ar-SA'),
      icon: Activity,
      trend: '+18%',
      up: true,
    },
    {
      label: 'الطبق الأكثر نشاطاً',
      value: data.mostActiveDish.dishName,
      icon: Flame,
      trend: `${data.mostActiveDish.totalInteractions.toLocaleString('ar-SA')} تفاعل`,
      up: true,
    },
    {
      label: 'متوسط وقت المشاهدة',
      value: `${data.averageViewDuration} ثانية`,
      icon: Clock,
      trend: '+3 ثوانٍ',
      up: true,
    },
    {
      label: 'عمق التمرير',
      value: `${data.scrollDepthAvg}%`,
      icon: BarChart3,
      trend: '+5%',
      up: true,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {cards.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <motion.div key={kpi.label} custom={i} variants={fadeUp}>
            <Card className="glass-card border-0 p-0 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-9 w-9 rounded-lg bg-[#d4a853]/10 flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5 text-[#d4a853]" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0"
                  >
                    {kpi.up ? '↑' : '↓'} {kpi.trend}
                  </Badge>
                </div>
                <p
                  className={cn(
                    'font-bold text-[#f0ece4] mb-0.5 leading-tight',
                    i === 1 ? 'text-sm sm:text-base truncate' : 'text-xl sm:text-2xl'
                  )}
                  title={kpi.value}
                >
                  {kpi.value}
                </p>
                <p className="text-[11px] text-[#8a8578] truncate">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
