'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DishHeatCard } from './DishHeatCard';
import { stagger } from '../constants';
import type { DishStat } from '../types';

interface DishHeatCardListProps {
  activeTitle: string;
  activeView: string;
  activeDishes: DishStat[];
  maxDishStat: number;
  valueLabel: (dish: DishStat) => string;
}

export function DishHeatCardList({
  activeTitle,
  activeView,
  activeDishes,
  maxDishStat,
  valueLabel,
}: DishHeatCardListProps) {
  return (
    <Card className="glass-card border-0 overflow-hidden h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-[#d4a853]" />
          <CardTitle className="text-base font-bold text-[#f0ece4]">
            {activeTitle}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-2.5"
          >
            {activeDishes.map((dish, i) => (
              <DishHeatCard
                key={dish.dishId}
                dish={dish}
                intensity={dish.percentage / maxDishStat}
                index={i}
                valueLabel={valueLabel(dish)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
