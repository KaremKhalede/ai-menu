'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import type { Dish, Addon } from '../types';
import { calculateTotalPrice, getDishEmoji } from '../utils';
import { gradients } from '../constants';

export function useDishDetail() {
  const { selectedDish, setSelectedDish, addToCart, setChatOpen } = useStore(
    useShallow((state) => ({
      selectedDish: state.selectedDish,
      setSelectedDish: state.setSelectedDish,
      addToCart: state.addToCart,
      setChatOpen: state.setChatOpen,
    }))
  );
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [added, setAdded] = useState(false);

  // Side sheet desktop/mobile detector
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset local addons and added states when selected dish changes
  useEffect(() => {
    setSelectedAddons([]);
    setAdded(false);
  }, [selectedDish]);

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) return prev.filter((a) => a.name !== addon.name);
      return [...prev, addon];
    });
  };

  const totalPrice = selectedDish
    ? calculateTotalPrice(selectedDish.price, selectedAddons)
    : 0;

  const emoji = selectedDish ? getDishEmoji(selectedDish) : '🍽️';
  const gradient = selectedDish
    ? gradients[selectedDish.id.charCodeAt(1) % gradients.length]
    : gradients[0];

  const handleAddToCart = (onClose: () => void) => {
    if (selectedDish) {
      addToCart(selectedDish, selectedAddons);
      setAdded(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleAIChat = (onClose: () => void) => {
    onClose();
    setChatOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedDish(null);
  };

  const handleClose = () => {
    setSelectedDish(null);
  };

  return {
    selectedDish,
    isDesktop,
    selectedAddons,
    added,
    totalPrice,
    emoji,
    gradient,
    toggleAddon,
    handleAddToCart,
    handleAIChat,
    handleOpenChange,
    handleClose,
  };
}

export type UseDishDetailReturn = ReturnType<typeof useDishDetail>;
