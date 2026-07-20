'use client';

import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { itemVariants } from '../constants';
import type { Dish } from '../types';

interface DishHeroSectionProps {
  dish: Dish;
  emoji: string;
  gradient: string;
}

export function DishHeroSection({ dish, emoji, gradient }: DishHeroSectionProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${gradient} md:h-56`}
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-7xl md:text-8xl"
      >
        {emoji}
      </motion.span>

      {dish.isFeatured && (
        <Badge className="absolute top-4 start-4 gap-1 bg-primary/90 text-primary-foreground">
          <ChefHat size={12} />
          يوصي به الذكاء الاصطناعي
        </Badge>
      )}
    </motion.div>
  );
}
