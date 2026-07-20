// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminSettings } from '@/modules/settings/hooks/useAdminSettings';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('useAdminSettings hook unit tests with store integration', () => {
  const mockToast = vi.fn();

  const mockRestaurant = {
    name: 'مطعم التجربة',
    description: 'مطعم رائع جداً',
    type: 'oriental',
    theme: 'luxury' as const,
    currency: 'SAR',
  };

  const mockUser = {
    id: 'user-1',
    name: 'أحمد سعيد',
    email: 'ahmed@test.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset store state
    useStore.setState({
      user: mockUser,
      isAuthenticated: true,
      restaurant: mockRestaurant,
      personalityMode: 'friendly',
      view: 'dashboard',
    });

    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
  });

  it('should initialize state variables with correct user and restaurant values', () => {
    const { result } = renderHook(() => useAdminSettings());

    expect(result.current.editName).toBe('أحمد سعيد');
    expect(result.current.restName).toBe('مطعم التجربة');
    expect(result.current.restDesc).toBe('مطعم رائع جداً');
    expect(result.current.restTheme).toBe('luxury');
    expect(result.current.restCurrency).toBe('SAR');
  });

  it('should trigger setUser and toast on handleSaveProfile call', () => {
    const { result } = renderHook(() => useAdminSettings());

    act(() => {
      result.current.setEditName('محمد خالد');
    });

    act(() => {
      result.current.handleSaveProfile();
    });

    expect(useStore.getState().user?.name).toBe('محمد خالد');
    expect(mockToast).toHaveBeenCalled();
  });

  it('should trigger setRestaurant and toast on handleSaveRestaurant call', () => {
    const { result } = renderHook(() => useAdminSettings());

    act(() => {
      result.current.setRestName('مطعم الشام الجديد');
    });

    act(() => {
      result.current.handleSaveRestaurant();
    });

    expect(useStore.getState().restaurant.name).toBe('مطعم الشام الجديد');
    expect(mockToast).toHaveBeenCalled();
  });

  it('should log user out and redirect view to landing page on handleLogout call', () => {
    const { result } = renderHook(() => useAdminSettings());

    act(() => {
      result.current.handleLogout();
    });

    expect(useStore.getState().user).toBeNull();
    expect(useStore.getState().view).toBe('landing');
    expect(mockToast).toHaveBeenCalled();
  });

  it('should update personalityMode and trigger toast on handleSavePersonality call', () => {
    const { result } = renderHook(() => useAdminSettings());

    act(() => {
      result.current.handleSavePersonality('professional');
    });

    expect(useStore.getState().personalityMode).toBe('professional');
    expect(mockToast).toHaveBeenCalled();
  });
});
