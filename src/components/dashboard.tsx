'use client';

import { useState } from 'react';
import { dailyRevenue, topDishes, hourlyOrders, aiInsights, kpiData } from '@/lib/demo-data';
import { useStore } from '@/lib/store';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Star,
  Percent,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Clock,
  UtensilsCrossed,
  BarChart3,
  Target,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

/* ───────────────────── Animation Variants ───────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ───────────────────── KPI Config ───────────────────── */

const kpiCards = [
  {
    label: 'إجمالي الإيرادات',
    value: `${kpiData.totalRevenue.toLocaleString('ar-SA')} ر.س`,
    icon: DollarSign,
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'إجمالي الطلبات',
    value: `${kpiData.totalOrders}`,
    icon: ShoppingBag,
    trend: '+8%',
    trendUp: true,
  },
  {
    label: 'متوسط قيمة الطلب',
    value: `${kpiData.avgOrderValue} ر.س`,
    icon: Target,
    trend: '+5%',
    trendUp: true,
  },
  {
    label: 'نسبة التحويل',
    value: `${kpiData.conversionRate}%`,
    icon: Percent,
    trend: '-2%',
    trendUp: false,
  },
];

/* ───────────────────── Custom Tooltip ───────────────────── */

function GoldTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 border-[#d4a853]/30 shadow-lg shadow-black/40">
      <p className="text-sm text-[#8a8578] mb-1">{label}</p>
      <p className="text-lg font-bold text-[#d4a853]">
        {payload[0].value.toLocaleString('ar-SA')} ر.س
      </p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 border-[#d4a853]/30 shadow-lg shadow-black/40">
      <p className="text-sm text-[#8a8578] mb-1">{label}</p>
      <p className="text-lg font-bold text-[#d4a853]">
        {payload[0].value} طلب
      </p>
    </div>
  );
}

/* ───────────────────── Insight Icon ───────────────────── */

function InsightIcon({ type }: { type: 'success' | 'warning' | 'info' }) {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
    case 'info':
      return <Info className="h-5 w-5 text-orange-400 shrink-0" />;
  }
}

function InsightBorder({ type }: { type: 'success' | 'warning' | 'info' }) {
  switch (type) {
    case 'success':
      return 'border-emerald-500/30';
    case 'warning':
      return 'border-amber-500/30';
    case 'info':
      return 'border-orange-500/30';
  }
}

/* ═══════════════════════════════════════════════════════════════
   Dashboard Component
   ═══════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const setView = useStore((s) => s.setView);

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0f] text-[#f0ece4] pb-12">
      {/* ──────── Top Bar ──────── */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gold-gradient flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-[#0a0a0f]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gold-gradient-text">
              لوحة التحكم
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] text-xs sm:text-sm"
              onClick={() => setView('menu')}
            >
              <ArrowRight className="h-4 w-4 ml-1" />
              العودة للقائمة
            </Button>
            <Button
              size="sm"
              className="gold-gradient text-[#0a0a0f] hover:opacity-90 text-xs sm:text-sm font-semibold"
              onClick={() => setView('menu-editor')}
            >
              <Lightbulb className="h-4 w-4 ml-1" />
              محرر المنيو
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ──────── KPI Cards ──────── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={kpi.label} custom={i} variants={fadeUp}>
                <Card className="glass-card border-0 p-0 overflow-hidden">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#d4a853]" />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                          kpi.trendUp
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {kpi.trendUp ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {kpi.trend}
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-[#f0ece4] mb-1">
                      {kpi.value}
                    </p>
                    <p className="text-xs sm:text-sm text-[#8a8578]">{kpi.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ──────── Revenue Chart ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#d4a853]" />
                <CardTitle className="text-lg font-bold text-[#f0ece4]">
                  الإيرادات اليومية
                </CardTitle>
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

        {/* ──────── Two Column Layout ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* ─── Left Column (RTL: appears right) ─── */}
          <div className="space-y-4 sm:space-y-6">
            {/* Top Dishes */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-[#d4a853]" />
                    <CardTitle className="text-lg font-bold text-[#f0ece4]">
                      الأطباق الأكثر طلباً
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topDishes.map((dish, i) => {
                    const maxOrders = topDishes[0].orders;
                    const pct = Math.round((dish.orders / maxOrders) * 100);
                    const isTop = i === 0;
                    return (
                      <motion.div
                        key={dish.name}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isTop
                            ? 'bg-[#d4a853]/10 border border-[#d4a853]/20'
                            : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        {/* Rank */}
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                            isTop
                              ? 'gold-gradient text-[#0a0a0f]'
                              : 'bg-white/[0.06] text-[#8a8578]'
                          }`}
                        >
                          {i + 1}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isTop ? 'text-[#d4a853]' : 'text-[#f0ece4]'
                              }`}
                            >
                              {dish.name}
                            </p>
                            <div className="text-left shrink-0 mr-2">
                              <p className="text-xs text-[#8a8578]">{dish.orders} طلب</p>
                              <p className="text-xs font-semibold text-[#f0ece4]">
                                {dish.revenue.toLocaleString('ar-SA')} ر.س
                              </p>
                            </div>
                          </div>
                          <Progress
                            value={pct}
                            className="h-1.5"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Peak Hours */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#d4a853]" />
                    <CardTitle className="text-lg font-bold text-[#f0ece4]">
                      أوقات الذروة
                    </CardTitle>
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
                          shape={(props: Record<string, unknown>) => {
                            const { x, y, width, height, payload } = props as {
                              x: number;
                              y: number;
                              width: number;
                              height: number;
                              payload: { hour: string };
                            };
                            const isPeak =
                              payload.hour === '8 م' ||
                              payload.hour === '9 م' ||
                              payload.hour === '10 م';
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
                          }}
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
          </div>

          {/* ─── Right Column (RTL: appears left) ─── */}
          <div className="space-y-4 sm:space-y-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-[#d4a853]" />
                    <CardTitle className="text-lg font-bold text-[#f0ece4]">
                      💡 رؤى الذكاء الاصطناعي
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {aiInsights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.08, duration: 0.4 }}
                      className={`p-3 rounded-xl border ${InsightBorder({ type: insight.type })} bg-white/[0.02]`}
                    >
                      <div className="flex gap-2.5">
                        <div className="mt-0.5">
                          <InsightIcon type={insight.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#f0ece4] mb-1">
                            {insight.title}
                          </p>
                          <p className="text-xs text-[#8a8578] leading-relaxed">
                            {insight.description}
                          </p>
                          {insight.action && (
                            <button className="mt-2 text-xs font-medium text-[#d4a853] border border-[#d4a853]/30 rounded-lg px-3 py-1.5 hover:bg-[#d4a853]/10 transition-colors">
                              {insight.action}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#d4a853]" />
                    <CardTitle className="text-lg font-bold text-[#f0ece4]">
                      إجراءات سريعة
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-semibold justify-center gap-2"
                    onClick={() => setView('menu-editor')}
                  >
                    <Lightbulb className="h-4 w-4" />
                    إنشاء وصف AI
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
                    onClick={() => setView('menu')}
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    عرض المنيو
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="w-full border-white/[0.08] text-[#8a8578] font-semibold justify-center gap-2 cursor-not-allowed"
                  >
                    <BarChart3 className="h-4 w-4" />
                    تقرير المبيعات
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}