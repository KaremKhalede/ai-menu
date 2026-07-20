export interface DishStat {
  dishId: string;
  dishName: string;
  clicks?: number;
  views?: number;
  cartAdds?: number;
  percentage: number;
}

export interface Hotspot {
  zone: string;
  count: number;
  percentage: number;
}

export interface AttentionZone {
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

export type ViewMode = 'clicks' | 'views' | 'cart';
