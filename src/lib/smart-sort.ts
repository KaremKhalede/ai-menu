import type { SortCriteria, Category, Dish } from './types';

/* ------------------------------------------------------------------ */
/*  Interfaces                                                         */
/* ------------------------------------------------------------------ */

export interface SmartSortResult {
  sortedCategories: Array<{
    categoryId: string;
    categoryName: string;
    dishes: Array<{
      dishId: string;
      dishName: string;
      score: number;
      rank: number;
      reason: string;
    }>;
  }>;
  insights: string[];
}

export interface DishPerformance {
  dishId: string;
  dishName: string;
  price: number;
  cost: number;
  profit: number;
  profitMargin: number;
  orderCount: number;
  revenue: number;
  rating: number;
  aiSuggestionRate: number;
  conversionRate: number;
  viewCount: number;
  cartAddCount: number;
}

/* ------------------------------------------------------------------ */
/*  Calculate dish performance metrics                                  */
/* ------------------------------------------------------------------ */

export function calculateDishPerformance(
  dishes: Dish[],
  orders: Array<{ dishId: string; quantity: number; totalPrice: number }> = [],
  analytics: Array<{
    dishId: string;
    viewCount: number;
    cartAddCount: number;
    aiSuggested: number;
  }> = []
): DishPerformance[] {
  // Aggregate order data per dish
  const orderMap = new Map<string, { count: number; revenue: number }>();
  for (const o of orders) {
    const existing = orderMap.get(o.dishId) ?? { count: 0, revenue: 0 };
    existing.count += o.quantity;
    existing.revenue += o.totalPrice;
    orderMap.set(o.dishId, existing);
  }

  const analyticsMap = new Map(analytics.map((a) => [a.dishId, a]));

  return dishes.map((d) => {
    const oData = orderMap.get(d.id) ?? { count: d.orderCount || 0, revenue: 0 };
    const aData = analyticsMap.get(d.id);

    const price = d.price;
    // Estimated cost is typically 30-35% of price for restaurants
    const cost = Math.round(price * (0.3 + Math.random() * 0.05));
    const profit = price - cost;
    const profitMargin = price > 0 ? profit / price : 0;
    const orderCount = oData.count;
    const revenue = oData.revenue || price * orderCount;
    const rating = d.rating || 4.0;
    const viewCount = aData?.viewCount ?? Math.round(orderCount * (2.5 + Math.random()));
    const cartAddCount = aData?.cartAddCount ?? Math.round(viewCount * (0.3 + Math.random() * 0.3));
    const conversionRate = viewCount > 0 ? cartAddCount / viewCount : 0;
    const aiSuggestionRate = aData ? aData.aiSuggested / Math.max(orderCount, 1) : 0.2 + Math.random() * 0.4;

    return {
      dishId: d.id,
      dishName: d.name,
      price,
      cost,
      profit,
      profitMargin,
      orderCount,
      revenue,
      rating,
      aiSuggestionRate,
      conversionRate,
      viewCount,
      cartAddCount,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Core scoring function                                              */
/* ------------------------------------------------------------------ */

function scoreDish(perf: DishPerformance, criteria: SortCriteria): number {
  switch (criteria) {
    case 'profitability':
      return perf.profitMargin;
    case 'popularity':
      return perf.orderCount;
    case 'rating':
      return perf.rating;
    case 'ai_recommended':
      return perf.aiSuggestionRate;
    case 'revenue':
      return perf.revenue;
    default:
      return perf.profitMargin;
  }
}

/* ------------------------------------------------------------------ */
/*  Generate Arabic reason for a dish's position                       */
/* ------------------------------------------------------------------ */

function generateReason(perf: DishPerformance, criteria: SortCriteria, rank: number): string {
  const reasons: Record<SortCriteria, string[]> = {
    profitability: [
      `هامش ربح ممتاز ${(perf.profitMargin * 100).toFixed(0)}% — كل طلب يحقق ${perf.profit} ريال ربح صافي`,
      `صنف مربح جداً بهامش ${(perf.profitMargin * 100).toFixed(0)}% ومبيعات ${perf.orderCount} طلب`,
      `يُحقّق أعلى ربحية: ${perf.profit} ريال ربح لكل وحدة`,
    ],
    popularity: [
      `الأكثر طلباً بواقع ${perf.orderCount} طلب — مفضّل الزبائن`,
      `شعبيته عالية جداً: ${perf.orderCount} طلب بتقييم ${perf.rating}`,
      `الطبق رقم واحد في الطلبات بـ ${perf.orderCount} طلب أسبوعياً`,
    ],
    rating: [
      `تقييم ممتاز ${perf.rating}/5 — الزبائن يحبّونه`,
      `أعلى تقييم في القائمة: ${perf.rating} من 5 نجوم`,
      `رضا عملاء عالي جداً بتقييم ${perf.rating}`,
    ],
    ai_recommended: [
      `نسبة اقتراح الذكاء الاصطناعي ${(perf.aiSuggestionRate * 100).toFixed(0)}% — يُنصح به بقوة`,
      `الذكاء الاصطناعي ينجح في اقتراحه بنسبة ${(perf.aiSuggestionRate * 100).toFixed(0)}%`,
      `أفضل نسبة تحويل من اقتراحات AI: ${(perf.aiSuggestionRate * 100).toFixed(0)}%`,
    ],
    revenue: [
      `أعلى إيرادات بقيمة ${perf.revenue.toLocaleString('ar-SA')} ريال`,
      `مساهم كبير في الإيرادات: ${perf.revenue.toLocaleString('ar-SA')} ريال من ${perf.orderCount} طلب`,
      `محرّك الإيرادات الأول: ${perf.revenue.toLocaleString('ar-SA')} ريال`,
    ],
  };

  const pool = reasons[criteria];
  return rank <= 2 ? pool[0] : pool[Math.min(rank % pool.length, pool.length - 1)];
}

/* ------------------------------------------------------------------ */
/*  Smart sort dishes                                                  */
/* ------------------------------------------------------------------ */

export function smartSortDishes(
  dishes: Dish[],
  criteria: SortCriteria,
  performance: DishPerformance[]
): SmartSortResult {
  const perfMap = new Map(performance.map((p) => [p.dishId, p]));

  // Normalize scores to 0-100
  const rawScores = dishes.map((d) => {
    const perf = perfMap.get(d.id);
    if (!perf) return { dish: d, raw: 0, perf: null as DishPerformance | null };
    return { dish: d, raw: scoreDish(perf, criteria), perf };
  });

  const maxRaw = Math.max(...rawScores.map((s) => s.raw), 1);

  const scored = rawScores
    .map((s) => ({
      dish: s.dish,
      score: s.raw > 0 ? (s.raw / maxRaw) * 100 : 0,
      perf: s.perf,
    }))
    .sort((a, b) => b.score - a.score);

  // Group by category
  const categoryMap = new Map<string, typeof scored>();
  for (const s of scored) {
    const catId = s.dish.categoryId;
    if (!categoryMap.has(catId)) categoryMap.set(catId, []);
    categoryMap.get(catId)!.push(s);
  }

  const sortedCategories: SmartSortResult['sortedCategories'] = [];

  for (const s of scored) {
    const catId = s.dish.categoryId;
    if (sortedCategories.find((c) => c.categoryId === catId)) continue;

    const catDishes = categoryMap.get(catId)!;
    sortedCategories.push({
      categoryId: catId,
      categoryName: catDishes[0]?.dish.name ? `فئة ${catId}` : catId,
      dishes: catDishes.map((cd, i) => ({
        dishId: cd.dish.id,
        dishName: cd.dish.name,
        score: Math.round(cd.score * 10) / 10,
        rank: i + 1,
        reason: cd.perf ? generateReason(cd.perf, criteria, i) : 'لا توجد بيانات كافية',
      })),
    });
  }

  // Resolve actual category names if possible
  // (caller can override via applySmartSort)

  return {
    sortedCategories,
    insights: getAutoSortInsights({ sortedCategories }),
  };
}

/* ------------------------------------------------------------------ */
/*  Get AI sort recommendation                                         */
/* ------------------------------------------------------------------ */

export function getSortRecommendation(
  performance: DishPerformance[]
): { criteria: SortCriteria; reason: string; score: number } {
  if (performance.length === 0) {
    return { criteria: 'popularity', reason: 'لا توجد بيانات كافية، يتم استخدام الطلب كمعيار افتراضي', score: 0 };
  }

  // Analyze data distribution
  const avgMargin = performance.reduce((s, p) => s + p.profitMargin, 0) / performance.length;
  const marginVariance = performance.reduce((s, p) => s + Math.pow(p.profitMargin - avgMargin, 2), 0) / performance.length;
  const avgOrders = performance.reduce((s, p) => s + p.orderCount, 0) / performance.length;
  const avgRevenue = performance.reduce((s, p) => s + p.revenue, 0) / performance.length;
  const avgRating = performance.reduce((s, p) => s + p.rating, 0) / performance.length;
  const avgAiRate = performance.reduce((s, p) => s + p.aiSuggestionRate, 0) / performance.length;

  // Score each criteria's potential impact
  const scores: { criteria: SortCriteria; score: number; reason: string }[] = [
    {
      criteria: 'profitability',
      score: marginVariance > 0.01 ? 85 : 50,
      reason: marginVariance > 0.01
        ? `هناك تفاوت كبير في هوامش الربح (المتوسط ${(avgMargin * 100).toFixed(0)}%). ترتيب حسب الربحية سيعزز الأرباح.`
        : 'هوامش الربح متقاربة نسبياً.',
    },
    {
      criteria: 'popularity',
      score: avgOrders > 50 ? 80 : 60,
      reason: avgOrders > 50
        ? `متوسط الطلبات ${Math.round(avgOrders)} طلب. الترتيب حسب الشعبية سيُحسّن تجربة المستخدم.`
        : 'حجم الطلبات منخفض، قد تحتاج لتعزيز الشعبية أولاً.',
    },
    {
      criteria: 'rating',
      score: avgRating > 4.5 ? 70 : 55,
      reason: avgRating > 4.5
        ? `التقييمات عالية (متوسط ${avgRating.toFixed(1)}). إبراز الأعلى تقييماً يبني ثقة.`
        : 'التقييمات متوسطة. يُنصح بتحسين الجودة قبل تغيير الترتيب.',
    },
    {
      criteria: 'ai_recommended',
      score: avgAiRate > 0.4 ? 90 : 45,
      reason: avgAiRate > 0.4
        ? `نسبة نجاح اقتراحات الذكاء الاصطناعي ${(avgAiRate * 100).toFixed(0)}% — ممتاز! الترتيب حسبها سيُزيد المبيعات.`
        : 'نسبة اقتراحات AI منخفضة. تحتاج لمزيد من البيانات.',
    },
    {
      criteria: 'revenue',
      score: avgRevenue > 2000 ? 88 : 50,
      reason: avgRevenue > 2000
        ? `متوسط الإيرادات ${Math.round(avgRevenue).toLocaleString('ar-SA')} ريال. الترتيب حسب الإيرادات يُعظم الدخل.`
        : 'الإيرادات متوسطة. ركّز على زيادة الطلبات أولاً.',
    },
  ];

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  return {
    criteria: best.criteria,
    reason: best.reason,
    score: best.score,
  };
}

/* ------------------------------------------------------------------ */
/*  Generate Arabic insights about the sort result                     */
/* ------------------------------------------------------------------ */

export function getAutoSortInsights(sortedResult: Pick<SmartSortResult, 'sortedCategories'>): string[] {
  const insights: string[] = [];

  // Count total dishes
  const totalDishes = sortedResult.sortedCategories.reduce(
    (sum, cat) => sum + cat.dishes.length,
    0
  );

  if (totalDishes === 0) return ['لا توجد بيانات كافية لإنشاء رؤى.'];

  // Top dish overall
  const allDishes = sortedResult.sortedCategories.flatMap((c) => c.dishes);
  if (allDishes.length > 0) {
    const top = allDishes[0];
    insights.push(
      `🏆 "${top.dishName}" يحتل المرتبة الأولى بنتيجة ${top.score} من 100`
    );
  }

  // Category with most dishes
  const catCounts = sortedResult.sortedCategories.map((c) => ({
    name: c.categoryName,
    count: c.dishes.length,
  }));
  const biggestCat = catCounts.sort((a, b) => b.count - a.count)[0];
  if (biggestCat) {
    insights.push(
      `📊 فئة "${biggestCat.name}" تضم أكبر عدد من الأصناف (${biggestCat.count} صنف)`
    );
  }

  // Performance spread
  if (allDishes.length >= 3) {
    const topScore = allDishes[0].score;
    const bottomScore = allDishes[allDishes.length - 1].score;
    const gap = topScore - bottomScore;
    if (gap > 40) {
      insights.push(
        `⚠️ فجوة أداء كبيرة (${gap.toFixed(0)} نقطة) بين أفضل وأضعف صنف. راجع الأصناف ذات الأداء المنخفض.`
      );
    } else if (gap < 15) {
      insights.push(
        `✅ أداء الأصناف متقارب (فجوة ${gap.toFixed(0)} نقطة فقط) — مستوى جيد!`
      );
    }
  }

  // Low performers (bottom 20%)
  if (allDishes.length >= 5) {
    const bottomCount = Math.max(1, Math.ceil(allDishes.length * 0.2));
    const bottomDishes = allDishes.slice(-bottomCount);
    const avgBottomScore =
      bottomDishes.reduce((s, d) => s + d.score, 0) / bottomDishes.length;
    if (avgBottomScore < 30) {
      insights.push(
        `📉 ${bottomCount} أصناف بسعر أقل من 30 نقطة — يُنصح بمراجعتها أو إزالتها`
      );
    }
  }

  // High performers (top 20%)
  if (allDishes.length >= 5) {
    const topCount = Math.max(1, Math.ceil(allDishes.length * 0.2));
    const topDishes = allDishes.slice(0, topCount);
    const avgTopScore =
      topDishes.reduce((s, d) => s + d.score, 0) / topDishes.length;
    if (avgTopScore > 80) {
      insights.push(
        `🌟 ${topCount} أصناف ممتازة بسعر أعلى من 80 نقطة — ضعها في مقدمة القائمة`
      );
    }
  }

  return insights;
}

/* ------------------------------------------------------------------ */
/*  Apply smart sort to original categories (reorder dishes in place)  */
/* ------------------------------------------------------------------ */

export function applySmartSort(
  categories: Category[],
  sortedResult: SmartSortResult
): Category[] {
  // Build a lookup: categoryId -> ordered dishIds
  const orderMap = new Map<string, string[]>();
  for (const cat of sortedResult.sortedCategories) {
    orderMap.set(cat.categoryId, cat.dishes.map((d) => d.dishId));
  }

  return categories.map((cat) => {
    const orderedIds = orderMap.get(cat.id);
    if (!orderedIds) return cat;

    // Create a map for O(1) lookup
    const dishMap = new Map(cat.dishes.map((d) => [d.id, d]));

    // Reorder dishes according to the smart sort, keeping any unsorted ones at the end
    const reordered: Dish[] = [];
    const seen = new Set<string>();

    for (const id of orderedIds) {
      const dish = dishMap.get(id);
      if (dish) {
        reordered.push(dish);
        seen.add(id);
      }
    }

    // Append dishes not in the sort result
    for (const dish of cat.dishes) {
      if (!seen.has(dish.id)) {
        reordered.push(dish);
      }
    }

    return { ...cat, dishes: reordered };
  });
}