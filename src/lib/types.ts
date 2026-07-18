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

export type PersonalityMode = 'luxury' | 'friendly' | 'professional' | 'casual' | 'playful';

export type SortCriteria = 'profitability' | 'popularity' | 'rating' | 'ai_recommended' | 'revenue';

export type ViewType = 'landing' | 'login' | 'onboarding' | 'menu' | 'dashboard' | 'menu-editor' | 'settings' | 'auto-menu-generator' | 'crm' | 'heatmap';

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

export interface AISuggestion {
  id: string;
  sessionId: string;
  dishId: string;
  dishName: string;
  suggestedAt: Date;
  context: 'chat' | 'cart_upsell' | 'menu_featured';
  message: string;
  converted?: boolean;
  convertedAt?: Date;
  orderValue?: number;
}

export interface RevenueEvent {
  type: 'ai_suggestion' | 'ai_conversion' | 'ai_dismiss' | 'view' | 'cart_add' | 'checkout';
  dishId?: string;
  dishName?: string;
  value?: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AIRevenueMetrics {
  totalSuggestions: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenueFromAI: number;
  avgOrderValueWithAI: number;
  avgOrderValueWithoutAI: number;
  aiLiftPercentage: number;
  topConvertingDishes: Array<{ dishName: string; suggestions: number; conversions: number; revenue: number }>;
  suggestionByContext: Record<string, { suggestions: number; conversions: number }>;
  hourlyPerformance: Array<{ hour: number; suggestions: number; conversions: number }>;
}

export interface MenuGenerationRequest {
  restaurantType: string;
  cuisine: string;
  priceRange: 'budget' | 'medium' | 'premium' | 'luxury';
  numberOfCategories: number;
  currency?: string;
  language?: string;
  specialRequirements?: string;
}