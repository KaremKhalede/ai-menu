import type { Dish, CartItem } from './types';

const dishDescriptionTemplates = [
  (dish: Dish) =>
    `اختيار ممتاز! ${dish.name} من أطباقنا المميزة، ${dish.description}. أنصحك بإضافة ${dish.addons[0]?.name ?? 'صلصة خاصة'} لتعزيز النكهة، رح يعجبك كثير!`,
  (dish: Dish) =>
    `${dish.name} من أشهر أطباقنا والناس تحبه. النكهة فريدة ومرتبة بعناية. جربها مع ${dish.addons[0]?.name ?? 'إضافات جانبية'} واستمتع بتجربة لا تُنسى!`,
  (dish: Dish) =>
    `ذوقك رفيع! ${dish.name} طبق متميز يقدم بأجود المكونات. ${dish.description}. لو تبي تضيف لمسة إضافية، ${dish.addons[0]?.name ?? 'جبنة إضافية'} تكمل المذاق بشكل رهيب.`,
  (dish: Dish) =>
    `${dish.name} من الخيارات المفضلة عند زبائننا. الطبق غني بالنكهات ومناسب لكل الأذواق. أنصحك تجربه مع ${dish.addons[0]?.name ?? 'مشروب بارد'} كمكمل مثالي.`,
  (dish: Dish) =>
    `أهلاً وسهلاً! ${dish.name} طبق مميز نقدمه بإتقان. النكهات متوازنة بشكل جميل. أضف ${dish.addons[0]?.name ?? 'توست بالثوم'} وبتحس بطعم مختلف تماماً!`,
];

const popularRecommendationTemplates = [
  (dishName: string) =>
    `لو محتار، أنصحك بـ${dishName} — أكثر طبق يطلبه الزبائن. جربته مرة وبتصير من عشاقه!`,
  (dishName: string) =>
    `أفهمك، الاختيار كثير! لكن ${dishName} الخيار الأول عند معظم زبائننا. ما راح تندم!`,
  (dishName: string) =>
    `لا تقلق، جرب ${dishName} — الأكثر طلباً عندنا هذا الشهر. النكهة تتكلم عن نفسها!`,
  (dishName: string) =>
    `صعب الاختيار أحياناً، لكن ${dishName} الأقرب لذوقك. جربه وأكيد بتعجبك النتيجة!`,
];

const emptyCartTemplates = [
  () =>
    `أهلاً بك! بداية ممتازة تكون بالمقبلات، جرب المعجنات الطازجة أو السلطات — بتنبهي شهيتك للطبق الرئيسي بعدها!`,
  () =>
    `نورتنا! أنصحك تبدأ بمقبلات خفيفة مثل الحساء أو السلطة، وبعدين تنتقل للأطباق الرئيسية. بالعافية!`,
  () =>
    `مرحباً! جرّب المقبلات أولاً، عندنا تشكيلة رائعة من المعجنات والسلطات الطازجة. بتكون بداية موفقة بإذن الله!`,
];

const upsellLowCartTemplates = [
  () =>
    `طلبك قريب يكتمل! أضف مشروب بارد أو حلى خفيف وعندك تجربة كاملة. عندنا قهوة عربية ومشروبات مميزة تستاهل التجربة!`,
  () =>
    `طلبك ممتاز! بس واش ترا تحتاج مشروب أو حلى يكمل وجبتك. جرب الكنافة أو المهلبية، بتنهي الطلب بشكل لذيذ!`,
  () =>
    `الطلب حلو! بس لا تنسى المشروب، عندنا عصائر طبيعية وقهوة مميزة. تختار واحد وتخلص الطلب بالشكل المثالي!`,
  () =>
    `أقترح تضيف حلى مع طلبك، المهلبية والكنافة من الأصناف المطلوبة كثير. تجربة الواحد منهم بتنهي وجبتك بشكل راقي!`,
];

const generalWelcomeTemplates = [
  () => `أهلاً وسهلاً فيك! كيف أقدر أساعدك في اختيار وجبتك اليوم؟`,
  () => `نورت المكان! تقدر تسألني عن أي طبق أو أقترح لك أفضل الخيارات.`,
  () => `مرحباً! جاهز أساعدك تختار أحسن الأطباق. وش تحب تسأل عنه؟`,
];

const fallbackTemplates = [
  () => `ممتاز! إذا تحتاج أي مساعدة في الطلب أنا هنا. بالعافية مقدماً!`,
  () => `اختيارك رائع! لو تحب أقترح لك شيء آخر أكون سعيد أساعدك.`,
  () => `تمام! أي شيء تحتاجه ثاني أنا موجود. بالعافية!`,
  () => `حاضر! إذا تبي توضيح عن أي طبق أو تحتاج توصية، لا تتردد تسأل.`,
  () => `أكيد! وبالمناسبة عندنا عروض اليوم مميزة، لو تبي أعرفك عليها.`,
];

function findMostPopularDish(cartItems: CartItem[]): Dish | null {
  const allDishes = cartItems.map((item) => item.dish);
  if (allDishes.length === 0) return null;
  return allDishes.reduce((max, d) => (d.orderCount > max.orderCount ? d : max), allDishes[0]);
}

export function getAIResponse(
  userMessage: string,
  dish: Dish | null,
  cartItems: CartItem[]
): string {
  const msg = userMessage.trim().toLowerCase();
  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Dish-specific inquiry (user has a dish selected)
  if (dish) {
    const templateIndex = Math.floor(Math.random() * dishDescriptionTemplates.length);
    return dishDescriptionTemplates[templateIndex](dish);
  }

  // User is hesitant / asking for recommendation
  if (
    msg.includes('ماذا') ||
    msg.includes('ايش') ||
    msg.includes('وش') ||
    msg.includes('اقترح') ||
    msg.includes('توصية') ||
    msg.includes('محتار') ||
    msg.includes('ما أعرف') ||
    msg.includes('ما ابي') ||
    msg.includes('تفضل') ||
    msg.includes('رايك')
  ) {
    const popularDish = findMostPopularDish(cartItems);
    if (popularDish) {
      const templateIndex = Math.floor(Math.random() * popularRecommendationTemplates.length);
      return popularRecommendationTemplates[templateIndex](popularDish.name);
    }
    const templateIndex = Math.floor(Math.random() * generalWelcomeTemplates.length);
    return generalWelcomeTemplates[templateIndex]();
  }

  // Cart is empty — suggest appetizers
  if (cartItems.length === 0) {
    const templateIndex = Math.floor(Math.random() * emptyCartTemplates.length);
    return emptyCartTemplates[templateIndex]();
  }

  // Cart has items but below 50 SAR — suggest drink or dessert
  if (cartTotal < 50) {
    const templateIndex = Math.floor(Math.random() * upsellLowCartTemplates.length);
    return upsellLowCartTemplates[templateIndex]();
  }

  // General fallback
  const templateIndex = Math.floor(Math.random() * fallbackTemplates.length);
  return fallbackTemplates[templateIndex]();
}