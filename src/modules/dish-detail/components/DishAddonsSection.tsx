'use client';

import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { itemVariants } from '../constants';
import type { Dish, Addon } from '../types';

interface DishAddonsSectionProps {
  dish: Dish;
  selectedAddons: Addon[];
  onToggleAddon: (addon: Addon) => void;
}

export function DishAddonsSection({ dish, selectedAddons, onToggleAddon }: DishAddonsSectionProps) {
  if (dish.addons.length === 0) return null;

  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-3 px-5 text-right" dir="rtl">
      <h3 className="text-sm font-bold text-foreground">إضافات</h3>
      <div className="flex flex-col gap-2.5">
        {dish.addons.map((addon) => {
          const isSelected = selectedAddons.some((a) => a.name === addon.name);
          return (
            <label
              key={addon.name}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all justify-start ${
                isSelected
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border hover:border-primary/20'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleAddon(addon)}
                className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="flex-1 text-sm text-foreground text-right">{addon.name}</span>
              <span className="text-sm font-semibold text-primary">+{addon.price} ر.س</span>
            </label>
          );
        })}
      </div>
    </motion.div>
  );
}
