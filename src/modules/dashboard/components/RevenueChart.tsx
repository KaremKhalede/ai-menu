'use client';

import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { dailyRevenue } from '@/lib/demo-data';
import { GoldTooltip } from './ChartTooltips';

/**
 * Full-width daily revenue area chart card.
 */
export function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
    >
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#d4a853]" />
            <CardTitle className="text-lg font-bold text-[#f0ece4]">الإيرادات اليومية</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a853" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#d4a853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#8a8578', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8a8578', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip content={<GoldTooltip />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d4a853"
                  strokeWidth={2.5}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
