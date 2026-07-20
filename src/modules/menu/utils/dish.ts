import type { Dish } from '@/lib/types';
import { DISH_EMOJI_MAP, DEFAULT_EMOJI } from '../constants/dishEmoji';
import { DESCRIPTION_TEMPLATES, FALLBACK_DESCRIPTION } from '../constants/aiTemplates';

/* ─────────────── Emoji resolver ─────────────── */

/**
 * Returns the best-matching emoji for a dish name.
 * Falls back to a generic plate emoji when no keyword matches.
 */
export function getDishEmoji(name: string): string {
  for (const [key, emoji] of DISH_EMOJI_MAP) {
    if (name.includes(key)) return emoji;
  }
  return DEFAULT_EMOJI;
}

/* ─────────────── AI description generator ─────────────── */

/**
 * Generates a contextual Arabic description for the given dish name
 * by matching against known keyword templates.
 */
export function generateAIDescription(dishName: string): string {
  for (const [key, template] of DESCRIPTION_TEMPLATES) {
    if (dishName.includes(key)) return template;
  }
  return FALLBACK_DESCRIPTION;
}

/* ─────────────── Dish factory ─────────────── */

/**
 * Creates a blank `Dish` object pre-populated with sensible defaults,
 * ready for use in an add-dish dialog.
 */
export function emptyDish(categoryId: string): Dish {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    price: 0,
    categoryId,
    rating: 0,
    orderCount: 0,
    tags: [],
    isAvailable: true,
    isFeatured: false,
    addons: [],
    pairings: [],
  };
}
