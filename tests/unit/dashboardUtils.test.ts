import { describe, it, expect } from 'vitest';
import { getSeverityConfig, getInsightBorder, getInsightIconClass } from '@/modules/dashboard/utils/severity';

describe('Dashboard helper utilities', () => {
  describe('getSeverityConfig', () => {
    it('should map high severity config correctly', () => {
      const config = getSeverityConfig('high');
      expect(config.color).toBe('text-red-400');
      expect(config.label).toBe('مرتفع');
    });

    it('should map medium severity config correctly', () => {
      const config = getSeverityConfig('medium');
      expect(config.color).toBe('text-amber-400');
      expect(config.label).toBe('متوسط');
    });

    it('should map low severity config correctly', () => {
      const config = getSeverityConfig('low');
      expect(config.color).toBe('text-emerald-400');
      expect(config.label).toBe('منخفض');
    });
  });

  describe('getInsightBorder', () => {
    it('should return correct border class for success type', () => {
      expect(getInsightBorder('success')).toBe('border-emerald-500/30');
    });

    it('should return correct border class for warning type', () => {
      expect(getInsightBorder('warning')).toBe('border-amber-500/30');
    });

    it('should return correct border class for info type', () => {
      expect(getInsightBorder('info')).toBe('border-orange-500/30');
    });
  });

  describe('getInsightIconClass', () => {
    it('should return correct icon class for success type', () => {
      expect(getInsightIconClass('success')).toContain('text-emerald-400');
    });

    it('should return correct icon class for warning type', () => {
      expect(getInsightIconClass('warning')).toContain('text-amber-400');
    });

    it('should return correct icon class for info type', () => {
      expect(getInsightIconClass('info')).toContain('text-orange-400');
    });
  });
});
