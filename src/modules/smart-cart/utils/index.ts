import type { Category, Dish } from '@/lib/types';
import type { UpsellSuggestion } from '../types';

export function getUpsellSuggestion(totalDisplay: number, categories: Category[]): UpsellSuggestion | null {
  if (totalDisplay >= 50) return null;

  // Find drink and dessert categories
  const drinkCategory = categories.find(
    (c) =>
      c.nameEn?.toLowerCase().includes('drink') ||
      c.name.includes('مشروب') ||
      c.name.includes('عصير') ||
      c.name.includes('قهوة') ||
      c.name.includes('شاي')
  );
  const dessertCategory = categories.find(
    (c) =>
      c.nameEn?.toLowerCase().includes('dessert') ||
      c.name.includes('حلى') ||
      c.name.includes('حلو') ||
      c.name.includes('كنافة') ||
      c.name.includes('مهلبية')
  );

  if (totalDisplay < 30 && drinkCategory && drinkCategory.dishes.length > 0) {
    return {
      type: 'drink',
      dish: drinkCategory.dishes[0],
      message: '90% من العملاء يضيفون مشروب مع طلبهم',
    };
  }

  if (totalDisplay < 50 && dessertCategory && dessertCategory.dishes.length > 0) {
    return {
      type: 'dessert',
      dish: dessertCategory.dishes[0],
      message: 'وجبتك تحتاج لمسة حلا! جرب الحلويات المميزة',
    };
  }

  // Fallback: find first available suggestion
  const fallbackDish = drinkCategory?.dishes[0] ?? dessertCategory?.dishes[0] ?? null;
  if (fallbackDish) {
    return {
      type: drinkCategory ? 'drink' : 'dessert',
      dish: fallbackDish,
      message: 'أكمل وجبتك بإضافة هذا الصنف المميز',
    };
  }

  return null;
}
