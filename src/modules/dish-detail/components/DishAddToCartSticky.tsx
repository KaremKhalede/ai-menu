'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { itemVariants } from '../constants';

interface DishAddToCartStickyProps {
  totalPrice: number;
  added: boolean;
  onAddToCart: () => void;
}

export function DishAddToCartSticky({ totalPrice, added, onAddToCart }: DishAddToCartStickyProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="fixed bottom-0 left-0 right-0 z-10 border-t border-primary/10 bg-background/95 px-5 py-3 backdrop-blur-md md:absolute md:bottom-0 md:left-0 md:right-0"
    >
      <Button
        size="lg"
        className={`w-full gap-2 text-base font-bold transition-all cursor-pointer ${
          added
            ? 'bg-green-600 text-white hover:bg-green-600'
            : 'gold-gradient hover:opacity-90 text-[#0a0a0f]'
        }`}
        onClick={onAddToCart}
        disabled={added}
      >
        {added ? (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              ✓
            </motion.span>
            تمت الإضافة
          </>
        ) : (
          <>
            <Plus size={18} />
            أضف إلى السلة — {totalPrice} ر.س
          </>
        )}
      </Button>
    </motion.div>
  );
}
