// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { getUpsellSuggestion } from '@/modules/smart-cart/utils';
import type { Category } from '@/lib/types';

describe('Smart Cart AI Upsell suggestions logic', () => {
  const mockCategories: Category[] = [
    {
      id: 'cat-drinks',
      name: 'مشروبات',
      nameEn: 'Drinks',
      dishes: [
        {
          id: 'drink-1',
          name: 'عصير برتقال',
          description: 'عصير طبيعي طازج',
          price: 15,
          categoryId: 'cat-drinks',
          rating: 4.5,
          orderCount: 120,
          tags: ['طبيعي'],
          isAvailable: true,
          isFeatured: false,
          addons: [],
          pairings: [],
        },
      ],
    },
    {
      id: 'cat-desserts',
      name: 'حلويات',
      nameEn: 'Desserts',
      dishes: [
        {
          id: 'dessert-1',
          name: 'كنافة نابلسية',
          description: 'كنافة نابلسية بالجبن الفاخر',
          price: 25,
          categoryId: 'cat-desserts',
          rating: 4.8,
          orderCount: 300,
          tags: ['شعبي', 'حلو'],
          isAvailable: true,
          isFeatured: true,
          addons: [],
          pairings: [],
        },
      ],
    },
  ];

  it('should return null if cart total is 50 or above', () => {
    const result = getUpsellSuggestion(55, mockCategories);
    expect(result).toBeNull();
  });

  it('should suggest a drink if total is less than 30', () => {
    const result = getUpsellSuggestion(25, mockCategories);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('drink');
    expect(result?.dish.id).toBe('drink-1');
    expect(result?.message).toContain('مشروب');
  });

  it('should suggest a dessert if total is between 30 and 49.99', () => {
    const result = getUpsellSuggestion(35, mockCategories);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('dessert');
    expect(result?.dish.id).toBe('dessert-1');
    expect(result?.message).toContain('حلا');
  });

  it('should fallback to drink suggestions if no dessert matches but drinks category is present', () => {
    const categoriesWithoutDesserts = mockCategories.filter(c => c.id !== 'cat-desserts');
    // Total is 35 (which normally triggers dessert, but no dessert is available, so it falls back)
    const result = getUpsellSuggestion(35, categoriesWithoutDesserts);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('drink');
    expect(result?.dish.id).toBe('drink-1');
  });

  it('should return null if no categories match and no backup exists', () => {
    const emptyCategories: Category[] = [];
    const result = getUpsellSuggestion(15, emptyCategories);
    expect(result).toBeNull();
  });
});
