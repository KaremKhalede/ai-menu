export interface Dish {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  rating: number;
  orderCount: number;
  tags: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  addons: Addon[];
  pairings: string[];
}

export interface Addon {
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  icon?: string;
  sortOrder: number;
  dishes: Dish[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  selectedAddons: Addon[];
  totalPrice: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  action?: string;
}

export type ViewType = 'landing' | 'login' | 'onboarding' | 'menu' | 'dashboard' | 'menu-editor' | 'settings';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'owner' | 'manager' | 'employee';
}

export interface Restaurant {
  name: string;
  description: string;
  type: string;
  theme: 'luxury' | 'modern' | 'warm';
  currency: string;
}