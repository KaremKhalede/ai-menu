import { create } from 'zustand';

export type AIState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  icon?: string;
  sortOrder: number;
  dishes: MenuItem[];
}

export interface MenuItem {
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
  addons: { name: string; price: number }[];
  pairings: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface ServioState {
  // Data
  categories: Category[];
  menuLoaded: boolean;
  menuLoading: boolean;
  fetchMenu: () => Promise<void>;

  // Active category filter
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;

  // Navigation
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Active dish
  activeDish: MenuItem | null;
  setActiveDish: (dish: MenuItem | null) => void;

  // Voice AI
  voiceOpen: boolean;
  setVoiceOpen: (open: boolean) => void;
  aiState: AIState;
  setAiState: (state: AIState) => void;

  // Cart
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Order
  orderPlacing: boolean;
  orderSuccess: boolean;
  placeOrder: () => Promise<boolean>;
  resetOrder: () => void;
}

const FALLBACK_IMAGES: Record<string, string> = {
  'فطور': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  'مقبلات': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop',
  'سلطات': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  'مشروبات ساخنة': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
  'حلويات': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=300&fit=crop',
];

function getDishImage(dish: MenuItem, index: number): string {
  if (dish.image) return dish.image;
  const cat = dish.name || '';
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (cat.includes(key) || cat.includes('كرواسون') || cat.includes('أومليت') || cat.includes('توست') || cat.includes('بان كيك')) {
      if (key === 'فطور') return url;
    }
  }
  return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
}

function getBadge(tags: string[], isFeatured: boolean, orderCount: number): 'popular' | 'recommended' | 'new' | undefined {
  if (tags.includes('الأكثر طلباً') || orderCount > 300) return 'popular';
  if (tags.includes('مقترح الشيف') || isFeatured) return 'recommended';
  return undefined;
}

interface ApiCategory {
  id: string;
  name: string;
  nameEn?: string;
  icon?: string;
  sortOrder: number;
  dishes: ApiDish[];
}

interface ApiDish {
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
  addons: { name: string; price: number }[];
  pairings: string[];
}

export const useServioStore = create<ServioState>((set, get) => ({
  // Data
  categories: [],
  menuLoaded: false,
  menuLoading: false,
  fetchMenu: async () => {
    if (get().menuLoaded || get().menuLoading) return;
    set({ menuLoading: true });
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        const apiCategories: ApiCategory[] = data.categories || [];
        let dishIndex = 0;
        const categories: Category[] = apiCategories.map((cat) => ({
          ...cat,
          dishes: cat.dishes.map((dish) => {
            const idx = dishIndex++;
            return {
              ...dish,
              image: getDishImage(dish, idx),
            };
          }),
        }));
        set({ categories, menuLoaded: true });
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      set({ menuLoading: false });
    }
  },

  // Active category
  activeCategory: null,
  setActiveCategory: (id) => set({ activeCategory: id, activeDish: null }),

  // Navigation
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Active dish
  activeDish: null,
  setActiveDish: (dish) => set({ activeDish: dish }),

  // Voice AI
  voiceOpen: false,
  setVoiceOpen: (open) => {
    if (open) {
      set({ voiceOpen: true, aiState: 'listening' });
      setTimeout(() => set({ aiState: 'thinking' }), 2500);
      setTimeout(() => set({ aiState: 'speaking' }), 4500);
    } else {
      set({ voiceOpen: false, aiState: 'idle' });
    }
  },
  aiState: 'idle',
  setAiState: (state) => set({ aiState: state }),

  // Cart
  cartItems: [],
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  addToCart: (item) => {
    const items = get().cartItems;
    const existing = items.find((c) => c.item.id === item.id);
    if (existing) {
      set({
        cartItems: items.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        ),
      });
    } else {
      set({ cartItems: [...items, { item, quantity: 1 }] });
    }
    set({ cartOpen: true });
  },
  removeFromCart: (itemId) => {
    set({ cartItems: get().cartItems.filter((c) => c.item.id !== itemId) });
  },
  updateQuantity: (itemId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    set({
      cartItems: get().cartItems.map((c) =>
        c.item.id === itemId ? { ...c, quantity: qty } : c
      ),
    });
  },
  clearCart: () => set({ cartItems: [] }),
  cartTotal: () =>
    get().cartItems.reduce((sum, c) => sum + c.item.price * c.quantity, 0),
  cartCount: () =>
    get().cartItems.reduce((sum, c) => sum + c.quantity, 0),

  // Order
  orderPlacing: false,
  orderSuccess: false,
  placeOrder: async () => {
    const { cartItems, cartTotal } = get();
    if (cartItems.length === 0) return false;
    set({ orderPlacing: true });
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((c) => ({
            dishId: c.item.id,
            quantity: c.quantity,
            addons: [],
            price: c.item.price,
          })),
          total: cartTotal(),
        }),
      });
      if (res.ok) {
        set({ cartItems: [], cartOpen: false, orderPlacing: false, orderSuccess: true });
        setTimeout(() => set({ orderSuccess: false }), 3000);
        return true;
      }
      set({ orderPlacing: false });
      return false;
    } catch {
      set({ orderPlacing: false });
      return false;
    }
  },
  resetOrder: () => set({ orderSuccess: false }),
}));

export { getBadge };