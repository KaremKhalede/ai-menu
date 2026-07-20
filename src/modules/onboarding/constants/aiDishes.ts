export interface AiDish {
  name: string;
  price: string;
  category: string;
}

export const AI_GENERATED_DISHES: AiDish[] = [
  { name: 'لاتيه كراميل', price: '22 ر.س', category: 'مشروبات' },
  { name: 'بان كيك بالشوكولاتة', price: '34 ر.س', category: 'إفطار' },
  { name: 'سندويش دجاج أفاتو', price: '28 ر.س', category: 'وجبات' },
  { name: 'تشيز كيك توت', price: '26 ر.س', category: 'حلويات' },
];

export const STEP_LABELS: string[] = [
  'نوع المطعم',
  'معلومات المطعم',
  'قائمة AI',
  'الانطلاق',
];

export const TOTAL_STEPS = 4;
