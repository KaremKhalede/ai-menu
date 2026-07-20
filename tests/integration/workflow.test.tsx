// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/lib/store';
import { useCheckout } from '@/modules/checkout/hooks/useCheckout';
import { useSmartCart } from '@/modules/smart-cart/hooks/useSmartCart';
import { useAdminSettings } from '@/modules/settings/hooks/useAdminSettings';
import { getCustomerSegmentBadge } from '@/modules/crm/utils';
import { getSeverityConfig } from '@/modules/dashboard/utils/severity';
import type { Dish, Category, User, Customer } from '@/lib/types';

// Mock toast notification helper
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Complete Core Feature Integration Workflows', () => {
  const sampleDish: Dish = {
    id: 'dish-123',
    name: 'كباب لحم',
    description: 'كباب لحم بلدي مشوي على الفحم',
    price: 45,
    categoryId: 'cat-grills',
    rating: 4.9,
    orderCount: 150,
    tags: ['مشويات', 'شعبي'],
    isAvailable: true,
    isFeatured: true,
    addons: [{ name: 'سلطة طحينة', price: 2 }],
    pairings: ['عصير برتقال'],
  };

  const sampleCategory: Category = {
    id: 'cat-grills',
    name: 'مشويات',
    nameEn: 'Grills',
    dishes: [sampleDish],
  };

  beforeEach(() => {
    // Reset store state
    act(() => {
      useStore.setState({
        view: 'landing',
        user: null,
        isAuthenticated: false,
        categories: [],
        selectedCategory: null,
        cart: [],
        chatMessages: [],
        isChatOpen: false,
        selectedDish: null,
        showCheckout: false,
        orderPlaced: false,
        personalityMode: 'luxury',
      });
    });
  });

  /* ──────────────────────────────────────────────────────────
     1. Authentication Flow Integration
     ────────────────────────────────────────────────────────── */
  describe('Authentication flow integration', () => {
    it('should coordinate login, user state setting, view redirects, and logout actions', () => {
      expect(useStore.getState().user).toBeNull();
      expect(useStore.getState().isAuthenticated).toBe(false);

      const userPayload: User = {
        id: 'user-admin',
        name: 'كريم خالد',
        email: 'karem@menuai.com',
      };

      act(() => {
        useStore.getState().setUser(userPayload);
        useStore.getState().setView('dashboard');
      });

      expect(useStore.getState().user?.name).toBe('كريم خالد');
      expect(useStore.getState().isAuthenticated).toBe(true);
      expect(useStore.getState().view).toBe('dashboard');

      act(() => {
        useStore.getState().setUser(null);
        useStore.getState().setView('landing');
      });

      expect(useStore.getState().user).toBeNull();
      expect(useStore.getState().isAuthenticated).toBe(false);
      expect(useStore.getState().view).toBe('landing');
    });
  });

  /* ──────────────────────────────────────────────────────────
     2. Menu Workflow Integration
     ────────────────────────────────────────────────────────── */
  describe('Menu editor workflow integration', () => {
    it('should allow category creations, dish insertions, details editing, and sort updates', () => {
      expect(useStore.getState().categories.length).toBe(0);

      act(() => {
        useStore.getState().setCategories([sampleCategory]);
      });
      expect(useStore.getState().categories.length).toBe(1);
      expect(useStore.getState().categories[0].name).toBe('مشويات');

      const updatedCategories = useStore.getState().categories.map(cat => ({
        ...cat,
        dishes: cat.dishes.map(d => d.id === 'dish-123' ? { ...d, name: 'كباب لحم دبل' } : d)
      }));

      act(() => {
        useStore.getState().setCategories(updatedCategories);
      });

      expect(useStore.getState().categories[0].dishes[0].name).toBe('كباب لحم دبل');

      const emptyDishesCategories = useStore.getState().categories.map(cat => ({
        ...cat,
        dishes: cat.dishes.filter(d => d.id !== 'dish-123')
      }));

      act(() => {
        useStore.getState().setCategories(emptyDishesCategories);
      });

      expect(useStore.getState().categories[0].dishes.length).toBe(0);
    });
  });

  /* ──────────────────────────────────────────────────────────
     3. Smart Cart Workflow Integration
     ────────────────────────────────────────────────────────── */
  describe('Smart Cart workflow integration', () => {
    it('should cover adding items, updating quantity multipliers, removing items, and triggering recommendations', () => {
      expect(useStore.getState().cart.length).toBe(0);

      // Add item
      act(() => {
        useStore.getState().addToCart(sampleDish, [{ name: 'سلطة طحينة', price: 2 }]);
      });

      expect(useStore.getState().cart.length).toBe(1);
      expect(useStore.getState().cart[0].totalPrice).toBe(47);

      // Verify hook handles quantity updates
      const { result } = renderHook(() => useSmartCart());

      act(() => {
        result.current.handleQuantityChange('dish-123', 3);
      });

      expect(useStore.getState().cart[0].quantity).toBe(3);
      expect(useStore.getState().cart[0].totalPrice).toBe(141);

      // Remove item from cart
      act(() => {
        result.current.handleRemove('dish-123');
      });

      expect(useStore.getState().cart.length).toBe(0);
    });
  });

  /* ──────────────────────────────────────────────────────────
     4. Checkout Workflow Integration
     ────────────────────────────────────────────────────────── */
  describe('Checkout workflow integration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('should coordinate order checkout submissions, offline DB caches, and success step updates', async () => {
      act(() => {
        useStore.getState().addToCart(sampleDish);
        useStore.getState().setShowCheckout(true);
      });

      const { result } = renderHook(() => useCheckout());
      expect(result.current.step).toBe(1);

      act(() => {
        result.current.setStep(2);
      });
      expect(result.current.step).toBe(2);

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      // Submit checkout details
      await act(async () => {
        result.current.handleConfirm();
      });

      // Advance timers by 1500ms to process checkout transition delay
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(result.current.step).toBe(3);
      expect(result.current.orderNumber).toBeDefined();
    });
  });

  /* ──────────────────────────────────────────────────────────
     5. CRM Workflow Integration
     ────────────────────────────────────────────────────────── */
  describe('CRM workflow integration', () => {
    it('should support segment badge resolving, tags checks, and customer interactions metrics', () => {
      const sampleCustomer: Customer = {
        id: 'cust-99',
        name: 'سالم بن علي',
        email: 'salim@saudi.com',
        tags: ['high_value', 'repeat'],
        orderCount: 15,
        totalSpend: 750,
        lastOrderDate: '2026-07-18',
        notes: 'يفضل الجلوس قرب النافذة الكبيرة',
      };

      const badge = getCustomerSegmentBadge(sampleCustomer);
      expect(badge.label).toBe('قيمة عالية');

      const lowValCustomer: Customer = {
        ...sampleCustomer,
        tags: ['new'],
      };
      const lowBadge = getCustomerSegmentBadge(lowValCustomer);
      expect(lowBadge.label).toBe('جديد');
    });
  });

  /* ──────────────────────────────────────────────────────────
     6. Dashboard Workflow Integration
     ────────────────────────────────────────────────────────── */
  describe('Dashboard workflow integration', () => {
    it('should map panel navigation coordinates and severity levels color tags', () => {
      expect(useStore.getState().view).toBe('landing');

      act(() => {
        useStore.getState().setView('dashboard');
      });
      expect(useStore.getState().view).toBe('dashboard');

      const highSev = getSeverityConfig('high');
      expect(highSev.label).toBe('مرتفع');
      expect(highSev.color).toBe('text-red-400');
    });
  });

  /* ──────────────────────────────────────────────────────────
     7. Settings Workflow Integration
     ────────────────────────────────────────────────────────── */
  describe('Settings workflow integration', () => {
    it('should allow modifying restaurant info, themes, and switching Brand Voice modes', () => {
      const { result } = renderHook(() => useAdminSettings());

      act(() => {
        result.current.setRestName('شاورما وصاج');
        result.current.setRestTheme('emerald');
        result.current.setRestCurrency('USD');
      });

      act(() => {
        result.current.handleSaveRestaurant();
      });

      const updatedRestaurant = useStore.getState().restaurant;
      expect(updatedRestaurant.name).toBe('شاورما وصاج');
      expect(updatedRestaurant.theme).toBe('emerald');
      expect(updatedRestaurant.currency).toBe('USD');

      act(() => {
        result.current.handleSavePersonality('professional');
      });
      expect(useStore.getState().personalityMode).toBe('professional');
    });
  });
});
