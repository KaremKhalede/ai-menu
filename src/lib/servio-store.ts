import { create } from 'zustand';

export type AIState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: 'popular' | 'recommended' | 'new';
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface ServioState {
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
}

export const useServioStore = create<ServioState>((set, get) => ({
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
      // Simulate AI flow
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
}));