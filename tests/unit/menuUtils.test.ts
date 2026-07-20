import { describe, it, expect } from 'vitest';
import { getDishEmoji, generateAIDescription, emptyDish } from '@/modules/menu/utils/dish';
import { DEFAULT_EMOJI } from '@/modules/menu/constants/dishEmoji';
import { FALLBACK_DESCRIPTION } from '@/modules/menu/constants/aiTemplates';

describe('Menu dish utilities', () => {
  describe('getDishEmoji', () => {
    it('should resolve specific emojis for known dish keywords', () => {
      // Examples from typical menus
      expect(getDishEmoji('برجر لحم')).toBe('🍔');
      expect(getDishEmoji('بيتزا مارجريتا')).toBe('🍕');
      expect(getDishEmoji('عصير برتقال')).toBe('🧃');
      expect(getDishEmoji('شاي أخضر')).toBe('🍵');
    });

    it('should return fallback emoji for unknown keywords', () => {
      expect(getDishEmoji('طبق غامض')).toBe(DEFAULT_EMOJI);
    });
  });

  describe('generateAIDescription', () => {
    it('should generate matching descriptions for known keywords', () => {
      expect(generateAIDescription('برجر كلاسيك')).toContain('برجر');
      expect(generateAIDescription('بيتزا خضار')).toContain('بيتزا');
      expect(generateAIDescription('قهوة تركية')).toContain('نكهة غنية');
    });

    it('should return fallback description for unknown names', () => {
      expect(generateAIDescription('صنف غامض')).toBe(FALLBACK_DESCRIPTION);
    });
  });

  describe('emptyDish', () => {
    it('should return a valid Dish structure with sensible defaults', () => {
      const categoryId = 'test-cat-123';
      const dish = emptyDish(categoryId);

      expect(dish.id).toBeDefined();
      expect(dish.categoryId).toBe(categoryId);
      expect(dish.name).toBe('');
      expect(dish.description).toBe('');
      expect(dish.price).toBe(0);
      expect(dish.rating).toBe(0);
      expect(dish.orderCount).toBe(0);
      expect(dish.tags).toEqual([]);
      expect(dish.isAvailable).toBe(true);
      expect(dish.isFeatured).toBe(false);
      expect(dish.addons).toEqual([]);
      expect(dish.pairings).toEqual([]);
    });
  });
});
