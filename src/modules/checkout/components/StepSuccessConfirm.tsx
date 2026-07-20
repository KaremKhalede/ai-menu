'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfettiParticles } from './ConfettiParticles';
import type { UseCheckoutReturn } from '../hooks/useCheckout';

interface StepSuccessConfirmProps {
  form: UseCheckoutReturn;
}

export function StepSuccessConfirm({ form }: StepSuccessConfirmProps) {
  const { orderNumber, handleBackToMenu } = form;

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative text-right"
      dir="rtl"
    >
      <ConfettiParticles />

      <div className="p-8 flex flex-col items-center text-center relative z-10">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.15,
            duration: 0.5,
            type: 'spring',
            stiffness: 150,
          }}
          className="mb-6"
        >
          <div className="h-20 w-20 rounded-full bg-[#d4a853]/15 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-[#d4a853]" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-2xl font-bold text-[#f0ece4] mb-2"
        >
          تم الطلب بنجاح!
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="text-sm text-[#8a8578] mb-6 max-w-xs leading-relaxed"
        >
          سيتم تحضير طلبك خلال 10-15 دقيقة
        </motion.p>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="glass-card px-6 py-3 mb-8 border-[#d4a853]/25"
        >
          <p className="text-xs text-[#8a8578] mb-0.5">رقم الطلب</p>
          <p className="text-2xl font-bold gold-gradient-text">{orderNumber}</p>
        </motion.div>

        {/* Back to Menu */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="w-full"
        >
          <Button
            className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-bold text-base py-6 cursor-pointer"
            onClick={handleBackToMenu}
          >
            العودة للقائمة
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
