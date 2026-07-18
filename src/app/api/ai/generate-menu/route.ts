import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import type { Category, Dish } from '@/lib/types';

/* ───────────────────── System Prompt ───────────────────── */

const SYSTEM_PROMPT = `أنت خبير في إنشاء قوائم المطاعم. مهمتك هي توليد قائمة طعام كاملة بناءً على نوع المطعم والمطبخ المحدد.

قواعد مهمة:
1. أسماء الأطباق والوصف يجب أن تكون باللغة العربية الجذابة والشهية
2. الأسماء الإنجليزية (nameEn) يجب أن تكون ترجمة دقيقة
3. الأسعار يجب أن تكون مناسبة للسوق السعودي (بالريال السعودي)
4. التقييمات بين 3.5 و 5.0
5. كل فئة يجب أن تحتوي على 3-5 أطباق على الأقل
6. 1-2 طبق مميز (isFeatured: true) لكل فئة
7. كل طبق يجب أن يحتوي على 2-3 إضافات (addons)
8. كل طبق يجب أن يحتوي على 1-2 اقتراحات تقديم (pairings)
9. الوصف يجب أن يكون جملتين جذابتين ومغرية باللغة العربية
10. استخدم إيموجي طعام مناسب لأيقونة كل فئة
11. الأسعار تعتمد على مستوى السعر:
   - اقتصادي: 5-25 ر.س
   - متوسط: 20-60 ر.س
   - فاخر: 50-120 ر.س
   - بريميوم: 100-300+ ر.س

يجب أن ترجع JSON فقط بدون أي نص إضافي أو markdown. الجواب يجب أن يكون JSON صالح.`;

function buildUserPrompt(req: {
  restaurantType: string;
  cuisine: string;
  priceRange: string;
  numberOfCategories: number;
  dishesPerCategory?: number;
  currency?: string;
  specialRequirements?: string;
}): string {
  const priceLabels: Record<string, string> = {
    budget: 'اقتصادي (5-25 ر.س)',
    medium: 'متوسط (20-60 ر.س)',
    premium: 'فاخر (50-120 ر.س)',
    luxury: 'بريميوم (100-300+ ر.س)',
  };

  return `أنشئ قائمة طعام كاملة للمطعم التالي:
- نوع المطعم: ${req.restaurantType}
- المطبخ: ${req.cuisine}
- مستوى الأسعار: ${priceLabels[req.priceRange] || req.priceRange}
- عدد الأقسام: ${req.numberOfCategories}
${req.dishesPerCategory ? `- عدد الأطباق لكل قسم: ${req.dishesPerCategory}` : '- عدد الأطباق لكل قسم: 4'}
${req.specialRequirements ? `- متطلبات خاصة: ${req.specialRequirements}` : ''}

أرجع JSON بالشكل التالي فقط:
{
  "restaurantName": "اسم المطعم المقترح",
  "categories": [
    {
      "name": "اسم القسم بالعربي",
      "nameEn": "Category name in English",
      "icon": "إيموجي مناسب",
      "sortOrder": 0,
      "dishes": [
        {
          "name": "اسم الطبق بالعربي",
          "nameEn": "Dish name in English",
          "description": "وصف جذاب من جملتين بالعربي يفتح الشهية",
          "price": 35,
          "rating": 4.5,
          "orderCount": 0,
          "tags": ["وسيط", "شائع"],
          "isAvailable": true,
          "isFeatured": true,
          "addons": [
            {"name": "اسم الإضافة", "price": 5}
          ],
          "pairings": ["مشروب مقترح 1", "حلوى مقترحة"]
        }
      ]
    }
  ]
}`;
}

/* ───────────────────── Fallback Menu ───────────────────── */

function generateFallbackMenu(): { restaurantName: string; categories: Category[] } {
  const dishes: Dish[] = [
    {
      id: crypto.randomUUID(),
      name: 'كبسة لحم',
      nameEn: 'Lamb Kabsa',
      description: 'كبسة لحم طازجة مطهوة ببطء مع البهارات العربية الأصيلة والأرز البسمتي العطري. تقدم مع المكسرات المحمصة والسلة الطازجة.',
      price: 55,
      categoryId: 'cat-1',
      rating: 4.8,
      orderCount: 0,
      tags: ['الأكثر طلباً', 'وجبة رئيسية'],
      isAvailable: true,
      isFeatured: true,
      addons: [
        { name: 'إضافة لحم إضافي', price: 15 },
        { name: 'سلطة طازجة', price: 8 },
        { name: 'مشروب غازي', price: 5 },
      ],
      pairings: ['عصير ليمون بالنعناع', 'سلطة خضراء'],
    },
    {
      id: crypto.randomUUID(),
      name: 'مندي دجاج',
      nameEn: 'Chicken Mandi',
      description: 'مندي دجاج تقليدي معروف بنكهاته العميقة والمدخّنة. أرز بسمتي مطهو مع الدجاج على الحطب بطريقة يمنية أصيلة.',
      price: 45,
      categoryId: 'cat-1',
      rating: 4.6,
      orderCount: 0,
      tags: ['تقليدي', 'مميز'],
      isAvailable: true,
      isFeatured: false,
      addons: [
        { name: 'حمص بالطحينة', price: 6 },
        { name: 'دقوس', price: 4 },
      ],
      pairings: ['لبن زبادي', 'مقبلات مشكلة'],
    },
    {
      id: crypto.randomUUID(),
      name: 'برجر لحم أنغوس',
      nameEn: 'Angus Beef Burger',
      description: 'برجر لحم أنغوس مشوي على الفحم مع جبنة شيدر ذائبة وصلصة خاصة سرية. يقدم في خبز بريوش محمص مع بطاطس مقرمشة.',
      price: 38,
      categoryId: 'cat-2',
      rating: 4.7,
      orderCount: 0,
      tags: ['شائع', 'مشوي'],
      isAvailable: true,
      isFeatured: true,
      addons: [
        { name: 'جبنة إضافية', price: 5 },
        { name: 'بيض مقلي', price: 4 },
        { name: 'بكون مدخن', price: 8 },
      ],
      pairings: ['بطاطس مقلية', 'ميلك شيك'],
    },
    {
      id: crypto.randomUUID(),
      name: 'شاورما عربي',
      nameEn: 'Arabic Shawarma',
      description: 'شاورما لحم غنم مشوية على السيخ الدوار مع البهارات الشرقية. تقدم في خبز صاج طازج مع الثوم والمخللات.',
      price: 28,
      categoryId: 'cat-2',
      rating: 4.5,
      orderCount: 0,
      tags: ['سريع', 'شعبي'],
      isAvailable: true,
      isFeatured: false,
      addons: [
        { name: 'جبن', price: 3 },
        { name: 'حواتش', price: 2 },
      ],
      pairings: ['عصير برتقال طبيعي', 'حمص بالطحينة'],
    },
    {
      id: crypto.randomUUID(),
      name: 'مشروب القهوة العربية',
      nameEn: 'Arabic Coffee',
      description: 'قهوة عربية أصيلة محمصة يدوياً مع الهيل والزعفران. تقدم مع التمر الفاخر في فنجان الدلة التقليدي.',
      price: 12,
      categoryId: 'cat-3',
      rating: 4.9,
      orderCount: 0,
      tags: ['تقليدي', 'مشروبات'],
      isAvailable: true,
      isFeatured: true,
      addons: [
        { name: 'تمر إضافي', price: 5 },
      ],
      pairings: ['تمر فاخر', 'كنافة'],
    },
    {
      id: crypto.randomUUID(),
      name: 'سموذي مانجو',
      nameEn: 'Mango Smoothie',
      description: 'سموذي مانجو طازج كريمي مصنوع من المانجو الهندية الناضجة. ممزوج مع الحليب الطازج وقليل من العسل الطبيعي.',
      price: 18,
      categoryId: 'cat-3',
      rating: 4.4,
      orderCount: 0,
      tags: ['بارد', 'صحي'],
      isAvailable: true,
      isFeatured: false,
      addons: [
        { name: 'توفو بروتين', price: 5 },
        { name: 'عسل طبيعي', price: 3 },
      ],
      pairings: ['حلى خفيف'],
    },
    {
      id: crypto.randomUUID(),
      name: 'كنافة نابلسية',
      nameEn: 'Nabulsi Kunafa',
      description: 'كنافة نابلسية ساخنة بالجبن العكادي مع شراب الزهر الطبيعي. عجينة الكنافة مقرمشة ومحمصة بشكل مثالي.',
      price: 22,
      categoryId: 'cat-4',
      rating: 4.8,
      orderCount: 0,
      tags: ['حلويات', 'مميز'],
      isAvailable: true,
      isFeatured: true,
      addons: [
        { name: 'آيس كريم فانيلا', price: 7 },
        { name: 'صوص شوكولاتة', price: 4 },
      ],
      pairings: ['قهوة عربية', 'شاي أخضر'],
    },
    {
      id: crypto.randomUUID(),
      name: 'مقبلات مشكلة',
      nameEn: 'Mixed Appetizers Platter',
      description: 'طبق مقبلات فاخر يحتوي على حمص بالطحينة، متبل، فول مدمس، زيتون، ومخللات متنوعة. مثالي للمشاركة مع العائلة والأصدقاء.',
      price: 35,
      categoryId: 'cat-5',
      rating: 4.6,
      orderCount: 0,
      tags: ['مقبلات', 'مشترك'],
      isAvailable: true,
      isFeatured: true,
      addons: [
        { name: 'خبز إضافي', price: 4 },
        { name: 'جبن أبيض', price: 8 },
      ],
      pairings: ['شاورما', 'مشروب بارد'],
    },
  ];

  const cat1Id = 'cat-1';
  const cat2Id = 'cat-2';
  const cat3Id = 'cat-3';
  const cat4Id = 'cat-4';
  const cat5Id = 'cat-5';

  const categories: Category[] = [
    {
      id: cat1Id,
      name: 'أطباق رئيسية',
      nameEn: 'Main Dishes',
      icon: '🍽️',
      sortOrder: 0,
      dishes: dishes.filter((d) => d.categoryId === cat1Id).map((d) => ({ ...d, categoryId: cat1Id })),
    },
    {
      id: cat2Id,
      name: 'ساندويتشات وبرجر',
      nameEn: 'Sandwiches & Burgers',
      icon: '🍔',
      sortOrder: 1,
      dishes: dishes.filter((d) => d.categoryId === cat2Id).map((d) => ({ ...d, categoryId: cat2Id })),
    },
    {
      id: cat3Id,
      name: 'مشروبات',
      nameEn: 'Beverages',
      icon: '🥤',
      sortOrder: 2,
      dishes: dishes.filter((d) => d.categoryId === cat3Id).map((d) => ({ ...d, categoryId: cat3Id })),
    },
    {
      id: cat4Id,
      name: 'حلويات',
      nameEn: 'Desserts',
      icon: '🍮',
      sortOrder: 3,
      dishes: dishes.filter((d) => d.categoryId === cat4Id).map((d) => ({ ...d, categoryId: cat4Id })),
    },
    {
      id: cat5Id,
      name: 'مقبلات',
      nameEn: 'Appetizers',
      icon: '🥗',
      sortOrder: 4,
      dishes: dishes.filter((d) => d.categoryId === cat5Id).map((d) => ({ ...d, categoryId: cat5Id })),
    },
  ];

  return {
    restaurantName: 'مطعم الأصالة',
    categories,
  };
}

/* ───────────────────── Response Validation ───────────────────── */

interface GeneratedDish {
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  rating?: number;
  orderCount?: number;
  tags?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  addons?: Array<{ name: string; price: number }>;
  pairings?: string[];
}

interface GeneratedCategory {
  name: string;
  nameEn?: string;
  icon?: string;
  sortOrder?: number;
  dishes: GeneratedDish[];
}

interface GeneratedMenu {
  restaurantName?: string;
  categories: GeneratedCategory[];
}

function validateAndTransform(data: GeneratedMenu): { restaurantName: string; categories: Category[] } {
  const restaurantName = data.restaurantName || 'مطعمي';

  const categories: Category[] = (data.categories || []).map((cat, catIndex) => {
    const catId = crypto.randomUUID();
    const dishes: Dish[] = (cat.dishes || []).map((dish) => ({
      id: crypto.randomUUID(),
      name: dish.name || 'طبق بدون اسم',
      nameEn: dish.nameEn || '',
      description: dish.description || '',
      price: typeof dish.price === 'number' ? dish.price : 0,
      categoryId: catId,
      rating: typeof dish.rating === 'number' ? Math.min(5, Math.max(3.5, dish.rating)) : 4.5,
      orderCount: dish.orderCount || 0,
      tags: Array.isArray(dish.tags) ? dish.tags : [],
      isAvailable: dish.isAvailable !== false,
      isFeatured: dish.isFeatured === true,
      addons: Array.isArray(dish.addons)
        ? dish.addons.map((a) => ({ name: a.name || '', price: typeof a.price === 'number' ? a.price : 0 }))
        : [],
      pairings: Array.isArray(dish.pairings) ? dish.pairings : [],
    }));

    return {
      id: catId,
      name: cat.name || `قسم ${catIndex + 1}`,
      nameEn: cat.nameEn || '',
      icon: cat.icon || '🍽️',
      sortOrder: typeof cat.sortOrder === 'number' ? cat.sortOrder : catIndex,
      dishes,
    };
  });

  return { restaurantName, categories };
}

/* ───────────────────── POST Handler ───────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      restaurantType,
      cuisine,
      priceRange,
      numberOfCategories,
      dishesPerCategory = 4,
      currency = 'ر.س',
      language = 'ar',
      specialRequirements = '',
    } = body;

    if (!restaurantType) {
      return NextResponse.json(
        { error: 'يرجى تحديد نوع المطعم' },
        { status: 400 }
      );
    }

    // Try AI generation
    try {
      const zai = await ZAI.create();

      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        {
          role: 'user' as const,
          content: buildUserPrompt({
            restaurantType,
            cuisine: cuisine || 'عربي عام',
            priceRange: priceRange || 'medium',
            numberOfCategories: numberOfCategories || 5,
            dishesPerCategory,
            currency,
            specialRequirements,
          }),
        },
      ];

      const completion = await zai.chat.completions.create({
        model: 'glm-4-flash',
        messages,
      });

      const responseText =
        completion?.choices?.[0]?.message?.content ||
        completion?.message?.content ||
        (typeof completion === 'string' ? completion : null);

      if (responseText) {
        // Try to extract JSON from the response
        let jsonStr = responseText.trim();

        // Remove markdown code blocks if present
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1].trim();
        }

        // Try to find JSON object
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(jsonStr) as GeneratedMenu;

        // Validate that we have categories with dishes
        if (parsed.categories && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
          const result = validateAndTransform(parsed);
          return NextResponse.json(result);
        }
      }
    } catch (llmError) {
      console.error('AI generation failed, using fallback:', llmError);
    }

    // Fallback: return hardcoded sample menu
    const fallback = generateFallbackMenu();
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('Generate menu error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء توليد القائمة' },
      { status: 500 }
    );
  }
}