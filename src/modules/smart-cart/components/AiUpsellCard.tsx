'use client';

import { motion } from 'framer-motion';
import { Sparkles, ChefHat, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Dish } from '@/lib/types';
import type { UpsellSuggestion } from '../types';

interface AiUpsellCardProps {
  suggestion: UpsellSuggestion;
  onAdd: (dish: Dish) => void;
}

export function AiUpsellCard({ suggestion, onAdd }: AiUpsellCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="mt-3 border border-[#d4a853]/25 rounded-xl bg-gradient-to-br from-[#d4a853]/[0.06] to-transparent p-4 space-y-3 text-right"
      dir="rtl"
    >
      <div className="flex items-center gap-2 justify-start">
        <Sparkles className="w-4 h-4 text-[#d4a853]" />
        <span className="text-sm font-bold text-[#d4a853]">🤖 اقتراح ذكي</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {suggestion.message}
      </p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 justify-start">
          <div className="w-8 h-8 rounded-lg bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
            {suggestion.type === 'drink' ? (
              <span className="text-base">🥤</span>
            ) : (
              <ChefHat className="w-4 h-4 text-[#d4a853]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {suggestion.dish.name}
            </p>
            <p className="text-xs text-muted-foreground text-right">
              {suggestion.dish.price.toFixed(2)} ر.س
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => onAdd(suggestion.dish)}
          className="h-8 px-3 gold-gradient rounded-lg hover:opacity-90 flex-shrink-0 text-xs font-bold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 ml-1" />
          أضف
        </Button>
      </div>
    </motion.div>
  );
}
