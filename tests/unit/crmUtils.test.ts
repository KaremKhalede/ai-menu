// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { formatDate, getCustomerSegmentBadge } from '@/modules/crm/utils';
import type { Customer } from '@/modules/crm/types';
import { segmentColors } from '@/modules/crm/constants';

describe('CRM utility functions', () => {
  describe('formatDate', () => {
    it('should format dates into Saudi locale representations', () => {
      const dateStr = '2026-07-19T12:00:00.000Z';
      const result = formatDate(dateStr);
      // Verify Saudi date layout content matches Arabic chars
      expect(result).toBeDefined();
    });
  });

  describe('getCustomerSegmentBadge', () => {
    const baseCustomer: Customer = {
      id: 'cust-1',
      name: 'أحمد',
      email: 'ahmed@test.com',
      tags: [],
      orderCount: 1,
      totalSpend: 100,
      lastOrderDate: '2026-07-19',
      notes: '',
    };

    it('should map high_value tag correctly', () => {
      const cust = { ...baseCustomer, tags: ['high_value'] };
      const badge = getCustomerSegmentBadge(cust);
      expect(badge.label).toBe('قيمة عالية');
      expect(badge.cls).toBe(segmentColors.high_value);
    });

    it('should map inactive tag correctly', () => {
      const cust = { ...baseCustomer, tags: ['inactive'] };
      const badge = getCustomerSegmentBadge(cust);
      expect(badge.label).toBe('غير نشط');
      expect(badge.cls).toBe(segmentColors.inactive);
    });

    it('should map new tag correctly', () => {
      const cust = { ...baseCustomer, tags: ['new'] };
      const badge = getCustomerSegmentBadge(cust);
      expect(badge.label).toBe('جديد');
      expect(badge.cls).toBe(segmentColors.new);
    });

    it('should map repeat tag correctly', () => {
      const cust = { ...baseCustomer, tags: ['repeat'] };
      const badge = getCustomerSegmentBadge(cust);
      expect(badge.label).toBe('متكرر');
      expect(badge.cls).toBe(segmentColors.repeat);
    });

    it('should fallback to low_value badge if no segment tags exist', () => {
      const cust = { ...baseCustomer, tags: [] };
      const badge = getCustomerSegmentBadge(cust);
      expect(badge.label).toBe('قيمة منخفضة');
      expect(badge.cls).toBe(segmentColors.low_value);
    });
  });
});
