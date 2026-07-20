import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToolCallingEngine } from './ToolCallingEngine';
import { CartService } from '@/services/CartService';
import { BusinessRulesEngine } from './BusinessRulesEngine';

vi.mock('@/services/CartService', () => ({
  CartService: {
    getCart: vi.fn(),
    addItem: vi.fn(),
  }
}));

describe('ToolCallingEngine', () => {
  let engine: ToolCallingEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new ToolCallingEngine();
  });

  it('fails safely for unknown tools', async () => {
    const res = await engine.executeTool('tenant1', 'session1', 'cust1', 'unknown_tool', {});
    expect(res).toEqual({ error: 'UNKNOWN_TOOL: unknown_tool' });
  });

  it('fails safely for invalid schema (missing args)', async () => {
    const res = await engine.executeTool('tenant1', 'session1', 'cust1', 'add_to_cart', {});
    expect(res.error).toContain('Invalid input schema');
  });

  it('blocks unauthorized checkout', async () => {
    const res = await engine.executeTool('tenant1', 'session1', undefined, 'checkout', {});
    expect(res.error).toContain('Unauthorized checkout');
  });

  it('blocks cross-tenant manipulation', async () => {
    const res = await engine.executeTool('tenant1', 'session1', 'cust1', 'add_to_cart', { dishId: 'd1', quantity: 1, restaurantId: 'tenant2' });
    expect(res.error).toContain('Cross-tenant manipulation');
  });

  it('allows valid add_to_cart passing through safety and business rules', async () => {
    // Mock Business Rules
    vi.spyOn((engine as any).rulesEngine, 'evaluateDishAvailability').mockResolvedValue({
      exists: true,
      isAvailable: true,
      price: 10,
      name: 'Burger'
    });
    
    vi.mocked(CartService.addItem).mockResolvedValue({ id: 'cart1', items: [], tenantId: 'tenant1', total: 10 });

    const res = await engine.executeTool('tenant1', 'session1', 'cust1', 'add_to_cart', { dishId: 'd1', quantity: 2 });
    
    expect(res.error).toBeUndefined();
    expect(res.id).toBe('cart1');
    expect(CartService.addItem).toHaveBeenCalled();
  });
});
