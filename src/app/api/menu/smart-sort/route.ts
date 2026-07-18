import { NextRequest, NextResponse } from 'next/server';
import {
  calculateDishPerformance,
  smartSortDishes,
  getSortRecommendation,
  type SmartSortResult,
  type DishPerformance,
} from '@/lib/smart-sort';
import type { SortCriteria, Dish } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Demo dishes for testing                                            */
/* ------------------------------------------------------------------ */

const DEMO_DISHES: Dish[] = [
  { id: 'd1', name: 'كبسة لحم', description: 'كبسة لحم طازجة بالأرز البسمتي', price: 55, categoryId: 'cat1', rating: 4.8, orderCount: 245, tags: ['رئيسي'], isAvailable: true, isFeatured: true, addons: [{ name: 'سمنة إضافية', price: 5 }], pairings: ['سلطة خضراء', 'مشروب غازي'] },
  { id: 'd2', name: 'مندي دجاج', description: 'مندي دجاج بالحطب والأرز البني', price: 35, categoryId: 'cat1', rating: 4.6, orderCount: 198, tags: ['رئيسي'], isAvailable: true, isFeatured: false, addons: [{ name: 'دجاج إضافي', price: 10 }], pairings: ['سلطة', 'لبن'] },
  { id: 'd3', name: 'مضغوط لحم', description: 'مضغوط لحم ضاني مع خبز رقاق', price: 48, categoryId: 'cat1', rating: 4.7, orderCount: 132, tags: ['رئيسي'], isAvailable: true, isFeatured: true, addons: [], pairings: ['سلطة خضراء'] },
  { id: 'd4', name: 'برياني دجاج', description: 'برياني بالتوابل الهندية الأصلية', price: 42, categoryId: 'cat1', rating: 4.5, orderCount: 89, tags: ['رئيسي'], isAvailable: true, isFeatured: false, addons: [{ name: 'رايته', price: 8 }], pairings: ['رايته'] },
  { id: 'd5', name: 'مشاوي مشكّلة', description: 'تشكيلة مشاوي فاخر: لحم ودجاج وكفتة', price: 85, categoryId: 'cat2', rating: 4.9, orderCount: 176, tags: ['مشويات'], isAvailable: true, isFeatured: true, addons: [{ name: 'مشاوي إضافية', price: 25 }], pairings: ['مقبلات', 'مشروب'] },
  { id: 'd6', name: 'دجاج مشوي كامل', description: 'دجاج مشوي بالفرن مع البهارات', price: 45, categoryId: 'cat2', rating: 4.4, orderCount: 145, tags: ['مشويات'], isAvailable: true, isFeatured: false, addons: [], pairings: ['سلطة', 'خبز'] },
  { id: 'd7', name: 'ريش غنم مشوية', description: 'ريش غنم مشوية على الفحم', price: 95, categoryId: 'cat2', rating: 4.8, orderCount: 67, tags: ['مشويات'], isAvailable: true, isFeatured: true, addons: [], pairings: ['خبز طازج'] },
  { id: 'd8', name: 'فتة حمص', description: 'فتة حمص بالزبدة والصنوبر', price: 15, categoryId: 'cat3', rating: 4.3, orderCount: 152, tags: ['مقبلات'], isAvailable: true, isFeatured: false, addons: [{ name: 'لحم مفروم', price: 10 }], pairings: ['خبز'] },
  { id: 'd9', name: 'حمص بالطحينة', description: 'حمص بالطحينة وزيت الزيتون', price: 12, categoryId: 'cat3', rating: 4.2, orderCount: 203, tags: ['مقبلات'], isAvailable: true, isFeatured: false, addons: [], pairings: ['خبز عربي'] },
  { id: 'd10', name: 'متبل باذنجان', description: 'متبل باذنجان مشوي بالطحينة', price: 14, categoryId: 'cat3', rating: 4.1, orderCount: 98, tags: ['مقبلات'], isAvailable: true, isFeatured: false, addons: [], pairings: ['خبز'] },
  { id: 'd11', name: 'كنافة نابلسية', description: 'كنافة بالجبن والقشطة', price: 25, categoryId: 'cat4', rating: 4.7, orderCount: 134, tags: ['حلويات'], isAvailable: true, isFeatured: true, addons: [], pairings: ['شاي'] },
  { id: 'd12', name: 'بسبوسة', description: 'بسبوسة بالقشطة والفستق', price: 15, categoryId: 'cat4', rating: 4.0, orderCount: 87, tags: ['حلويات'], isAvailable: true, isFeatured: false, addons: [], pairings: ['قهوة'] },
  { id: 'd13', name: 'أم علي', description: 'أم علي بالمكسرات والكريمة', price: 20, categoryId: 'cat4', rating: 4.5, orderCount: 76, tags: ['حلويات'], isAvailable: true, isFeatured: false, addons: [{ name: 'كريمة إضافية', price: 5 }], pairings: ['شاي'] },
  { id: 'd14', name: 'شاي أحمر', description: 'شاي أحمر بالحليب والهيل', price: 8, categoryId: 'cat5', rating: 4.6, orderCount: 312, tags: ['مشروبات'], isAvailable: true, isFeatured: false, addons: [], pairings: ['حلويات'] },
  { id: 'd15', name: 'عصير برتقال طازج', description: 'عصير برتقال طبيعي 100%', price: 12, categoryId: 'cat5', rating: 4.4, orderCount: 189, tags: ['مشروبات'], isAvailable: true, isFeatured: false, addons: [], pairings: [] },
  { id: 'd16', name: 'قهوة عربية', description: 'قهوة عربية بالهيل والزعفران', price: 10, categoryId: 'cat5', rating: 4.3, orderCount: 267, tags: ['مشروبات'], isAvailable: true, isFeatured: true, addons: [], pairings: ['تمر'] },
];

/* ------------------------------------------------------------------ */
/*  Demo orders for performance calculation                           */
/* ------------------------------------------------------------------ */

const DEMO_ORDERS = DEMO_DISHES.map((d) => ({
  dishId: d.id,
  quantity: d.orderCount,
  totalPrice: d.price * d.orderCount,
}));

/* ------------------------------------------------------------------ */
/*  POST /api/menu/smart-sort                                         */
/* ------------------------------------------------------------------ */

const VALID_CRITERIA: SortCriteria[] = ['profitability', 'popularity', 'rating', 'ai_recommended', 'revenue'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const criteria: SortCriteria = VALID_CRITERIA.includes(body.criteria) ? body.criteria : 'profitability';
    const _restaurantId = body.restaurantId || 'demo';

    // Use demo dishes
    const dishes = DEMO_DISHES;

    // Calculate performance metrics
    const performance = calculateDishPerformance(dishes, DEMO_ORDERS);

    // Run smart sort
    const sortResult = smartSortDishes(dishes, criteria, performance);

    // Fix category names using a lookup
    const catNames: Record<string, string> = {
      cat1: 'أطباق رئيسية',
      cat2: 'مشويات',
      cat3: 'مقبلات',
      cat4: 'حلويات',
      cat5: 'مشروبات',
    };
    for (const cat of sortResult.sortedCategories) {
      cat.categoryName = catNames[cat.categoryId] || cat.categoryName;
    }

    // Get AI sort recommendation
    const recommendation = getSortRecommendation(performance);

    return NextResponse.json({
      criteria,
      sortedCategories: sortResult.sortedCategories,
      insights: sortResult.insights,
      recommendation,
      performanceSummary: {
        totalDishes: performance.length,
        avgProfitMargin: (performance.reduce((s, p) => s + p.profitMargin, 0) / performance.length * 100).toFixed(1) + '%',
        avgRating: (performance.reduce((s, p) => s + p.rating, 0) / performance.length).toFixed(1),
        totalRevenue: performance.reduce((s, p) => s + p.revenue, 0).toLocaleString('ar-SA') + ' ر.س',
      },
    });
  } catch (error) {
    console.error('Smart sort error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء ترتيب القائمة الذكي' },
      { status: 500 }
    );
  }
}