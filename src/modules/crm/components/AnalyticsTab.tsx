'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, TrendingUp, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { getCRMAnalytics, demoCustomers } from '@/lib/crm-engine';
import { KPICard } from './KPICard';
import { pieChartConfig, barChartConfig, fadeUp } from '../constants';

export function AnalyticsTab() {
  const analytics = useMemo(() => getCRMAnalytics(), []);

  // Pie data
  const pieData = useMemo(() => [
    { name: 'new', value: demoCustomers.filter((c) => c.tags.includes('new')).length },
    { name: 'repeat', value: demoCustomers.filter((c) => c.tags.includes('repeat')).length },
    { name: 'inactive', value: demoCustomers.filter((c) => c.tags.includes('inactive')).length },
    { name: 'high_value', value: demoCustomers.filter((c) => c.tags.includes('high_value')).length },
  ], []);

  // Bar data – revenue by segment
  const barData = useMemo(() => [
    {
      segment: 'جدد',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('new'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
    {
      segment: 'متكررين',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('repeat') && !c.tags.includes('high_value'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
    {
      segment: 'غير نشطين',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('inactive'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
    {
      segment: 'قيمة عالية',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('high_value'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
  ], []);

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" dir="rtl">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          icon={Users}
          label="إجمالي العملاء"
          value={analytics.totalCustomers}
          sub={`${analytics.newCustomersThisMonth} عميل جديد هذا الشهر`}
          delay={0}
        />
        <KPICard
          icon={UserCheck}
          label="معدل الاحتفاظ"
          value={`${analytics.retentionRate}%`}
          sub="خلال آخر 30 يوم"
          delay={1}
        />
        <KPICard
          icon={TrendingUp}
          label="متوسط قيمة العميل"
          value={`${analytics.customerLifetimeValue} ر.س`}
          sub="عمر العميل الافتراضي"
          delay={2}
        />
        <KPICard
          icon={ShoppingCart}
          label="متوسط الطلبات/عميل"
          value={analytics.avgOrdersPerCustomer}
          sub={`${analytics.churnRisk.length} عميل بخطر الفقدان`}
          delay={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie – Customer Distribution */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="glass-card p-4"
        >
          <h3 className="text-white font-semibold mb-4 text-sm">توزيع العملاء حسب الشريحة</h3>
          <ChartContainer config={pieChartConfig} className="mx-auto h-[250px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={pieChartConfig[entry.name as keyof typeof pieChartConfig]?.color}
                    className="stroke-transparent"
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </motion.div>

        {/* Bar – Revenue by segment */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="glass-card p-4"
        >
          <h3 className="text-white font-semibold mb-4 text-sm">الإيرادات حسب الشريحة</h3>
          <ChartContainer config={barChartConfig} className="h-[250px] w-full">
            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="segment"
                width={80}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} fill="#d4a853" />
            </BarChart>
          </ChartContainer>
        </motion.div>
      </div>

      {/* Campaign Performance Table */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white font-semibold text-sm">أداء الحملات</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 text-right">الحملة</TableHead>
              <TableHead className="text-gray-400 text-right">مُرسل</TableHead>
              <TableHead className="text-gray-400 text-right">تم التوصيل</TableHead>
              <TableHead className="text-gray-400 text-right">مقروء</TableHead>
              <TableHead className="text-gray-400 text-right">نقر</TableHead>
              <TableHead className="text-gray-400 text-right">تحويل</TableHead>
              <TableHead className="text-gray-400 text-right">العائد</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.campaignROI.map((row, i) => (
              <TableRow
                key={row.campaignName}
                className="border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="text-white text-right font-medium">{row.campaignName}</TableCell>
                <TableCell className="text-gray-300 text-right">{row.sent}</TableCell>
                <TableCell className="text-gray-300 text-right">
                  {Math.round(row.sent * 0.95)}
                </TableCell>
                <TableCell className="text-gray-300 text-right">
                  {Math.round(row.sent * 0.72)}
                </TableCell>
                <TableCell className="text-gray-300 text-right">
                  {Math.round(row.sent * 0.43)}
                </TableCell>
                <TableCell className="text-[#d4a853] text-right font-bold">{row.converted}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      row.roi > 200
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : row.roi > 100
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {row.roi}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
