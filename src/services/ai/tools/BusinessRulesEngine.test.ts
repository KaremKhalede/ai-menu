import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BusinessRulesEngine } from './BusinessRulesEngine';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    dish: {
      findFirst: vi.fn()
    }
  }
}));

describe('BusinessRulesEngine', () => {
  let engine: BusinessRulesEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new BusinessRulesEngine();
  });

  it('evaluates maximum quantity deterministically', () => {
    expect(engine.evaluateMaximumQuantity(5)).toBe(true);
    expect(engine.evaluateMaximumQuantity(25)).toBe(false);
    expect(engine.evaluateMaximumQuantity(0)).toBe(false);
    expect(engine.evaluateMaximumQuantity(-5)).toBe(false);
  });

  it('determines dish availability correctly when missing', async () => {
    vi.mocked(db.dish.findFirst).mockResolvedValue(null);
    
    const fact = await engine.evaluateDishAvailability('tenant1', 'invalid_id');
    expect(fact).toEqual({ exists: false, isAvailable: false, price: 0, name: "" });
  });

  it('determines dish availability correctly when out of stock', async () => {
    vi.mocked(db.dish.findFirst).mockResolvedValue({
      isAvailable: false,
      price: 15,
      name: 'Burger'
    } as any);
    
    const fact = await engine.evaluateDishAvailability('tenant1', 'd1');
    expect(fact).toEqual({ exists: true, isAvailable: false, price: 15, name: "Burger" });
  });

  it('determines dish availability correctly when available', async () => {
    vi.mocked(db.dish.findFirst).mockResolvedValue({
      isAvailable: true,
      price: 15,
      name: 'Burger'
    } as any);
    
    const fact = await engine.evaluateDishAvailability('tenant1', 'd1');
    expect(fact).toEqual({ exists: true, isAvailable: true, price: 15, name: "Burger" });
  });
});
