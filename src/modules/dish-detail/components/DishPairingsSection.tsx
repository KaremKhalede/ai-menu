'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { SparklesIcon } from './SparklesIcon';
import { itemVariants } from '../constants';
import type { Dish } from '../types';

interface DishPairingsSectionProps {
  dish: Dish;
}

export function DishPairingsSection({ dish }: DishPairingsSectionProps) {
  if (dish.pairings.length === 0) return null;

  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-3 px-5 text-right" dir="rtl">
      <h3 className="flex items-center gap-2 text-sm font-bold text-foreground justify-start">
        <SparklesIcon />
        ينصح مع:
      </h3>
      <div className="flex flex-wrap gap-2 justify-start">
        {dish.pairings.map((pairing) => (
          <Badge key={pairing} variant="secondary" className="text-xs">
            {pairing}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}
