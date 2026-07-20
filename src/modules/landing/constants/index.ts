import {
  Bot,
  Sparkles,
  BarChart3,
  Mic,
  Zap,
  Shield,
  UtensilsCrossed,
  Globe,
  Star,
} from 'lucide-react';

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const features = [
  {
    icon: Bot,
    title: 'نادل AI ذكي',
    desc: 'نادل افتراضي يشرح الأطباق ويقترح إضافات بطريقة ذكية',
  },
  {
    icon: Sparkles,
    title: 'منيو شخصي',
    desc: 'كل عميل يرى منيو مخصص حسب ذوقه وتفضيلاته',
  },
  {
    icon: BarChart3,
    title: 'تحليلات ذكية',
    desc: 'تحليل عميق للمبيعات والعملاء مع اقتراحات AI',
  },
  {
    icon: Mic,
    title: 'طلب بالصوت',
    desc: 'تحدث مع النادل الذكي واطلب بالصوت مباشرة',
  },
  {
    icon: Zap,
    title: 'ترقية ذكية',
    desc: 'اقتراحات Upselling تزيد قيمة الطلب تلقائياً',
  },
  {
    icon: Shield,
    title: 'تكامل كامل',
    desc: 'ربط مع أنظمة POS وأدوات الإدارة',
  },
];

export const steps = [
  {
    num: '١',
    icon: UtensilsCrossed,
    title: 'ارفع قائمتك',
    desc: 'أضف أطباقك وصورك وسيقوم AI بتحسين الوصفاف تلقائياً',
  },
  {
    num: '٢',
    icon: Globe,
    title: 'شارك QR كود',
    desc: 'كل طاولة تحصل على QR فريد يفتح المنيو الذكي',
  },
  {
    num: '٣',
    icon: BarChart3,
    title: 'راقب المبيعات',
    desc: 'تابع أداء مطعمك بالتحليلات الذكية واقتراحات AI',
  },
];

export const stats = [
  { value: 'أكثر من 500 مطعم', icon: UtensilsCrossed },
  { value: 'زيادة 40% في المبيعات', icon: BarChart3 },
  { value: 'تقييم 4.9/5', icon: Star },
];

export const demoDishes = [
  { name: 'مشاوي مشكّلة', price: '85 ر.س', popular: true },
  { name: 'كبسة لحم', price: '65 ر.س', popular: false },
  { name: 'فتة حمص', price: '32 ر.س', popular: false },
  { name: 'كنافة نابلسية', price: '28 ر.س', popular: true },
];
