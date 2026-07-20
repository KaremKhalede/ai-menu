import {
  DollarSign,
  ShoppingBag,
  Percent,
  Target,
  Flame,
  TrendingDownIcon,
  BrainCircuit,
  TrendingUp,
  Zap,
  Sparkles,
} from 'lucide-react';
import {
  enhancedKPIs,
  aiRevenueKPIs,
  aiInsights,
} from '@/lib/demo-data';
import type { KpiRow1Item, KpiRow2Item } from '../types';
import type { AIInsight } from '@/lib/types';

export const KPI_ROW1: KpiRow1Item[] = [
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
    highlight: true,
  },
  {
    label: 'معدل التسرب',
    value: `${enhancedKPIs.dropOffRate}%`,
    icon: TrendingDownIcon,
    trend: '-3%',
    trendUp: true,
    invertTrend: true,
  },
];

export const KPI_ROW2: KpiRow2Item[] = [
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

/** Two extra AI-performance insights appended to the base list. */
const EXTRA_AI_INSIGHTS: AIInsight[] = [
  {
    type: 'success',
    title: 'تحسن أداء اقتراحات AI',
    description: 'نسبة نجاح اقتراحات AI ارتفعت 15% هذا الأسبوع. النظام يتعلم من سلوك العملاء ويحسّن اقتراحاته تلقائياً.',
    action: 'عرض تقرير AI',
  },
  {
    type: 'success',
    title: 'انخفاض معدل التسرب',
    description: 'معدل التسرب انخفض 3% بفضل تحسين واجهة تفاصيل الأطباق.',
    action: 'عرض تحليل التسرب',
  },
];

/** Full insight list = base from demo-data + 2 extra — matches original component logic. */
export const ALL_INSIGHTS: AIInsight[] = [...aiInsights, ...EXTRA_AI_INSIGHTS];
