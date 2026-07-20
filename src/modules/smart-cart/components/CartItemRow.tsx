'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantityControls } from './QuantityControls';
import type { CartItem } from '@/lib/types';

interface CartItemRowProps {
  item: CartItem;
  onRemove: (dishId: string) => void;
  onQuantityChange: (dishId: string, newQty: number) => void;
}

export function CartItemRow({ item, onRemove, onQuantityChange }: CartItemRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="glass-card p-3.5 space-y-2.5 text-right"
      dir="rtl"
    >
      {/* Dish name + price row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">
            {item.dish.name}
          </h4>
          <span className="text-xs text-muted-foreground">
            {item.dish.price.toFixed(2)} ر.س
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.dish.id)}
          className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-full flex-shrink-0 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Addons */}
      {item.selectedAddons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-start">
          {item.selectedAddons.map((addon) => (
            <span
              key={addon.name}
              className="text-[11px] text-[#d4a853]/80 bg-[#d4a853]/10 px-2 py-0.5 rounded-full"
            >
              +{addon.name} ({addon.price.toFixed(2)})
            </span>
          ))}
        </div>
      )}

      {/* Quantity + line total */}
      <div className="flex items-center justify-between">
        <QuantityControls
          quantity={item.quantity}
          onDecrease={() => onQuantityChange(item.dish.id, item.quantity - 1)}
          onIncrease={() => onQuantityChange(item.dish.id, item.quantity + 1)}
        />
        <span className="text-sm font-bold gold-gradient-text">
          {item.totalPrice.toFixed(2)} ر.س
        </span>
      </div>
    </motion.div>
  );
}
