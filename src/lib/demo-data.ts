import type { AIInsight } from './types';

// 7 days of daily revenue data (SAR)
export const dailyRevenue = [
  { day: 'السبت', revenue: 4250, orders: 87 },
  { day: 'الأحد', revenue: 5130, orders: 102 },
  { day: 'الاثنين', revenue: 3890, orders: 76 },
  { day: 'الثلاثاء', revenue: 4670, orders: 93 },
  { day: 'الأربعاء', revenue: 5420, orders: 108 },
  { day: 'الخميس', revenue: 6280, orders: 125 },
  { day: 'الجمعة', revenue: 5890, orders: 118 },
];

// Top 5 dishes by orders
export const topDishes = [
  { name: 'كبسة لحم', orders: 245, revenue: 7350 },
  { name: 'مندي دجاج', orders: 198, revenue: 4950 },
  { name: 'مشاوي مشكّلة', orders: 176, revenue: 6160 },
  { name: 'فتة حمص', orders: 152, revenue: 2280 },
  { name: 'كنافة نابلسية', orders: 134, revenue: 2010 },
];

// 24 hours of order distribution
export const hourlyOrders = [
  { hour: '6 ص', orders: 2 },
  { hour: '7 ص', orders: 5 },
  { hour: '8 ص', orders: 12 },
  { hour: '9 ص', orders: 18 },
  { hour: '10 ص', orders: 15 },
  { hour: '11 ص', orders: 22 },
  { hour: '12 م', orders: 38 },
  { hour: '1 م', orders: 45 },
  { hour: '2 م', orders: 52 },
  { hour: '3 م', orders: 41 },
  { hour: '4 م', orders: 28 },
  { hour: '5 م', orders: 19 },
  { hour: '6 م', orders: 24 },
  { hour: '7 م', orders: 35 },
  { hour: '8 م', orders: 48 },
  { hour: '9 م', orders: 56 },
  { hour: '10 م', orders: 62 },
  { hour: '11 م', orders: 44 },
  { hour: '12 ص', orders: 31 },
  { hour: '1 ص', orders: 18 },
  { hour: '2 ص', orders: 10 },
  { hour: '3 ص', orders: 6 },
  { hour: '4 ص', orders: 3 },
  { hour: '5 ص', orders: 1 },
];

// AI-generated insights in Arabic
export const aiInsights: AIInsight[] = [
  {
    type: 'success',
    title: 'ارتفاع المبيعات في وجبة العشاء',
    description:
      'طلبات العشاء بين الساعة 8 و10 مساءً ارتفعت 23% هذا الأسبوع. الأطباق الأكثر طلباً هي المشاوي والمندي.',
    action: 'إضافة عرض خاص على وجبات العشاء',
  },
  {
    type: 'warning',
    title: 'انخفاض طلبات المشروبات',
    description:
      'طلبات المشروبات انخفضت 15% مقارنة بالأسبوع الماضي. قد يكون السبب عدم وضوح قائمة المشروبات في القائمة الرقمية.',
    action: 'مراجعة عرض المشروبات في القائمة',
  },
  {
    type: 'info',
    title: 'الكنافة النابلسية تتصدر الحلويات',
    description:
      'الكنافة النابلسية سجلت 134 طلب هذا الأسبوع، بزيادة 12% عن الأسبوع السابق. يمكنك إضافة نكهات جديدة لتعزيز المبيعات.',
    action: 'إضافة نكهة جبن كريمية جديدة',
  },
  {
    type: 'success',
    title: 'أعلى إيرادات يوم الخميس',
    description:
      'يوم الخميس سجل أعلى إيرادات بواقع 6,280 ريال و125 طلب. فترة الذروة كانت من 9-11 مساءً.',
    action: 'تجهيز طاقم إضافي يوم الخميس',
  },
  {
    type: 'warning',
    title: 'بطء في الفترة الصباحية',
    description:
      'الفترة من 10-11 صباحاً تسجل أقل عدد طلبات. يمكنك تقديم عرض فطار مميز لجذب المزيد من الزبائن.',
    action: 'إطلاق باقة فطار مخفضة',
  },
];

// KPI summary
export const kpiData = {
  totalRevenue: 35530,
  totalOrders: 709,
  avgOrderValue: 50.1,
  conversionRate: 34.7,
  topDishName: 'كبسة لحم',
};