'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RESTAURANT_TYPES } from '../constants/restaurantTypes';
import { slideVariants, stagger, fadeUp } from '../utils/animations';

interface StepTypeProps {
  selected: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}

/**
 * Step 1 — Restaurant type selector.
 * Shows a 2-column grid of type cards with a shared layout-id glow effect.
 */
export function StepType({ selected, onSelect, onNext }: StepTypeProps) {
  return (
    <motion.div variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit">
      <h2 className="text-2xl font-bold sm:text-3xl">ما نوع مطعمك؟</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        اختر النوع الأقرب لمطعمك لنتخصّص لك
      </p>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-2 gap-3 sm:gap-4"
      >
        {RESTAURANT_TYPES.map((type) => {
          const isSelected = selected === type.id;
          return (
            <motion.button
              key={type.id}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(type.id)}
              className={`relative flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all sm:p-5 ${
                isSelected
                  ? 'glass-card border-[#d4a853]/60 shadow-lg shadow-[#d4a853]/10'
                  : 'border border-border bg-background/40 hover:border-[#d4a853]/20'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="type-glow"
                  className="absolute inset-0 rounded-xl bg-[#d4a853]/5"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative text-3xl sm:text-4xl">{type.emoji}</span>
              <span className="relative text-sm font-semibold sm:text-base">{type.name}</span>
              <span className="relative text-[11px] text-muted-foreground leading-relaxed">
                {type.desc}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-8">
        <Button
          onClick={onNext}
          disabled={!selected}
          className="w-full gold-gradient text-base font-semibold hover:opacity-90"
          size="lg"
        >
          التالي
        </Button>
      </div>
    </motion.div>
  );
}
