import type { Dish } from '@/lib/types';

export function createNewDish(catId: string): Dish {
  return {
    id: crypto.randomUUID(),
    name: 'طبق جديد',
    nameEn: 'New Dish',
    description: 'وصف الطبق الجديد هنا',
    price: 0,
    categoryId: catId,
    rating: 4.0,
    orderCount: 0,
    tags: ['جديد'],
    isAvailable: true,
    isFeatured: false,
    addons: [{ name: 'إضافة 1', price: 3 }],
    pairings: ['مشروب مناسب'],
  };
}
