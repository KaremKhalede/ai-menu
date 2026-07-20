'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import type { Dish } from '@/lib/types';
import { getUpsellSuggestion } from '../utils';

export function useSmartCart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setShowCheckout,
    categories,
    addToCart,
  } = useStore(
    useShallow((state) => ({
      cart: state.cart,
      removeFromCart: state.removeFromCart,
      updateQuantity: state.updateQuantity,
      cartTotal: state.cartTotal,
      setShowCheckout: state.setShowCheckout,
      categories: state.categories,
      addToCart: state.addToCart,
    }))
  );

  const [animatingTotal, setAnimatingTotal] = useState(false);

  const totalDisplay = cartTotal;

  const upsellSuggestion = useMemo(() => {
    return getUpsellSuggestion(totalDisplay, categories);
  }, [categories, totalDisplay]);

  const handleAddUpsell = (dish: Dish) => {
    addToCart(dish);
    setAnimatingTotal(true);
    setTimeout(() => setAnimatingTotal(false), 300);
  };

  const handleQuantityChange = (dishId: string, newQty: number) => {
    updateQuantity(dishId, newQty);
    setAnimatingTotal(true);
    setTimeout(() => setAnimatingTotal(false), 300);
  };

  const handleRemove = (dishId: string) => {
    removeFromCart(dishId);
    setAnimatingTotal(true);
    setTimeout(() => setAnimatingTotal(false), 300);
  };

  return {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setShowCheckout,
    categories,
    addToCart,
    animatingTotal,
    totalDisplay,
    upsellSuggestion,
    handleAddUpsell,
    handleQuantityChange,
    handleRemove,
  };
}

export type UseSmartCartReturn = ReturnType<typeof useSmartCart>;
