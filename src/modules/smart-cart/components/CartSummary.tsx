'use client';

import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  total: number;
  animatingTotal: boolean;
  onCheckout: () => void;
}

export function CartSummary({ total, animatingTotal, onCheckout }: CartSummaryProps) {
  return (
    <div className="border-t border-white/[0.08] bg-[#0e0e16]/80 backdrop-blur-md px-5 py-4 space-y-3 text-right" dir="rtl">
      <Separator className="opacity-0" />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">الإجمالي</span>
        <motion.span
          key={total}
          initial={animatingTotal ? { scale: 1.2 } : {}}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-lg font-bold gold-gradient-text"
        >
          {total.toFixed(2)} ر.س
        </motion.span>
      </div>
      <Button
        onClick={onCheckout}
        className="w-full h-12 gold-gradient rounded-xl text-base font-bold hover:opacity-90 transition-opacity cursor-pointer text-[#0a0a0f]"
      >
        إتمـام الطلب
      </Button>
    </div>
  );
}
