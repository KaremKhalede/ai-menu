import { describe, it, expect } from 'vitest';
import { getDishEmoji, calculateTotalPrice } from '@/modules/dish-detail/utils';
import type { Dish, Addon } from '@/modules/dish-detail/types';

describe('Dish Detail utilities', () => {
  describe('getDishEmoji', () => {
    it('should assign consistent emojis based on dish character hash', () => {
      const mockDish1: Dish = { id: 'dishA', name: 'A', description: '', price: 10, categoryId: '', rating: 0, orderCount: 0, tags: [], isAvailable: true, isFeatured: false, addons: [], pairings: [] };
      const mockDish2: Dish = { id: 'dishB', name: 'B', description: '', price: 10, categoryId: '', rating: 0, orderCount: 0, tags: [], isAvailable: true, isFeatured: false, addons: [], pairings: [] };

      const emoji1 = getDishEmoji(mockDish1);
      const emoji2 = getDishEmoji(mockDish2);

      expect(emoji1).toBeDefined();
      expect(emoji2).toBeDefined();
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return dish base price if no addons are selected', () => {
      const result = calculateTotalPrice(50, []);
      expect(result).toBe(50);
    });

    it('should sum selected addons prices with the dish base price', () => {
      const addons: Addon[] = [
        { name: 'إضافة 1', price: 5 },
        { name: 'إضافة 2', price: 7.5 },
      ];
      const result = calculateTotalPrice(40, addons);
      expect(result).toBe(52.5);
    });
  });
});
