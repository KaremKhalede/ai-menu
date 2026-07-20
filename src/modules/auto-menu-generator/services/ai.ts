import type { Category } from '@/lib/types';

interface GenerateMenuPayload {
  restaurantType: string;
  cuisine: string;
  priceRange: 'budget' | 'medium' | 'premium' | 'luxury';
  numberOfCategories: number;
}

interface GenerateMenuResponse {
  restaurantName?: string;
  categories?: Category[];
}

export async function generateMenu(payload: GenerateMenuPayload): Promise<GenerateMenuResponse> {
  const res = await fetch('/api/ai/generate-menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurantType: payload.restaurantType,
      cuisine: payload.cuisine,
      priceRange: payload.priceRange,
      numberOfCategories: payload.numberOfCategories,
      dishesPerCategory: 4,
      currency: 'ر.س',
      language: 'ar',
      specialRequirements: '',
    }),
  });

  if (!res.ok) {
    throw new Error('فشل في توليد القائمة');
  }

  return res.json();
}
