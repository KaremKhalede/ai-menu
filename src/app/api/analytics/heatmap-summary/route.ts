import { NextResponse } from 'next/server';

/**
 * GET /api/analytics/heatmap-summary
 *
 * Returns an aggregated heatmap summary.  In production this would query
 * the AnalyticsEvent table (type='heatmap') and compute real aggregations.
 * For the demo / SQLite prototype we return realistic mock data.
 */

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

interface HeatmapSummaryResponse {
  mostClickedDishes: DishStat[];
  mostViewedDishes: DishStat[];
  cartAddRate: DishStat[];
  scrollDepthAvg: number;
  scrollDepthDistribution: { range: string; count: number; percentage: number }[];
  topHotspots: Hotspot[];
  totalInteractions: number;
  averageViewDuration: number;
  mostActiveDish: { dishName: string; totalInteractions: number };
  attentionZones: { section: string; attention: number; description: string }[];
}

const mockResponse: HeatmapSummaryResponse = {
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
  mostActiveDish: {
    dishName: 'كبسة لحم',
    totalInteractions: 996,
  },
  attentionZones: [
    { section: 'الأطباق الرئيسية', attention: 94, description: 'أعلى نسبة اهتمام — يفضّل الزبائن تصفّح هذه الفئة أولاً' },
    { section: 'المشويات', attention: 78, description: 'اهتمام مرتفع — المنطقة الثانية الأكثر تفاعلاً' },
    { section: 'الحلويات', attention: 65, description: 'اهتمام متوسط-مرتفع — الكنافة تجذب معظم الانتباه' },
    { section: 'المشروبات', attention: 32, description: 'اهتمام منخفض — يُنصح بتحسين عرض هذا القسم' },
    { section: 'المقبلات', attention: 45, description: 'اهتمام متوسط — يمكن تحسينه بإبراز الأطباق المميزة' },
  ],
};

export async function GET() {
  // In production: query AnalyticsEvent table, parse JSON data arrays,
  // aggregate by dish, compute hotspots, etc.
  //
  // const events = await db.analyticsEvent.findMany({
  //   where: { type: 'heatmap' },
  //   orderBy: { createdAt: 'desc' },
  // });
  // ... aggregation logic ...

  return NextResponse.json(mockResponse);
}