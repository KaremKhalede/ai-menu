import type { Dish } from '@/lib/types';

export interface SmartCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UpsellSuggestion {
  type: 'drink' | 'dessert';
  dish: Dish;
  message: string;
}
export type { CartItem, Category, Dish } from '@/lib/types';
