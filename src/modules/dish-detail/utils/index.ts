import type { Dish, Addon } from '../types';

export function getDishEmoji(dish: Dish): string {
  const emojis = ['🍽️', '☕', '🥗', '🍰', '🥐', '🥤', '🍗', '🍕', '🍝', '🥪', '🐟', '🍲', '🧆', '🍚'];
  return emojis[dish.id.charCodeAt(0) % emojis.length];
}

export function calculateTotalPrice(dishPrice: number, selectedAddons: Addon[]): number {
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  return dishPrice + addonsTotal;
}
