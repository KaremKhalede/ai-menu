// ============================================================
// MenuAI CRM Engine – Customer segmentation, campaigns & analytics
// ============================================================

// ---------- Types ----------

export interface Customer {
  id: string;
  phone: string;
  name: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  lastOrderId?: string;
  favoriteDishes: string[];
  tags: string[];
  createdAt: Date;
}

export interface CampaignOffer {
  type: 'percentage' | 'fixed' | 'bogo' | 'free_delivery';
  value: number;
  minOrder?: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'whatsapp' | 'push' | 'email';
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  targetSegment: 'all' | 'new_customers' | 'repeat_customers' | 'inactive_30d' | 'high_value' | 'low_value';
  message: string;
  offer?: CampaignOffer;
  scheduledAt?: Date;
  sentAt?: Date;
  stats: {
    sent: number;
    delivered: number;
    read: number;
    clicked: number;
    converted: number;
  };
  createdAt: Date;
}

export interface CampaignROI {
  campaignName: string;
  sent: number;
  converted: number;
  revenue: number;
  roi: number;
}

export interface CRMAnalytics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  retentionRate: number;
  avgOrdersPerCustomer: number;
  customerLifetimeValue: number;
  topCustomers: Customer[];
  churnRisk: Customer[];
  campaignROI: CampaignROI[];
}

export type TargetSegment = Campaign['targetSegment'];

export type CampaignTemplateKey =
  | 'weekly_specials'
  | 'reactivation'
  | 'birthday'
  | 'first_order'
  | 'loyalty';

// ---------- Arabic Campaign Templates ----------

export interface CampaignTemplate {
  key: CampaignTemplateKey;
  name: string;
  description: string;
  defaultSegment: TargetSegment;
  defaultMessage: string;
}

export const campaignTemplates: Record<CampaignTemplateKey, CampaignTemplate> = {
  weekly_specials: {
    key: 'weekly_specials',
    name: 'عروض الأسبوع',
    description: 'أفضل العروض والخصومات الأسبوعية',
    defaultSegment: 'all',
    defaultMessage:
      '🔥 *عروض الأسبوع من {restaurant}* 🔥\n\nيا {name}، عندك عروض حصرية هالأسبوع!\n\n{offer_text}\n\nاطلب الآن وتمتّع بالمذاق اللذيذ 🍽️\n\n👉 https://menuai.app/order/{restaurant}',
  },
  reactivation: {
    key: 'reactivation',
    name: 'إعادة تنشيط',
    description: 'استعادة العملاء غير النشطين',
    defaultSegment: 'inactive_30d',
    defaultMessage:
      'منوّر {name}! 💛\n\nاشتقنا لك في {restaurant}! 🍽️\n\nلأنك عميل مميز، عندك {offer_text}\n\nالعروض ما تدوم طويل… لا تفوّت الفرصة!\n\n👉 https://menuai.app/order/{restaurant}',
  },
  birthday: {
    key: 'birthday',
    name: 'عرض عيد ميلاد',
    description: 'عرض خاص بمناسبة عيد الميلاد',
    defaultSegment: 'repeat_customers',
    defaultMessage:
      '🎂 *عيد ميلاد سعيد يا {name}!* 🎂\n\nكل عام وأنت بخير من فريق {restaurant} 🎉\n\nهدية منّا لك: {offer_text}\n\nاحتفل معنا وطعم يومك حلو! 🍰\n\n👉 https://menuai.app/order/{restaurant}',
  },
  first_order: {
    key: 'first_order',
    name: 'ولّد طلبك الأول',
    description: 'تحفيز العملاء الجدد لأول طلب',
    defaultSegment: 'new_customers',
    defaultMessage:
      '✨ *أهلاً وسهلاً فيك يا {name}!* ✨\n\nنورت {restaurant} 💛\n\n{offer_text}\n\nجرّب أطباقنا اللذيذة وهتتمنى ما جربت قبل كذا! 😋\n\n👉 https://menuai.app/order/{restaurant}',
  },
  loyalty: {
    key: 'loyalty',
    name: 'شكراً لولائك',
    description: 'مكافأة العملاء المميزين',
    defaultSegment: 'high_value',
    defaultMessage:
      '🏆 *شكراً لولائك يا {name}!* 🏆\n\nفي {restaurant} نقدّرك كثير 💛\n\nلأنك من أوائل عملائنا: {offer_text}\n\nسوّي طلبك الحين واستمتع بالتميّز! 🌟\n\n👉 https://menuai.app/order/{restaurant}',
  },
};

// ---------- Demo Data ----------

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

export const demoCustomers: Customer[] = [
  {
    id: 'c1',
    phone: '0512345678',
    name: 'محمد الأحمد',
    email: 'mohammed@email.com',
    totalOrders: 24,
    totalSpent: 3840,
    lastOrderDate: daysAgo(2),
    lastOrderId: 'ord-101',
    favoriteDishes: ['كبسة لحم', 'مشاوي مشكّل', 'فتة'],
    tags: ['high_value', 'repeat'],
    createdAt: daysAgo(180),
  },
  {
    id: 'c2',
    phone: '0598765432',
    name: 'فاطمة السعيد',
    email: 'fatima@email.com',
    totalOrders: 3,
    totalSpent: 285,
    lastOrderDate: daysAgo(5),
    lastOrderId: 'ord-098',
    favoriteDishes: ['شاورما دجاج', 'حمص'],
    tags: ['new'],
    createdAt: daysAgo(25),
  },
  {
    id: 'c3',
    phone: '0551122334',
    name: 'عبدالله القحطاني',
    totalOrders: 45,
    totalSpent: 8920,
    lastOrderDate: daysAgo(1),
    lastOrderId: 'ord-102',
    favoriteDishes: ['كبسة رز', 'مندي', 'مظبي دجاج'],
    tags: ['high_value', 'repeat'],
    createdAt: daysAgo(365),
  },
  {
    id: 'c4',
    phone: '0543322110',
    name: 'نورة العتيبي',
    email: 'noura@email.com',
    totalOrders: 1,
    totalSpent: 95,
    lastOrderDate: daysAgo(12),
    favoriteDishes: ['سلطة سيزر'],
    tags: ['new', 'low_value'],
    createdAt: daysAgo(12),
  },
  {
    id: 'c5',
    phone: '0567891234',
    name: 'خالد الشمري',
    totalOrders: 15,
    totalSpent: 2100,
    lastOrderDate: daysAgo(38),
    favoriteDishes: ['برجر لحم', 'بطاطس حارة'],
    tags: ['inactive', 'repeat'],
    createdAt: daysAgo(200),
  },
  {
    id: 'c6',
    phone: '0533456789',
    name: 'سارة الحربي',
    email: 'sara@email.com',
    totalOrders: 8,
    totalSpent: 1120,
    lastOrderDate: daysAgo(42),
    favoriteDishes: ['بيتزا مارغريتا', 'باستا'],
    tags: ['inactive'],
    createdAt: daysAgo(150),
  },
  {
    id: 'c7',
    phone: '0577665544',
    name: 'سلطان المطيري',
    totalOrders: 32,
    totalSpent: 5760,
    lastOrderDate: daysAgo(3),
    lastOrderId: 'ord-100',
    favoriteDishes: ['كبسة لحم', 'مجدرة', 'كيك'],
    tags: ['high_value', 'repeat'],
    createdAt: daysAgo(300),
  },
  {
    id: 'c8',
    phone: '0522113344',
    name: 'ريم الدوسري',
    totalOrders: 2,
    totalSpent: 180,
    lastOrderDate: daysAgo(55),
    favoriteDishes: ['شاورما لحم'],
    tags: ['inactive', 'low_value'],
    createdAt: daysAgo(60),
  },
];

export const demoCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'عروض نهاية الأسبوع',
    type: 'whatsapp',
    status: 'completed',
    targetSegment: 'all',
    message: '🔥 عروض الأسبوع من مطعم الذهبي 🔥\n\nخصم 20% على جميع الطلبات!\n\nاطلب الآن!',
    offer: { type: 'percentage', value: 20, minOrder: 50 },
    sentAt: daysAgo(7),
    createdAt: daysAgo(10),
    stats: { sent: 156, delivered: 148, read: 112, clicked: 67, converted: 38 },
  },
  {
    id: 'camp-2',
    name: 'إعادة تنشيط العملاء',
    type: 'whatsapp',
    status: 'sent',
    targetSegment: 'inactive_30d',
    message: 'اشتقنا لك! 🔥 خصم 30% على طلبك القادم',
    offer: { type: 'percentage', value: 30, minOrder: 40 },
    sentAt: daysAgo(2),
    createdAt: daysAgo(5),
    stats: { sent: 42, delivered: 40, read: 28, clicked: 14, converted: 7 },
  },
  {
    id: 'camp-3',
    name: 'مكافأة العملاء المميزين',
    type: 'whatsapp',
    status: 'scheduled',
    targetSegment: 'high_value',
    message: '🏆 شكراً لولائك! اطلب وجبة مجانية مع طلبك القادم',
    offer: { type: 'bogo', value: 1 },
    scheduledAt: daysAgo(-3),
    createdAt: daysAgo(1),
    stats: { sent: 0, delivered: 0, read: 0, clicked: 0, converted: 0 },
  },
  {
    id: 'camp-4',
    name: 'ترحيب بالعملاء الجدد',
    type: 'push',
    status: 'draft',
    targetSegment: 'new_customers',
    message: '✨ أهلاً وسهلاً! خصم 15% على أول طلب',
    offer: { type: 'percentage', value: 15, minOrder: 30 },
    createdAt: daysAgo(1),
    stats: { sent: 0, delivered: 0, read: 0, clicked: 0, converted: 0 },
  },
];

// ---------- Customer Segmentation ----------

export function segmentCustomers(
  customers: Customer[],
  segment: TargetSegment
): Customer[] {
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

  switch (segment) {
    case 'all':
      return customers;
    case 'new_customers':
      return customers.filter(
        (c) =>
          c.totalOrders <= 3 &&
          c.createdAt >= thirtyDaysAgo
      );
    case 'repeat_customers':
      return customers.filter((c) => c.totalOrders > 3 && c.totalOrders <= 15);
    case 'inactive_30d':
      return customers.filter((c) => c.lastOrderDate < thirtyDaysAgo);
    case 'high_value':
      return customers.filter(
        (c) => c.totalSpent >= 2000 || c.totalOrders >= 20
      );
    case 'low_value':
      return customers.filter(
        (c) => c.totalSpent < 300 && c.totalOrders <= 3
      );
    default:
      return customers;
  }
}

// ---------- Offer Text Generator ----------

function offerToText(offer?: CampaignOffer): string {
  if (!offer) return 'عروض حصرية بانتظارك!';
  switch (offer.type) {
    case 'percentage':
      return `خصم ${offer.value}% ${offer.minOrder ? `على الطلبات فوق ${offer.minOrder} ر.س` : 'على طلبك'}`;
    case 'fixed':
      return `خصم ${offer.value} ر.س على طلبك${offer.minOrder ? ` (الحد الأدنى ${offer.minOrder} ر.س)` : ''}`;
    case 'bogo':
      return 'اشترِ واحد واحصل على الآخر مجاناً! 🎉';
    case 'free_delivery':
      return 'توصيل مجاني لطلبك القادم! 🚗';
  }
}

// ---------- Campaign Message Generator ----------

export function generateCampaignMessage(
  templateKey: CampaignTemplateKey,
  customer: Customer,
  offer?: CampaignOffer,
  restaurantName = 'مطعم الذهبي'
): string {
  const template = campaignTemplates[templateKey];
  const offerText = offerToText(offer);
  return template.defaultMessage
    .replace(/\{name\}/g, customer.name)
    .replace(/\{restaurant\}/g, restaurantName)
    .replace(/\{offer_text\}/g, offerText);
}

// ---------- Best Send Time ----------

export function calculateSendTime(customer: Customer): Date {
  const hour = customer.totalOrders > 10 ? 11 : 18; // VIP → lunch, others → dinner
  const sendTime = new Date();
  sendTime.setHours(hour, 0, 0, 0);
  if (sendTime <= new Date()) {
    sendTime.setDate(sendTime.getDate() + 1);
  }
  return sendTime;
}

// ---------- Churn Risk ----------

export function getChurnRiskCustomers(customers?: Customer[]): Customer[] {
  const list = customers ?? demoCustomers;
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  return list
    .filter((c) => c.lastOrderDate < thirtyDaysAgo && c.totalOrders >= 2)
    .sort((a, b) => a.lastOrderDate.getTime() - b.lastOrderDate.getTime());
}

// ---------- CRM Analytics ----------

export function getCRMAnalytics(
  customers?: Customer[],
  campaigns?: Campaign[]
): CRMAnalytics {
  const custs = customers ?? demoCustomers;
  const camps = campaigns ?? demoCampaigns;

  const totalCustomers = custs.length;
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const newCustomersThisMonth = custs.filter(
    (c) => c.createdAt >= thirtyDaysAgo
  ).length;

  const activeCustomers = custs.filter(
    (c) => c.lastOrderDate >= thirtyDaysAgo
  ).length;
  const retentionRate =
    totalCustomers > 0
      ? Math.round((activeCustomers / totalCustomers) * 100)
      : 0;

  const avgOrders =
    totalCustomers > 0
      ? +(custs.reduce((s, c) => s + c.totalOrders, 0) / totalCustomers).toFixed(1)
      : 0;

  const customerLifetimeValue =
    totalCustomers > 0
      ? Math.round(
          custs.reduce((s, c) => s + c.totalSpent, 0) / totalCustomers
        )
      : 0;

  const topCustomers = [...custs]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const churnRisk = getChurnRiskCustomers(custs);

  const campaignROI: CampaignROI[] = camps
    .filter((c) => c.stats.sent > 0)
    .map((c) => {
      const revenue = c.stats.converted * 85; // avg order value
      const cost = c.stats.sent * 0.12; // whatsapp cost
      return {
        campaignName: c.name,
        sent: c.stats.sent,
        converted: c.stats.converted,
        revenue: Math.round(revenue),
        roi: cost > 0 ? Math.round(((revenue - cost) / cost) * 100) : 0,
      };
    });

  return {
    totalCustomers,
    newCustomersThisMonth,
    retentionRate,
    avgOrdersPerCustomer: avgOrders,
    customerLifetimeValue,
    topCustomers,
    churnRisk,
    campaignROI,
  };
}

// ---------- Customer Insights ----------

export interface CustomerInsight {
  customer: Customer;
  segment: string;
  avgOrderValue: number;
  daysSinceLastOrder: number;
  preferredOrderTime: 'صباحي' | 'مسائي';
  churnRiskLevel: 'منخفض' | 'متوسط' | 'مرتفع';
  suggestedAction: string;
}

export function getCustomerInsights(customerId: string): CustomerInsight | null {
  const customer = demoCustomers.find((c) => c.id === customerId);
  if (!customer) return null;

  const daysSince = Math.floor(
    (now.getTime() - customer.lastOrderDate.getTime()) / 86400000
  );
  const avgOrderValue =
    customer.totalOrders > 0
      ? Math.round(customer.totalSpent / customer.totalOrders)
      : 0;

  const isHighValue = customer.totalSpent >= 2000 || customer.totalOrders >= 20;
  const churnRiskLevel: CustomerInsight['churnRiskLevel'] =
    daysSince > 45
      ? 'مرتفع'
      : daysSince > 25
        ? 'متوسط'
        : 'منخفض';

  let segment = 'جديد';
  if (isHighValue) segment = 'قيمة عالية';
  else if (customer.totalOrders > 3) segment = 'متكرر';
  else if (daysSince > 30) segment = 'غير نشط';

  const suggestedAction =
    daysSince > 30
      ? 'إرسال عرض إعادة تنشيط عبر واتساب'
      : isHighValue
        ? 'مكافأة ولاء مع عرض BOGO'
        : customer.totalOrders <= 1
          ? 'عرض ترحيبي بخصم 15%'
          : 'إشعار بعرض الأسبوع الجديد';

  return {
    customer,
    segment,
    avgOrderValue,
    daysSinceLastOrder: daysSince,
    preferredOrderTime: customer.totalOrders > 10 ? 'صباحي' : 'مسائي',
    churnRiskLevel,
    suggestedAction,
  };
}

// ---------- Segment Label Mapping ----------

export const segmentLabels: Record<TargetSegment, string> = {
  all: 'الجميع',
  new_customers: 'عملاء جدد',
  repeat_customers: 'عملاء متكررين',
  inactive_30d: 'غير نشطين (30 يوم)',
  high_value: 'قيمة عالية',
  low_value: 'قيمة منخفضة',
};