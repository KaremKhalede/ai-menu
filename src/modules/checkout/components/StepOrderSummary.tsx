'use client';

import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '../utils';
import type { UseCheckoutReturn } from '../hooks/useCheckout';

interface StepOrderSummaryProps {
  form: UseCheckoutReturn;
}

export function StepOrderSummary({ form }: StepOrderSummaryProps) {
  const { cart, cartTotal, setStep, handleClose } = form;

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="text-right"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <h2 className="text-lg font-bold text-[#f0ece4]">إتمام الطلب</h2>
        <button
          onClick={handleClose}
          className="h-8 w-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="h-4 w-4 text-[#8a8578]" />
        </button>
      </div>

      {/* Items */}
      <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.dish.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 min-w-0 justify-start">
              <span className="text-sm text-[#d4a853] font-semibold bg-[#d4a853]/10 px-2 py-0.5 rounded-md shrink-0">
                ×{item.quantity}
              </span>
              <span className="text-sm text-[#f0ece4] truncate">{item.dish.name}</span>
            </div>
            <span className="text-sm font-semibold text-[#f0ece4] shrink-0 mr-3">
              {formatPrice(item.totalPrice)} ر.س
            </span>
          </div>
        ))}
        {cart.length === 0 && (
          <p className="text-center text-sm text-[#8a8578] py-6">السلة فارغة</p>
        )}
      </div>

      {/* Separator */}
      <div className="mx-5 border-t border-white/[0.06]" />

      {/* Total */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-[#8a8578]">المجموع الكلي</span>
          <span className="text-2xl font-bold gold-gradient-text">
            {formatPrice(cartTotal)} ر.س
          </span>
        </div>
        <Button
          className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-bold text-base py-6 cursor-pointer"
          disabled={cart.length === 0}
          onClick={() => setStep(2)}
        >
          متابعة الدفع
          <ArrowRight className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </motion.div>
  );
}
