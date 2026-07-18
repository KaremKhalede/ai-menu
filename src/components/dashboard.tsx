'use client';

import { useState } from 'react';
import {
  dailyRevenue,
  hourlyOrders,
  aiInsights,
  enhancedKPIs,
  aiRevenueKPIs,
  conversionFunnel,
  dropOffAnalysis,
} from '@/lib/demo-data';
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
  Settings,
  Sparkles,
  Flame,
  TrendingDownIcon,
  BrainCircuit,
  Zap,
  ArrowDownUp,
  UserCheck,
  MapPin,
  LayoutGrid,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ───────────────────── KPI Row 1 Config ───────────────────── */

const kpiRow1 = [
  {
    label: 'إجمالي الإيرادات',
    value: `${enhancedKPIs.totalRevenue.toLocaleString('ar-SA')} ر.س`,
    icon: DollarSign,
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'إجمالي الطلبات',
    value: `${enhancedKPIs.totalOrders}`,
    icon: ShoppingBag,
    trend: '+8%',
    trendUp: true,
  },
  {
    label: 'متوسط قيمة الطلب',
    value: `${enhancedKPIs.avgOrderValue} ر.س`,
    icon: Target,
    trend: '+5%',
    trendUp: true,
  },
  {
    label: 'نسبة التحويل',
    value: `${enhancedKPIs.conversionRate}%`,
    icon: Percent,
    trend: '-2%',
    trendUp: false,
  },
  {
    label: 'نسبة نجاح AI Upsell',
    value: `${enhancedKPIs.aiUpsellRate}%`,
    icon: Flame,
    trend: '+15%',
    trendUp: true,
    highlight: true as const,
  },
  {
    label: 'معدل التسرب',
    value: `${enhancedKPIs.dropOffRate}%`,
    icon: TrendingDownIcon,
    trend: '-3%',
    trendUp: true,
    invertTrend: true as const,
  },
];

/* ───────────────────── KPI Row 2 Config (AI Engine) ───────────────────── */

const kpiRow2 = [
  {
    label: 'إيرادات AI',
    value: `${aiRevenueKPIs.aiRevenueGenerated.toLocaleString('ar-SA')} ر.س`,
    icon: BrainCircuit,
    subtext: `من ${aiRevenueKPIs.totalAISuggestions} اقتراح`,
  },
  {
    label: 'تحسين الطلب بـ AI',
    value: `+${aiRevenueKPIs.aiLiftPercentage}%`,
    icon: TrendingUp,
    subtext: `${aiRevenueKPIs.avgOrderWithoutAI} → ${aiRevenueKPIs.avgOrderWithAI} ر.س`,
  },
  {
    label: 'اقتراحات AI',
    value: `${aiRevenueKPIs.totalAISuggestions.toLocaleString('ar-SA')}`,
    icon: Zap,
    subtext: `${aiRevenueKPIs.aiConversionRate}% معدل التحويل`,
  },
  {
    label: 'معدل تحويل AI',
    value: `${aiRevenueKPIs.aiConversionRate}%`,
    icon: Sparkles,
    subtext: `${Math.round(aiRevenueKPIs.aiConversionRate * aiRevenueKPIs.totalAISuggestions / 100)} تحويل`,
  },
];

/* ───────────────────── Custom Tooltips ───────────────────── */

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

/* ───────────────────── Insight Helpers ───────────────────── */

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

/* ───────────────────── Severity Helpers ───────────────────── */

function SeverityConfig(severity: 'high' | 'medium' | 'low') {
  switch (severity) {
    case 'high':
      return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400', label: 'مرتفع' };
    case 'medium':
      return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400', label: 'متوسط' };
    case 'low':
      return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'منخفض' };
  }
}

/* ═══════════════════════════════════════════════════════════════
   Dashboard Component
   ═══════════════════════════════════════════════════════════════ */

function DashboardAuthGuard({ children, user }: { children: React.ReactNode; user: { name?: string } | null }) {
  const { setView, isAuthenticated } = useStore();
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#1a1a2e] flex items-center justify-center">
          <BarChart3 className="h-10 w-10 text-[#d4a853]" />
        </div>
        <h2 className="text-2xl font-bold gold-gradient-text">لوحة التحكم</h2>
        <p className="text-muted-foreground max-w-sm">يجب تسجيل الدخول للوصول إلى لوحة التحكم وأدوات إدارة المطعم</p>
        <Button onClick={() => setView('login')} className="gold-gradient hover:opacity-90">
          تسجيل الدخول
        </Button>
        <Button variant="ghost" onClick={() => setView('landing')}>
          العودة للرئيسية
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}

const AuthGuard = DashboardAuthGuard;

/* ──────────────── Conversion Funnel Component ──────────────── */

function ConversionFunnelViz() {
  const maxCount = conversionFunnel[0].count;
  const barColors = [
    'from-[#d4a853] to-[#c49a45]',
    'from-[#c49a45] to-[#b08c3d]',
    'from-[#b08c3d] to-[#9a7a35]',
    'from-[#9a7a35] to-[#7a6229]',
    'from-[#7a6229] to-[#5e4c20]',
  ];

  return (
    <div className="space-y-2.5">
      {conversionFunnel.map((step, i) => {
        const widthPct = (step.count / maxCount) * 100;
        const dropOff = i > 0
          ? ((conversionFunnel[i - 1].count - step.count) / conversionFunnel[i - 1].count * 100).toFixed(1)
          : null;

        return (
          <div key={step.stage}>
            {/* Drop-off indicator */}
            {dropOff && (
              <div className="flex justify-center mb-1">
                <span className="text-[11px] font-medium text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full">
                  ↓ تسرب {dropOff}%
                </span>
              </div>
            )}
            {/* Bar */}
            <div className="relative group">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                style={{ width: `${widthPct}%`, transformOrigin: 'right' }}
                className={`h-11 rounded-xl bg-gradient-to-l ${barColors[i]} flex items-center justify-between px-4 relative overflow-hidden`}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-l from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm font-bold text-[#0a0a0f] z-10">{step.stage}</span>
                <div className="flex items-center gap-2 z-10">
                  <span className="text-xs font-semibold text-[#0a0a0f]/80">{step.count.toLocaleString('ar-SA')}</span>
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

/* ──────────────── Smart Sort Handler ──────────────── */

function handleSmartSort() {
  fetch('/api/menu/smart-sort', { method: 'POST' })
    .then((res) => res.json())
    .then(() => {
      // Optionally trigger a toast or state update
    })
    .catch(() => {
      // Silent fail for demo
    });
}

/* ═══════════════════════════════════════════════════════════════
   Main Dashboard Export
   ═══════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const { setView, isAuthenticated, user } = useStore();

  // Enhanced AI insights with 2 new entries
  const allInsights = [
    ...aiInsights,
    {
      type: 'success' as const,
      title: 'تحسن أداء اقتراحات AI',
      description: 'نسبة نجاح اقتراحات AI ارتفعت 15% هذا الأسبوع. النظام يتعلم من سلوك العملاء ويحسّن اقتراحاته تلقائياً.',
      action: 'عرض تقرير AI',
    },
    {
      type: 'success' as const,
      title: 'انخفاض معدل التسرب',
      description: 'معدل التسرب انخفض 3% بفضل تحسين واجهة تفاصيل الأطباق.',
      action: 'عرض تحليل التسرب',
    },
  ];

  return (
    <AuthGuard user={user}>
    <div dir="rtl" className="min-h-screen bg-[#0a0a0f] text-[#f0ece4] pb-12">
      {/* ══════════════ A. Top Bar ══════════════ */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gold-gradient flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-[#0a0a0f]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold gold-gradient-text">
                لوحة التحكم
              </h1>
              {user?.name && (
                <span className="hidden sm:block text-xs text-muted-foreground mr-2">
                  مرحباً، {user.name}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => setView('settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Button
              variant="outline"
              size="sm"
              className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] text-xs whitespace-nowrap shrink-0"
              onClick={() => setView('menu')}
            >
              <UtensilsCrossed className="h-3.5 w-3.5 ml-1" />
              المنيو
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] text-xs whitespace-nowrap shrink-0"
              onClick={() => setView('menu-editor')}
            >
              <LayoutGrid className="h-3.5 w-3.5 ml-1" />
              محرر المنيو
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] text-xs whitespace-nowrap shrink-0"
              onClick={() => setView('auto-menu-generator')}
            >
              <Sparkles className="h-3.5 w-3.5 ml-1" />
              توليد قائمة AI
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] text-xs whitespace-nowrap shrink-0"
              onClick={() => setView('heatmap')}
            >
              <MapPin className="h-3.5 w-3.5 ml-1" />
              خريطة حرارية
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] text-xs whitespace-nowrap shrink-0"
              onClick={() => setView('crm')}
            >
              <Users className="h-3.5 w-3.5 ml-1" />
              CRM
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* ══════════════ B. KPI Cards Row 1 — Main KPIs (6 cards) ══════════════ */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {kpiRow1.map((kpi, i) => {
            const Icon = kpi.icon;
            const isHighlight = (kpi as { highlight?: boolean }).highlight;
            const invertTrend = (kpi as { invertTrend?: boolean }).invertTrend;
            // For drop-off rate: -3% is actually good (less drop-off), so show green
            const isTrendPositive = invertTrend ? kpi.trendUp : kpi.trendUp;

            return (
              <motion.div key={kpi.label} custom={i} variants={fadeUp}>
                <Card className={`glass-card border-0 p-0 overflow-hidden ${isHighlight ? 'ring-1 ring-[#d4a853]/30' : ''}`}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isHighlight ? 'bg-[#d4a853]/20' : 'bg-[#d4a853]/10'}`}>
                        <Icon className={`h-4.5 w-4.5 ${isHighlight ? 'text-[#e8c47c]' : 'text-[#d4a853]'}`} />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          isTrendPositive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {isTrendPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {kpi.trend}
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-[#f0ece4] mb-0.5 leading-tight">
                      {kpi.value}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8a8578] truncate">{kpi.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ══════════════ C. KPI Cards Row 2 — AI Engine KPIs (4 cards) ══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="h-4 w-4 text-[#d4a853]" />
            <h2 className="text-sm font-bold text-[#d4a853]">محرك إيرادات الذكاء الاصطناعي</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {kpiRow2.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                >
                  <Card className="glass-card border-0 p-0 overflow-hidden">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-8 w-8 rounded-lg bg-[#d4a853]/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-[#d4a853]" />
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#8a8578]">{kpi.label}</p>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-[#f0ece4] mb-0.5 leading-tight">
                        {kpi.value}
                      </p>
                      {kpi.subtext && (
                        <p className="text-[10px] sm:text-xs text-[#8a8578]/70">{kpi.subtext}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════ D. Revenue Chart ══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
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

        {/* ══════════════ E. Two Column Layout ══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* ─── LEFT Column (RTL: appears right) ─── */}
          <div className="space-y-4 sm:space-y-6">

            {/* Conversion Funnel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <ArrowDownUp className="h-5 w-5 text-[#d4a853]" />
                    <CardTitle className="text-lg font-bold text-[#f0ece4]">
                      قمع التحويل
                    </CardTitle>
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

            {/* Peak Hours */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
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
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          shape={((props: any) => {
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
          </div>

          {/* ─── RIGHT Column (RTL: appears left) ─── */}
          <div className="space-y-4 sm:space-y-6">

            {/* AI Insights (enhanced with 2 more) */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
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
                <CardContent className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {allInsights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.06, duration: 0.4 }}
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

            {/* Drop-off Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-[#d4a853]" />
                    <CardTitle className="text-lg font-bold text-[#f0ece4]">
                      تحليل التسرب
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dropOffAnalysis.map((item, i) => {
                    const sev = SeverityConfig(item.severity);
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
                            <span className={`text-[10px] ${sev.color} ${sev.bg} px-1.5 py-0.5 rounded-full`}>
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

            {/* Quick Actions (enhanced) */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.25, duration: 0.5 }}
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
                <CardContent className="space-y-2.5">
                  <Button
                    className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-semibold justify-center gap-2"
                    onClick={() => setView('auto-menu-generator')}
                  >
                    <Sparkles className="h-4 w-4" />
                    توليد قائمة بالذكاء الاصطناعي
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
                    className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
                    onClick={() => setView('heatmap')}
                  >
                    <MapPin className="h-4 w-4" />
                    خريطة حرارية
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
                    onClick={() => setView('crm')}
                  >
                    <UserCheck className="h-4 w-4" />
                    CRM وإعادة استهداف
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
                    onClick={handleSmartSort}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                    ترتيب ذكي للمنيو
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}