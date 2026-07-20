'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { trackConversion, addRevenueEvent } from '@/lib/ai-revenue-engine';
import { submitOrder } from '../services/order';
import type { Step } from '../types';

export function useCheckout() {
  const {
    cart,
    cartTotal,
    clearCart,
    showCheckout,
    setShowCheckout,
    setOrderPlaced,
    setView,
  } = useStore(
    useShallow((state) => ({
      cart: state.cart,
      cartTotal: state.cartTotal,
      clearCart: state.clearCart,
      showCheckout: state.showCheckout,
      setShowCheckout: state.setShowCheckout,
      setOrderPlaced: state.setOrderPlaced,
      setView: state.setView,
    }))
  );

  const [step, setStep] = useState<Step>(1);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber] = useState(() => `#${Math.floor(1000 + Math.random() * 9000)}`);

  const handleConfirm = async () => {
    setIsProcessing(true);

    const orderData = {
      customerName: customerName || undefined,
      tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
      total: cartTotal,
      items: cart.map((item) => ({
        dishId: item.dish.id,
        dishName: item.dish.name,
        quantity: item.quantity,
        addons: item.selectedAddons,
        price: item.totalPrice,
      })),
    };

    // Trigger api submit (automatically fallbacks to offline db inside service)
    await submitOrder(orderData);

    // Track AI conversions
    setTimeout(async () => {
      for (const item of cart) {
        try {
          await trackConversion(item.dish.id, item.totalPrice);
        } catch {
          /* best-effort tracking */
        }
      }
      addRevenueEvent({ type: 'checkout', value: cartTotal, timestamp: new Date() });
    }, 100);

    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 1500);
  };

  const handleBackToMenu = () => {
    clearCart();
    setShowCheckout(false);
    setOrderPlaced(true);
    setView('menu');
    setStep(1);
    setTimeout(() => {
      setOrderPlaced(false);
    }, 2000);
  };

  const handleClose = () => {
    setShowCheckout(false);
    setStep(1);
  };

  return {
    cart,
    cartTotal,
    showCheckout,
    step,
    setStep,
    customerName,
    setCustomerName,
    tableNumber,
    setTableNumber,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    orderNumber,
    handleConfirm,
    handleBackToMenu,
    handleClose,
  };
}

export type UseCheckoutReturn = ReturnType<typeof useCheckout>;
