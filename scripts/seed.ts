import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 جاري زراعة البيانات...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.category.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.analyticsEvent.deleteMany();

  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'كافيه ليلو',
      nameEn: 'Café Lilou',
      description: 'تجربة فرنسية فاخرة',
      theme: 'luxury',
      currency: 'SAR',
    },
  });
  console.log(`✅ تم إنشاء المطعم: ${restaurant.name}`);

  // Create categories
  const categoriesData = [
    { name: 'فطور', nameEn: 'Breakfast', icon: '☕', sortOrder: 1 },
    { name: 'مقبلات', nameEn: 'Appetizers', icon: '🥗', sortOrder: 2 },
    { name: 'سلطات', nameEn: 'Salads', icon: '🥬', sortOrder: 3 },
    { name: 'مشروبات ساخنة', nameEn: 'Hot Drinks', icon: '🍵', sortOrder: 4 },
    { name: 'حلويات', nameEn: 'Desserts', icon: '🍰', sortOrder: 5 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        nameEn: cat.nameEn,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        restaurantId: restaurant.id,
      },
    });
    categories[cat.name] = created.id;
    console.log(`  ✅ تم إنشاء التصنيف: ${cat.name}`);
  }

  // Create dishes
  const dishesData = [
    // فطور (Breakfast) - 4 dishes
    {
      name: 'كرواسون زبدة فرنسي',
      nameEn: 'French Butter Croissant',
      description: 'كرواسون طازج محضر يومياً من الزبدة الفرنسية الفاخرة مع قشرة ذهبية مقرمشة',
      price: 18,
      categoryId: categories['فطور'],
      rating: 4.8,
      orderCount: 234,
      tags: '["طازج يومياً","فرنسي","مقترح الشيف"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"جبن كريمية","price":8},{"name":"شوكولاتة","price":10},{"name":"عسل طبيعي","price":7}]',
      pairings: '["لاتيه","كابتشينو","عصير برتقال طازج"]',
    },
    {
      name: 'أومليت بالخضروات والجبن',
      nameEn: 'Vegetable & Cheese Omelette',
      description: 'أومليت ريفي غني بالخضروات الطازجة وجبن الشيدر الذائبة مع أعشاب عطرية',
      price: 32,
      categoryId: categories['فطور'],
      rating: 4.6,
      orderCount: 189,
      tags: '["بروتين","صحي","غني"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"لحم مقدد","price":12},{"name":"فطر","price":6},{"name":"أفوكادو","price":9}]',
      pairings: '["قهوة أمريكانو","عصير تفاح"]',
    },
    {
      name: 'توست فرنسي بالقرفة',
      nameEn: 'Cinnamon French Toast',
      description: 'شرائح خبز بrioche مغمورة في خليط البيض والقرفة مع شراب القيقب والتوت الطازج',
      price: 28,
      categoryId: categories['فطور'],
      rating: 4.9,
      orderCount: 312,
      tags: '["حلو","مقترح الشيف","الأكثر طلباً"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"آيس كريم فانيلا","price":10},{"name":"مكسرات مشكلة","price":8}]',
      pairings: '["كابتشينو","شوكولاتة ساخنة"]',
    },
    {
      name: 'بان كيك بالتوت الأزرق',
      nameEn: 'Blueberry Pancakes',
      description: 'بان كيك ناعم ولذيذ مع التوت الأزرق الطازج وشراب القيقب وكريمة مخفوقة',
      price: 34,
      categoryId: categories['فطور'],
      rating: 4.7,
      orderCount: 156,
      tags: '["حلو","أمريكي"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"شوكولاتة","price":10},{"name":"موز","price":5},{"name":"نوتيلا","price":8}]',
      pairings: '["لاتيه","شاي أخضر"]',
    },

    // مقبلات (Appetizers) - 3 dishes
    {
      name: 'بريوش مع جبن ومربى',
      nameEn: 'Brioche with Cheese & Jam',
      description: 'بريوش فرنسي دافئ مع تشكيلة جبن فاخرة ومربى التوت المحلي الصنع',
      price: 24,
      categoryId: categories['مقبلات'],
      rating: 4.5,
      orderCount: 98,
      tags: '["فرنسي","كلاسيكي"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"زبدة إضافية","price":5},{"name":"جبن إضافي","price":8}]',
      pairings: '["شاي إنجليزي","قهوة"]',
    },
    {
      name: 'حساء البصل الفرنسي',
      nameEn: 'French Onion Soup',
      description: 'حساء البصل التقليدي المطهو ببطء مع جبن غرويير ذائب وخبز كروتون مقرمش',
      price: 29,
      categoryId: categories['مقبلات'],
      rating: 4.7,
      orderCount: 145,
      tags: '["فرنسي","دافئ","مقترح الشيف"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"جبن إضافي","price":5},{"name":"خبز إضافي","price":4}]',
      pairings: '["نبيذ أحمر","ماء معدني"]',
    },
    {
      name: 'بلينيت جبن مع عسل',
      nameEn: 'Cheese Blini with Honey',
      description: 'بلينيت روسي صغير مع جبن الكريمة الطازج والعسل الطبيعي والمكسرات المحمصة',
      price: 26,
      categoryId: categories['مقبلات'],
      rating: 4.4,
      orderCount: 67,
      tags: '["روسي","خفيف"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"سلمون مدخن","price":15},{"name":"كافيار","price":25}]',
      pairings: '["شمبانيا","موهيتو"]',
    },

    // سلطات (Salads) - 3 dishes
    {
      name: 'سلطة سيزر فرنسية',
      nameEn: 'French Caesar Salad',
      description: 'خس روماني طازج مع صوص سيزر محلي الصنع وقطع الدجاج المشوي وخبز كروتون مقرمش وبارميزان',
      price: 38,
      categoryId: categories['سلطات'],
      rating: 4.6,
      orderCount: 201,
      tags: '["صحي","بروتين","فرنسي"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"دجاج إضافي","price":12},{"name":"روبيان مقلي","price":18},{"name": "أفوكادو","price":9}]',
      pairings: '["ليموناضة","ماء بالنعناع"]',
    },
    {
      name: 'سلطة النيسواز',
      nameEn: 'Nicoise Salad',
      description: 'سلطة فرنسية كلاسيكية مع التونة الطازجة والبيض المسلوق والزيتون والفاصوليا الخضراء والأنشوجة',
      price: 42,
      categoryId: categories['سلطات'],
      rating: 4.5,
      orderCount: 87,
      tags: '["فرنسي","بحري","غني"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"تونة إضافية","price":14},{"name":"جبن فيتا","price":8}]',
      pairings: '["صودا بالليمون","شاي مثلج"]',
    },
    {
      name: 'سلطة أفوكادو وجرجير',
      nameEn: 'Avocado & Arugula Salad',
      description: 'أوراق الجرجير الطازجة مع شرائح الأفوكادو الناضجة والطماطم الكرزية وصوص الليمون والزيت',
      price: 35,
      categoryId: categories['سلطات'],
      rating: 4.3,
      orderCount: 76,
      tags: '["صحي","نباتي","خفيف"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"جبن ماعز","price":10},{"name":"مكسرات","price":6}]',
      pairings: '["ماء بالليمون","عصير أخضر"]',
    },

    // مشروبات ساخنة (Hot Drinks) - 4 dishes
    {
      name: 'لاتيه بالفانيلا',
      nameEn: 'Vanilla Latte',
      description: 'إسبريسو مزدوج مع حليب مبخر رغوي وقليل من مستخلص الفانيلا الطبيعي مع رشة قرفة',
      price: 24,
      categoryId: categories['مشروبات ساخنة'],
      rating: 4.8,
      orderCount: 456,
      tags: '["قهوة","كلاسيكي","الأكثر طلباً"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"شوت إضافي","price":5},{"name":"حليب نباتي","price":6},{"name":"كريمة مخفوقة","price":4}]',
      pairings: '["كرواسون","تيراميسو"]',
    },
    {
      name: 'كابتشينو كراميل',
      nameEn: 'Caramel Cappuccino',
      description: 'كابتشينو كلاسيكي مع صوص الكراميل المحلي الصنع ورشة كاكاو وكرات الكراميل المقرمشة',
      price: 26,
      categoryId: categories['مشروبات ساخنة'],
      rating: 4.7,
      orderCount: 321,
      tags: '["قهوة","حلو","مقترح الشيف"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"شوت إضافي","price":5},{"name":"كراميل إضافي","price":4},{"name":"حليب اللوز","price":6}]',
      pairings: '["بان كيك","تيراميسو"]',
    },
    {
      name: 'شاي ماسالا بالحليب',
      nameEn: 'Masala Chai Latte',
      description: 'شاي أسيوي مميز بمزيج بهارات الماسالا السرية مع حليب مبخر رغوي وعسل طبيعي',
      price: 22,
      categoryId: categories['مشروبات ساخنة'],
      rating: 4.5,
      orderCount: 198,
      tags: '["شاي","أسيوي","دافئ"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"سكر بني","price":3},{"name":"حليب جوز الهند","price":6}]',
      pairings: '["بريوش","كرواسون"]',
    },
    {
      name: 'شوكولاتة ساخنة بلجيكية',
      nameEn: 'Belgian Hot Chocolate',
      description: 'شوكولاتة بلجيكية غنية بنسبة 70% كاكاو مع حليب مبخر وكريمة مخفوقة ورشة شوكولاتة مبشورة',
      price: 28,
      categoryId: categories['مشروبات ساخنة'],
      rating: 4.9,
      orderCount: 287,
      tags: '["شوكولاتة","غني","مقترح الشيف"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"مارشميلو","price":5},{"name":"قرفة","price":2},{"name":"فلفل حلو","price":2}]',
      pairings: '["توست فرنسي","بان كيك"]',
    },

    // حلويات (Desserts) - 4 dishes
    {
      name: 'تيراميسو كلاسيكي',
      nameEn: 'Classic Tiramisu',
      description: 'تيراميسو إيطالي أصلي بطبقات المسكربون الكريمي والبسكويت المغمور بالإسبريسو والكاكاو',
      price: 36,
      categoryId: categories['حلويات'],
      rating: 4.9,
      orderCount: 345,
      tags: '["إيطالي","كلاسيكي","مقترح الشيف","الأكثر طلباً"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"صوص شوكولاتة","price":5},{"name":"قهوة إضافية","price":3}]',
      pairings: '["إسبريسو","كابتشينو"]',
    },
    {
      name: 'كريب بالنوتيلا والموز',
      nameEn: 'Nutella & Banana Crepe',
      description: 'كريب فرنسي رقيق محشو بالنوتيلا وموز طازج مع كريمة مخفوقة وصلصة الشوكولاتة',
      price: 30,
      categoryId: categories['حلويات'],
      rating: 4.6,
      orderCount: 178,
      tags: '["فرنسي","حلو","كلاسيكي"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"فراولة","price":6},{"name":"آيس كريم","price":8},{"name":"مكسرات","price":5}]',
      pairings: '["لاتيه","شوكولاتة ساخنة"]',
    },
    {
      name: 'برافا كراميل',
      nameEn: 'Crème Brûlée',
      description: 'برافا كراميل فرنسي كلاسيكي بقشرة السكر المكرمل المقرمشة وكريمة الفانيلا الناعمة',
      price: 32,
      categoryId: categories['حلويات'],
      rating: 4.8,
      orderCount: 223,
      tags: '["فرنسي","فاخر","مقترح الشيف"]',
      isFeatured: true,
      isAvailable: true,
      addons: '[{"name":"فواكه طازجة","price":8},{"name":"صوص توت","price":5}]',
      pairings: '["شاي إنجليزي","موهيتو"]',
    },
    {
      name: 'سوفليه شوكولاتة',
      nameEn: 'Chocolate Soufflé',
      description: 'سوفليه شوكولاتة دافئ بالكاكاو البلجيكي الفاخر يذوب في الفم مع آيس كريم فانيلا',
      price: 38,
      categoryId: categories['حلويات'],
      rating: 4.7,
      orderCount: 134,
      tags: '["فرنسي","فاخر","دافئ"]',
      isFeatured: false,
      isAvailable: true,
      addons: '[{"name":"آيس كريم إضافي","price":8},{"name":"صوص شوكولاتة","price":5}]',
      pairings: '["إسبريسو","شوكولاتة ساخنة"]',
    },
  ];

  for (const dish of dishesData) {
    await prisma.dish.create({ data: dish });
    console.log(`  ✅ تم إنشاء الصنف: ${dish.name}`);
  }

  const totalDishes = dishesData.length;
  const featuredDishes = dishesData.filter(d => d.isFeatured).length;
  console.log(`\n🎉 تم إنشاء ${totalDishes} صنف (${featuredDishes} أصناف مميزة) في ${Object.keys(categories).length} تصنيفات`);
  console.log('✅ اكتملت زراعة البيانات بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في زراعة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });