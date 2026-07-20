'use client';

import { useState, useMemo } from 'react';
import { MousePointerClick, Eye, ShoppingCart } from 'lucide-react';
import type { HeatmapSummaryData, DishStat, ViewMode } from '../types';

export function useHeatmap(data: HeatmapSummaryData) {
  const [activeView, setActiveView] = useState<ViewMode>('clicks');

  const activeDishes = useMemo(() => {
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

  const viewButtons = [
    { key: 'clicks' as ViewMode, label: 'نقرات', icon: MousePointerClick },
    { key: 'views' as ViewMode, label: 'مشاهدات', icon: Eye },
    { key: 'cart' as ViewMode, label: 'إضافات للسلة', icon: ShoppingCart },
  ];

  const maxDishStat = useMemo(() => {
    return activeDishes.length > 0 ? activeDishes[0].percentage : 1;
  }, [activeDishes]);

  const activeTitle = useMemo(() => {
    switch (activeView) {
      case 'clicks':
        return 'الأطباق الأكثر نقرة';
      case 'views':
        return 'الأطباق الأكثر مشاهدة';
      case 'cart':
        return 'الأطباق الأكثر إضافة للسلة';
    }
  }, [activeView]);

  return {
    activeView,
    setActiveView,
    activeDishes,
    valueLabel,
    viewButtons,
    maxDishStat,
    activeTitle,
  };
}
