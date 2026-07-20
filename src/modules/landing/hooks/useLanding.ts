'use client';

import { useStore } from '@/lib/store';

export function useLanding() {
  const setView = useStore((s) => s.setView);

  return {
    setView,
  };
}
