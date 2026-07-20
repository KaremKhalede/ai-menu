import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatPrice } from '@/modules/checkout/utils';
import { submitOrder } from '@/modules/checkout/services/order';
import { addPendingOrder } from '@/lib/offline-db';
import type { OrderPayload } from '@/modules/checkout/types';

// Mock offline-db
vi.mock('@/lib/offline-db', () => ({
  addPendingOrder: vi.fn(),
}));

describe('Checkout utilities & services', () => {
  describe('formatPrice', () => {
    it('should format numbers to Saudi currency digits', () => {
      expect(formatPrice(10)).toContain('١٠');
      expect(formatPrice(99.99)).toContain('٩٩٫٩٩');
    });
  });

  describe('submitOrder service', () => {
    const sampleOrder: OrderPayload = {
      customerName: 'أحمد',
      tableNumber: 4,
      total: 150,
      items: [
        {
          dishId: 'dish-1',
          dishName: 'كنافة',
          quantity: 2,
          addons: [{ name: 'قشطة', price: 5 }],
          price: 50,
        },
      ],
    };

    beforeEach(() => {
      vi.clearAllMocks();
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should POST order data to /api/order on online mode', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      await submitOrder(sampleOrder);

      expect(mockFetch).toHaveBeenCalledWith('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleOrder),
      });
      expect(addPendingOrder).not.toHaveBeenCalled();
    });

    it('should fallback to offline DB when API request fails (network error)', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      await submitOrder(sampleOrder);

      expect(addPendingOrder).toHaveBeenCalledWith(sampleOrder);
    });

    it('should fallback to offline DB when API response is not ok', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      global.fetch = mockFetch;

      await submitOrder(sampleOrder);

      expect(addPendingOrder).toHaveBeenCalledWith(sampleOrder);
    });
  });
});
