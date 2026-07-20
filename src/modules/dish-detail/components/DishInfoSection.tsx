'use client';

import { motion } from 'framer-motion';
import { Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { itemVariants } from '../constants';
import type { Dish } from '../types';

interface DishInfoSectionProps {
  dish: Dish;
}

export function DishInfoSection({ dish }: DishInfoSectionProps) {
  return (
    <div className="flex flex-col gap-3 px-5 pt-5 text-right" dir="rtl">
      <motion.div variants={itemVariants}>
        <SheetHeader className="p-0 text-right">
          <SheetTitle className="text-xl font-extrabold leading-tight text-foreground text-right">
            {dish.name}
          </SheetTitle>
        </SheetHeader>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        {/* stars */}
        <div className="flex items-center gap-1.5" dir="ltr">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={15}
              className={
                i <= Math.round(dish.rating)
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground/30'
              }
            />
          ))}
          <span className="ms-1 text-sm font-semibold text-foreground">
            {dish.rating}
          </span>
        </div>

        {/* order count */}
        <span className="flex items-center gap-1 text-xs text-muted-foreground justify-start">
          <Users size={13} />
          {dish.orderCount} طلب
        </span>

        {/* price */}
        <span className="ms-auto text-lg font-bold text-primary">
          {dish.price} <span className="text-xs font-normal">ر.س</span>
        </span>
      </motion.div>

      {/* Description */}
      <motion.div variants={itemVariants} className="mt-2 text-right">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {dish.description}
        </p>
      </motion.div>

      {/* Tags */}
      {dish.tags.length > 0 && (
        <motion.div variants={itemVariants} className="mt-3 flex flex-wrap items-center gap-2 justify-start">
          {dish.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-primary/30 text-xs text-primary"
            >
              {tag}
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
}
