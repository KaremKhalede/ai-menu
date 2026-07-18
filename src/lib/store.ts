import { create } from 'zustand';
import type {
  ViewType,
  Category,
  CartItem,
  ChatMessage,
  Dish,
  Addon,
  User,
  Restaurant,
  AISuggestion,
  RevenueEvent,
  AIRevenueMetrics,
  PersonalityMode,
  SortCriteria,
} from './types';

interface MenuAIState {
  // Navigation
  view: ViewType;
  setView: (view: ViewType) => void;

  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;

  // Restaurant
  restaurant: Restaurant;
  setRestaurant: (r: Restaurant) => void;

  // Menu
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (dish: Dish, addons?: Addon[]) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;

  // Dish detail
  selectedDish: Dish | null;
  setSelectedDish: (dish: Dish | null) => void;

  // Checkout flow
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
  orderPlaced: boolean;
  setOrderPlaced: (placed: boolean) => void;

  // AI Revenue Engine
  aiSuggestions: AISuggestion[];
  addAISuggestion: (s: Omit<AISuggestion, 'id' | 'suggestedAt'>) => void;
  markSuggestionConverted: (dishId: string, orderValue?: number) => void;
  aiMetrics: AIRevenueMetrics | null;
  revenueEvents: RevenueEvent[];
  addRevenueEvent: (event: RevenueEvent) => void;

  // Voice Personality
  personalityMode: PersonalityMode;
  setPersonalityMode: (mode: PersonalityMode) => void;

  // Smart Sort
  sortCriteria: SortCriteria;
  setSortCriteria: (criteria: SortCriteria) => void;
  smartSortEnabled: boolean;
  toggleSmartSort: () => void;
}

export const useStore = create<MenuAIState>((set, get) => ({
  // Navigation
  view: 'landing',
  setView: (view) => set({ view }),

  // Auth
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,

  // Restaurant
  restaurant: {
    name: '',
    description: '',
    type: '',
    theme: 'luxury',
    currency: 'ر.س',
  },
  setRestaurant: (r) => set({ restaurant: r }),

  // Menu
  categories: [],
  setCategories: (cats) => set({ categories: cats }),
  selectedCategory: null,
  setSelectedCategory: (id) => set({ selectedCategory: id }),

  // Cart
  cart: [],
  addToCart: (dish, addons = []) => {
    const { cart } = get();
    const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
    const existingIndex = cart.findIndex(
      (item) =>
        item.dish.id === dish.id &&
        JSON.stringify(item.selectedAddons) === JSON.stringify(addons)
    );

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
        totalPrice:
          (dish.price + addonsPrice) * (updated[existingIndex].quantity + 1),
      };
      set({ cart: updated });
    } else {
      set({
        cart: [
          ...cart,
          {
            dish,
            quantity: 1,
            selectedAddons: addons,
            totalPrice: dish.price + addonsPrice,
          },
        ],
      });
    }
  },
  removeFromCart: (dishId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.dish.id !== dishId),
    })),
  updateQuantity: (dishId, qty) =>
    set((state) => ({
      cart:
        qty <= 0
          ? state.cart.filter((item) => item.dish.id !== dishId)
          : state.cart.map((item) =>
              item.dish.id === dishId
                ? {
                    ...item,
                    quantity: qty,
                    totalPrice:
                      (item.dish.price +
                        item.selectedAddons.reduce((s, a) => s + a.price, 0)) *
                      qty,
                  }
                : item
            ),
    })),
  clearCart: () => set({ cart: [] }),
  get cartTotal() {
    return get().cart.reduce((sum, item) => sum + item.totalPrice, 0);
  },

  // Chat
  chatMessages: [],
  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),
  clearChat: () => set({ chatMessages: [] }),
  isChatOpen: false,
  setChatOpen: (open) => set({ isChatOpen: open }),

  // Dish detail
  selectedDish: null,
  setSelectedDish: (dish) => set({ selectedDish: dish }),

  // Checkout flow
  showCheckout: false,
  setShowCheckout: (show) => set({ showCheckout: show }),
  orderPlaced: false,
  setOrderPlaced: (placed) => set({ orderPlaced: placed }),

  // AI Revenue Engine
  aiSuggestions: [],
  addAISuggestion: (s) =>
    set((state) => ({
      aiSuggestions: [
        ...state.aiSuggestions,
        {
          ...s,
          id: crypto.randomUUID(),
          suggestedAt: new Date(),
        },
      ],
    })),
  markSuggestionConverted: (dishId, orderValue) =>
    set((state) => ({
      aiSuggestions: state.aiSuggestions.map((s) =>
        s.dishId === dishId
          ? { ...s, converted: true, convertedAt: new Date(), orderValue }
          : s
      ),
    })),
  aiMetrics: null,
  revenueEvents: [],
  addRevenueEvent: (event) =>
    set((state) => ({
      revenueEvents: [...state.revenueEvents, event],
    })),

  // Voice Personality
  personalityMode: 'luxury',
  setPersonalityMode: (mode) => set({ personalityMode: mode }),

  // Smart Sort
  sortCriteria: 'profitability',
  setSortCriteria: (criteria) => set({ sortCriteria: criteria }),
  smartSortEnabled: false,
  toggleSmartSort: () => set((state) => ({ smartSortEnabled: !state.smartSortEnabled })),
}));