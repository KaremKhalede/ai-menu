import type { CuisineOption, PriceRangeOption } from '../types';

export const CUISINES: CuisineOption[] = [
  { value: 'أمريكي', label: 'أمريكي' },
  { value: 'سعودي', label: 'سعودي' },
  { value: 'إيطالي', label: 'إيطالي' },
  { value: 'ياباني', label: 'ياباني' },
  { value: 'هندي', label: 'هندي' },
  { value: 'تركي', label: 'تركي' },
  { value: 'عربي عام', label: 'عربي عام' },
  { value: 'مشويات', label: 'مشويات' },
  { value: 'حلويات', label: 'حلويات' },
  { value: 'متعدد', label: 'متعدد' },
];

export const PRICE_RANGES: readonly PriceRangeOption[] = [
  { value: 'budget', label: 'اقتصادي', range: '5-25 ر.س', icon: '💰' },
  { value: 'medium', label: 'متوسط', range: '20-60 ر.س', icon: '💳' },
  { value: 'premium', label: 'فاخر', range: '50-120 ر.س', icon: '✨' },
  { value: 'luxury', label: 'بريميوم', range: '100-300+ ر.س', icon: '👑' },
] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

export const successPop = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 15, delay: 0.2 },
  },
};
