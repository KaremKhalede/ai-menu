'use client';

import { motion } from 'framer-motion';
import { X, User, MapPin, CreditCard, Smartphone, Banknote, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '../utils';
import type { UseCheckoutReturn } from '../hooks/useCheckout';

interface StepPaymentDetailsProps {
  form: UseCheckoutReturn;
}

export function StepPaymentDetails({ form }: StepPaymentDetailsProps) {
  const {
    cartTotal,
    setStep,
    customerName,
    setCustomerName,
    tableNumber,
    setTableNumber,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    handleConfirm,
    handleClose,
  } = form;

  const paymentOptions = [
    {
      value: 'card',
      label: 'بطاقة',
      icon: CreditCard,
      emoji: '💳',
    },
    {
      value: 'apple',
      label: 'Apple Pay / مدى',
      icon: Smartphone,
      emoji: '📱',
    },
    {
      value: 'cash',
      label: 'كاش',
      icon: Banknote,
      emoji: '💵',
    },
  ];

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="text-right"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <h2 className="text-lg font-bold text-[#f0ece4]">تفاصيل الدفع</h2>
        <button
          onClick={handleClose}
          className="h-8 w-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="h-4 w-4 text-[#8a8578]" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Customer Name */}
        <div className="space-y-2">
          <Label className="text-sm text-[#8a8578] flex items-center gap-2 justify-start">
            <User className="h-3.5 w-3.5" />
            اسم الزبون (اختياري)
          </Label>
          <Input
            placeholder="أدخل الاسم"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="bg-white/[0.04] border-white/[0.08] text-[#f0ece4] placeholder:text-[#8a8578]/60 focus:border-[#d4a853]/50"
          />
        </div>

        {/* Table Number */}
        <div className="space-y-2">
          <Label className="text-sm text-[#8a8578] flex items-center gap-2 justify-start">
            <MapPin className="h-3.5 w-3.5" />
            رقم الطاولة (اختياري)
          </Label>
          <Input
            placeholder="مثال: 5"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            type="number"
            className="bg-white/[0.04] border-white/[0.08] text-[#f0ece4] placeholder:text-[#8a8578]/60 focus:border-[#d4a853]/50"
          />
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Label className="text-sm text-[#8a8578] block text-right">طريقة الدفع</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-2"
          >
            {paymentOptions.map((method) => (
              <label
                key={method.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all justify-start ${
                  paymentMethod === method.value
                    ? 'border-[#d4a853]/50 bg-[#d4a853]/5'
                    : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                }`}
              >
                <RadioGroupItem
                  value={method.value}
                  className="border-[#d4a853]/50 text-[#d4a853]"
                />
                <span className="text-lg">{method.emoji}</span>
                <span className="text-sm text-[#f0ece4] font-medium">{method.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
          <span className="text-sm text-[#8a8578]">المجموع</span>
          <span className="text-xl font-bold gold-gradient-text">
            {formatPrice(cartTotal)} ر.س
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <Button
            className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-bold text-base py-6 disabled:opacity-60 cursor-pointer"
            disabled={isProcessing}
            onClick={handleConfirm}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="h-5 w-5 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full"
              />
            ) : (
              <>
                تأكيد الطلب
                <CheckCircle2 className="h-4 w-4 mr-2" />
              </>
            )}
          </Button>
          <button
            onClick={() => setStep(1)}
            className="w-full text-sm text-[#8a8578] hover:text-[#f0ece4] transition-colors py-2 cursor-pointer text-center"
          >
            رجوع
          </button>
        </div>
      </div>
    </motion.div>
  );
}
