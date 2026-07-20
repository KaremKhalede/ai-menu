import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/modules/checkout/utils';

describe('formatPrice utility', () => {
  it('should format numbers to Saudi format with maximum 2 decimal digits', () => {
    // Saudi locale digits and formatting
    const result = formatPrice(123.45);
    expect(result).toContain('١٢٣');
  });

  it('should format integer numbers correctly', () => {
    const result = formatPrice(50);
    expect(result).toContain('٥٠');
  });
});
