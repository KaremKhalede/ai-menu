'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Eye,
  ShoppingCart,
  MousePointerClick,
  TrendingUp,
  Clock,
  BarChart3,
  Layers,
  ChevronDown,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface DishStat {
  dishId: string;
  dishName: string;
  clicks?: number;
  views?: number;
  cartAdds?: number;
  percentage: number;
}

interface Hotspot {
  zone: string;
  count: number;
  percentage: number;
}

interface AttentionZone {
  section: string;
  attention: number;
  description: string;
}

export interface HeatmapSummaryData {
  mostClickedDishes: DishStat[];
  mostViewedDishes: DishStat[];
  cartAddRate: DishStat[];
  scrollDepthAvg: number;
  scrollDepthDistribution: { range: string; count: number; percentage: number }[];
  topHotspots: Hotspot[];
  totalInteractions: number;
  averageViewDuration: number;
  mostActiveDish: { dishName: string; totalInteractions: number };
  attentionZones: AttentionZone[];
}

interface HeatmapViewerProps {
  /** Pre-computed summary data (for demo / SSR). Falls back to mock data. */
  data?: HeatmapSummaryData;
}

/* ═══════════════════════════════════════════════════════════════
   Default mock data (used when no `data` prop is provided)
   ═══════════════════════════════════════════════════════════════ */

const defaultData: HeatmapSummaryData = {
  mostClickedDishes: [
    { dishId: '1', dishName: 'كبسة لحم', clicks: 342, percentage: 18.5 },
    { dishId: '2', dishName: 'مندي دجاج', clicks: 287, percentage: 15.5 },
    { dishId: '3', dishName: 'مشاوي مشكّلة', clicks: 234, percentage: 12.7 },
    { dishId: '4', dishName: 'فتة حمص', clicks: 198, percentage: 10.7 },
    { dishId: '5', dishName: 'كنافة نابلسية', clicks: 176, percentage: 9.5 },
    { dishId: '6', dishName: 'مقلوبة', clicks: 152, percentage: 8.2 },
    { dishId: '7', dishName: 'شاورما عربي', clicks: 143, percentage: 7.7 },
    { dishId: '8', dishName: 'تبولة لبنانية', clicks: 118, percentage: 6.4 },
    { dishId: '9', dishName: 'حلاوة طحينية', clicks: 98, percentage: 5.3 },
    { dishId: '10', dishName: 'فلافل مقلية', clicks: 102, percentage: 5.5 },
  ],
  mostViewedDishes: [
    { dishId: '1', dishName: 'كبسة لحم', views: 456, percentage: 16.8 },
    { dishId: '2', dishName: 'مندي دجاج', views: 389, percentage: 14.3 },
    { dishId: '3', dishName: 'مشاوي مشكّلة', views: 312, percentage: 11.5 },
    { dishId: '5', dishName: 'كنافة نابلسية', views: 278, percentage: 10.2 },
    { dishId: '6', dishName: 'مقلوبة', views: 245, percentage: 9.0 },
    { dishId: '7', dishName: 'شاورما عربي', views: 234, percentage: 8.6 },
    { dishId: '4', dishName: 'فتة حمص', views: 210, percentage: 7.7 },
    { dishId: '8', dishName: 'تبولة لبنانية', views: 189, percentage: 7.0 },
    { dishId: '10', dishName: 'فلافل مقلية', views: 165, percentage: 6.1 },
    { dishId: '9', dishName: 'حلاوة طحينية', views: 142, percentage: 5.2 },
  ],
  cartAddRate: [
    { dishId: '1', dishName: 'كبسة لحم', cartAdds: 198, percentage: 23.4 },
    { dishId: '2', dishName: 'مندي دجاج', cartAdds: 165, percentage: 19.5 },
    { dishId: '3', dishName: 'مشاوي مشكّلة', cartAdds: 134, percentage: 15.8 },
    { dishId: '5', dishName: 'كنافة نابلسية', cartAdds: 112, percentage: 13.2 },
    { dishId: '6', dishName: 'مقلوبة', cartAdds: 87, percentage: 10.3 },
    { dishId: '7', dishName: 'شاورما عربي', cartAdds: 76, percentage: 9.0 },
    { dishId: '4', dishName: 'فتة حمص', cartAdds: 45, percentage: 5.3 },
    { dishId: '8', dishName: 'تبولة لبنانية', cartAdds: 30, percentage: 3.5 },
  ],
  scrollDepthAvg: 67,
  scrollDepthDistribution: [
    { range: '٠٪ – ٢٠٪', count: 1245, percentage: 8.2 },
    { range: '٢٠٪ – ٤٠٪', count: 2870, percentage: 18.9 },
    { range: '٤٠٪ – ٦٠٪', count: 3650, percentage: 24.1 },
    { range: '٦٠٪ – ٨٠٪', count: 4120, percentage: 27.2 },
    { range: '٨٠٪ – ١٠٠٪', count: 3280, percentage: 21.6 },
  ],
  topHotspots: [
    { zone: 'أعلى اليمين', count: 890, percentage: 32.4 },
    { zone: 'أسفل اليمين', count: 720, percentage: 26.2 },
    { zone: 'أعلى اليسار', count: 620, percentage: 22.6 },
    { zone: 'أسفل اليسار', count: 515, percentage: 18.8 },
  ],
  totalInteractions: 18482,
  averageViewDuration: 12,
  mostActiveDish: { dishName: 'كبسة لحم', totalInteractions: 996 },
  attentionZones: [
    { section: 'الأطباق الرئيسية', attention: 94, description: 'أعلى نسبة اهتمام — يفضّل الزبائن تصفّح هذه الفئة أولاً' },
    { section: 'المشويات', attention: 78, description: 'اهتمام مرتفع — المنطقة الثانية الأكثر تفاعلاً' },
    { section: 'الحلويات', attention: 65, description: 'اهتمام متوسط-مرتفع — الكنافة تجذب معظم الانتباه' },
    { section: 'المقبلات', attention: 45, description: 'اهتمام متوسط — يمكن تحسينه بإبراز الأطباق المميزة' },
    { section: 'المشروبات', attention: 32, description: 'اهتمام منخفض — يُنصح بتحسين عرض هذا القسم' },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' as const },
  }),
};

/* ═══════════════════════════════════════════════════════════════
   Color Helpers
   ═══════════════════════════════════════════════════════════════ */

/**
 * Returns a color based on intensity (0 = cold #2a2a3e, 1 = hot #d4a853).
 * Interpolates through blue → yellow → red.
 */
function heatColor(intensity: number): string {
  const t = Math.max(0, Math.min(1, intensity));

  if (t < 0.5) {
    // Cold blue (#2a2a3e) → warm yellow (#d4a853)
    const s = t * 2;
    const r = Math.round(42 + (212 - 42) * s);
    const g = Math.round(42 + (168 - 42) * s);
    const b = Math.round(62 + (83 - 62) * s);
    return `rgb(${r},${g},${b})`;
  } else {
    // Warm yellow (#d4a853) → hot red (#e74c3c)
    const s = (t - 0.5) * 2;
    const r = Math.round(212 + (231 - 212) * s);
    const g = Math.round(168 + (76 - 168) * s);
    const b = Math.round(83 + (60 - 83) * s);
    return `rgb(${r},${g},${b})`;
  }
}

function heatBgStyle(intensity: number): React.CSSProperties {
  const t = Math.max(0, Math.min(1, intensity));
  return {
    background: `radial-gradient(circle, ${heatColor(t)}88 0%, ${heatColor(t * 0.4)}22 70%, transparent 100%)`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   Heatmap Dot (for the visual heatmap overlay)
   ═══════════════════════════════════════════════════════════════ */

function HeatmapDot({
  x,
  y,
  intensity,
  size,
}: {
  x: number;
  y: number;
  intensity: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${heatColor(intensity)}cc 0%, ${heatColor(intensity)}44 50%, transparent 100%)`,
        filter: `blur(${Math.max(2, size * 0.15)}px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   Dish Heat Card
   ═══════════════════════════════════════════════════════════════ */

function DishHeatCard({
  dish,
  intensity,
  index,
  valueLabel,
}: {
  dish: DishStat;
  intensity: number;
  index: number;
  valueLabel: string;
}) {
  const barColor = heatColor(intensity);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="relative overflow-hidden rounded-xl p-3 border transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${heatColor(intensity)}0d 0%, rgba(18,18,26,0.6) 100%)`,
        borderColor: `${heatColor(intensity)}33`,
      }}
    >
      {/* Glow effect for high-intensity items */}
      {intensity > 0.7 && (
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 20%, ${heatColor(intensity)} 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: `${barColor}22`,
              color: barColor,
            }}
          >
            {index + 1}
          </div>
          <span className="text-sm font-semibold text-[#f0ece4] truncate">{dish.dishName}</span>
        </div>
        <span
          className="text-sm font-bold shrink-0 mr-2"
          style={{ color: barColor }}
        >
          {valueLabel}
        </span>
      </div>

      <div className="relative z-10">
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${barColor}, ${heatColor(Math.min(1, intensity + 0.15))})` }}
            initial={{ width: 0 }}
            animate={{ width: `${dish.percentage * 5}%` }} // scale up for visual impact
            transition={{ duration: 0.8, delay: index * 0.06, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#8a8578]">{dish.percentage}%</span>
          <span className="text-[10px] text-[#8a8578]">من إجمالي التفاعلات</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Mock Menu Layout for Visual Heatmap
   ═══════════════════════════════════════════════════════════════ */

function MockMenuHeatmap({ data }: { data: HeatmapSummaryData }) {
  // Generate heatmap dots based on hotspot data
  const dots = useMemo(() => {
    const result: { x: number; y: number; intensity: number; size: number }[] = [];

    // Top-right hotspot (highest)
    for (let i = 0; i < 12; i++) {
      result.push({
        x: 55 + Math.random() * 40,
        y: 5 + Math.random() * 40,
        intensity: 0.6 + Math.random() * 0.4,
        size: 30 + Math.random() * 50,
      });
    }

    // Bottom-right hotspot
    for (let i = 0; i < 10; i++) {
      result.push({
        x: 55 + Math.random() * 40,
        y: 50 + Math.random() * 45,
        intensity: 0.4 + Math.random() * 0.35,
        size: 25 + Math.random() * 40,
      });
    }

    // Top-left hotspot
    for (let i = 0; i < 8; i++) {
      result.push({
        x: 5 + Math.random() * 40,
        y: 5 + Math.random() * 40,
        intensity: 0.3 + Math.random() * 0.3,
        size: 20 + Math.random() * 35,
      });
    }

    // Bottom-left hotspot
    for (let i = 0; i < 6; i++) {
      result.push({
        x: 5 + Math.random() * 40,
        y: 50 + Math.random() * 45,
        intensity: 0.15 + Math.random() * 0.25,
        size: 18 + Math.random() * 30,
      });
    }

    return result;
  }, []);

  // Mock dish positions in the grid
  const mockDishes = useMemo(
    () => [
      { name: 'كبسة لحم', x: 60, y: 10, intensity: 1.0 },
      { name: 'مندي دجاج', x: 75, y: 10, intensity: 0.85 },
      { name: 'مشاوي مشكّلة', x: 60, y: 35, intensity: 0.72 },
      { name: 'فتة حمص', x: 75, y: 35, intensity: 0.6 },
      { name: 'كنافة نابلسية', x: 60, y: 60, intensity: 0.55 },
      { name: 'مقلوبة', x: 75, y: 60, intensity: 0.48 },
      { name: 'شاورما عربي', x: 15, y: 10, intensity: 0.45 },
      { name: 'تبولة لبنانية', x: 30, y: 10, intensity: 0.35 },
      { name: 'حلاوة طحينية', x: 15, y: 35, intensity: 0.3 },
      { name: 'فلافل مقلية', x: 30, y: 35, intensity: 0.28 },
    ],
    [],
  );

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0f]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)',
          backgroundSize: '20% 20%',
        }}
      />

      {/* Heatmap overlay dots */}
      {dots.map((dot, i) => (
        <HeatmapDot key={i} x={dot.x} y={dot.y} intensity={dot.intensity} size={dot.size} />
      ))}

      {/* Mock dish cards */}
      {mockDishes.map((dish, i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg px-2 py-1.5 text-[10px] font-medium border border-white/[0.08] backdrop-blur-sm"
          style={{
            left: `${dish.x}%`,
            top: `${dish.y}%`,
            width: '22%',
            background: `rgba(18,18,26,${0.5 + dish.intensity * 0.3})`,
            borderColor: `${heatColor(dish.intensity)}44`,
            color: heatColor(dish.intensity),
            transform: 'translate(-50%, 0)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
        >
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: heatColor(dish.intensity) }}
            />
            <span className="truncate">{dish.name}</span>
          </div>
        </motion.div>
      ))}

      {/* Corner labels */}
      <div className="absolute top-2 right-2 text-[10px] text-[#8a8578]/60 font-medium">أعلى اليمين</div>
      <div className="absolute top-2 left-2 text-[10px] text-[#8a8578]/60 font-medium">أعلى اليسار</div>
      <div className="absolute bottom-2 right-2 text-[10px] text-[#8a8578]/60 font-medium">أسفل اليمين</div>
      <div className="absolute bottom-2 left-2 text-[10px] text-[#8a8578]/60 font-medium">أسفل اليسار</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Scroll Depth Bar
   ═══════════════════════════════════════════════════════════════ */

function ScrollDepthChart({ distribution, avg }: { distribution: HeatmapSummaryData['scrollDepthDistribution']; avg: number }) {
  const maxCount = Math.max(...distribution.map((d) => d.count));

  return (
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
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.06]">
        <TrendingUp className="h-4 w-4 text-[#d4a853]" />
        <span className="text-xs text-[#8a8578]">متوسط عمق التمرير:</span>
        <span className="text-sm font-bold text-[#d4a853]">{avg}%</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main HeatmapViewer Component
   ═══════════════════════════════════════════════════════════════ */

type ViewMode = 'clicks' | 'views' | 'cart';

export default function HeatmapViewer({ data: propData }: HeatmapViewerProps) {
  const data = propData ?? defaultData;
  const [activeView, setActiveView] = useState<ViewMode>('clicks');

  // Choose the active dataset based on the toggle
  const activeDishes: DishStat[] = useMemo(() => {
    switch (activeView) {
      case 'clicks':
        return data.mostClickedDishes;
      case 'views':
        return data.mostViewedDishes;
      case 'cart':
        return data.cartAddRate;
    }
  }, [activeView, data]);

  const valueLabel = (dish: DishStat): string => {
    switch (activeView) {
      case 'clicks':
        return `${(dish.clicks ?? 0).toLocaleString('ar-SA')} نقر`;
      case 'views':
        return `${(dish.views ?? 0).toLocaleString('ar-SA')} مشاهدة`;
      case 'cart':
        return `${(dish.cartAdds ?? 0).toLocaleString('ar-SA')} إضافة`;
    }
  };

  const viewButtons: { key: ViewMode; label: string; icon: typeof MousePointerClick }[] = [
    { key: 'clicks', label: 'نقرات', icon: MousePointerClick },
    { key: 'views', label: 'مشاهدات', icon: Eye },
    { key: 'cart', label: 'إضافات للسلة', icon: ShoppingCart },
  ];

  const maxDishStat = activeDishes.length > 0 ? activeDishes[0].percentage : 1;

  return (
    <div dir="rtl" className="space-y-6">
      {/* ──────── Header ──────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold gold-gradient-text flex items-center gap-2">
            <Flame className="h-7 w-7 text-[#d4a853]" />
            خريطة حرارية
          </h2>
          <p className="text-sm text-[#8a8578] mt-1">
            تتبّع تفاعل الزبائن مع القائمة الرقمية في الوقت الحقيقي
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {viewButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeView === btn.key;
            return (
              <Button
                key={btn.key}
                size="sm"
                variant="ghost"
                onClick={() => setActiveView(btn.key)}
                className={cn(
                  'gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'gold-gradient text-[#0a0a0f] shadow-lg shadow-[#d4a853]/20'
                    : 'text-[#8a8578] hover:text-[#f0ece4] hover:bg-white/[0.04]',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {btn.label}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* ──────── KPI Summary Cards ──────── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {[
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
        ].map((kpi, i) => {
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
                  <p className={cn(
                    'font-bold text-[#f0ece4] mb-0.5',
                    i === 1 ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl',
                  )}>
                    {kpi.value}
                  </p>
                  <p className="text-[11px] text-[#8a8578]">{kpi.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ──────── Visual Heatmap + Dish List ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ─── Heatmap Visual ─── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
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

              {/* Color legend */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[10px] text-[#8a8578]">منخفض</span>
                <div className="flex h-2.5 w-32 rounded-full overflow-hidden">
                  {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((v, i) => (
                    <div key={i} className="flex-1" style={{ background: heatColor(v) }} />
                  ))}
                </div>
                <span className="text-[10px] text-[#8a8578]">مرتفع</span>
              </div>

              {/* Hotspot breakdown */}
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
        </motion.div>

        {/* ─── Dish Grid ─── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="glass-card border-0 overflow-hidden h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#d4a853]" />
                <CardTitle className="text-base font-bold text-[#f0ece4]">
                  {activeView === 'clicks' && 'الأطباق الأكثر نقرة'}
                  {activeView === 'views' && 'الأطباق الأكثر مشاهدة'}
                  {activeView === 'cart' && 'الأطباق الأكثر إضافة للسلة'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2.5"
                >
                  {activeDishes.map((dish, i) => (
                    <DishHeatCard
                      key={dish.dishId}
                      dish={dish}
                      intensity={dish.percentage / maxDishStat}
                      index={i}
                      valueLabel={valueLabel(dish)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ──────── Bottom Row: Scroll Depth + Attention Zones ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ─── Scroll Depth ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#d4a853]" />
                <CardTitle className="text-base font-bold text-[#f0ece4]">
                  عمق التمرير
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollDepthChart
                distribution={data.scrollDepthDistribution}
                avg={data.scrollDepthAvg}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Attention Zones ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#d4a853]" />
                <CardTitle className="text-base font-bold text-[#f0ece4]">
                  مناطق الاهتمام
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.attentionZones.map((zone, i) => (
                <motion.div
                  key={zone.section}
                  custom={i}
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="p-3 rounded-xl border transition-colors"
                  style={{
                    background: `linear-gradient(135deg, ${heatColor(zone.attention / 100)}0d 0%, rgba(18,18,26,0.4) 100%)`,
                    borderColor: `${heatColor(zone.attention / 100)}28`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[#f0ece4]">{zone.section}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold"
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
                        background: `linear-gradient(90deg, ${heatColor(zone.attention / 100 * 0.6)}, ${heatColor(zone.attention / 100)})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.attention}%` }}
                      transition={{ duration: 0.7, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}