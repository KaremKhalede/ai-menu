'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { hourlyOrders } from '@/lib/demo-data';
import { PEAK_HOURS } from '../constants/chartConfig';
import { BarTooltip } from './ChartTooltips';

/**
 * Peak hours bar chart card.
 * Highlights evening peak hours in a brighter gold.
 */
export function PeakHoursChart() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#d4a853]" />
            <CardTitle className="text-lg font-bold text-[#f0ece4]">أوقات الذروة</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyOrders}
                margin={{ top: 4, right: 0, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#8a8578', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: '#8a8578', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<BarTooltip />} cursor={false} />
                <Bar
                  dataKey="orders"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                  fill="#d4a853"
                  fillOpacity={0.7}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={((props: any) => {
                    const { x, y, width, height, payload } = props as {
                      x: number;
                      y: number;
                      width: number;
                      height: number;
                      payload: { hour: string };
                    };
                    const isPeak = PEAK_HOURS.includes(payload.hour);
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={4}
                        ry={4}
                        fill={isPeak ? '#e8c47c' : '#d4a853'}
                        fillOpacity={isPeak ? 1 : 0.6}
                      />
                    );
                  })}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-[#8a8578]">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#d4a853]/60" />
              <span>عادي</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#e8c47c]" />
              <span>ذروة (8-10 م)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
