'use client';

import { motion } from 'framer-motion';
import { STEP_LABELS, TOTAL_STEPS } from '../constants/aiDishes';

interface ProgressBarProps {
  step: number;
}

/**
 * Animated progress bar shown at the top of every onboarding step.
 */
export function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>الخطوة {step} من {TOTAL_STEPS}</span>
        <span>{STEP_LABELS[step - 1]}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
        <motion.div
          className="h-full rounded-full gold-gradient"
          initial={{ width: '25%' }}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
