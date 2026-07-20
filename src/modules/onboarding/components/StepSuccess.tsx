'use client';

import { CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { slideVariants, fadeUp, stagger, bounceIn } from '../utils/animations';

interface StepSuccessProps {
  onGoMenu: () => void;
  onGoDashboard: () => void;
}

/**
 * Step 4 — Celebration / welcome screen shown after onboarding completes.
 */
export function StepSuccess({ onGoMenu, onGoDashboard }: StepSuccessProps) {
  return (
    <motion.div
      variants={slideVariants}
      custom={1}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center text-center py-4"
    >
      {/* Animated check icon */}
      <motion.div
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        className="mb-6 flex size-24 items-center justify-center rounded-full bg-[#d4a853]/10"
      >
        <CheckCircle2 className="size-14 text-[#d4a853]" />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-2xl font-bold sm:text-3xl"
      >
        مرحباً بك في MenuAI! 🎉
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-3 max-w-sm text-sm text-muted-foreground"
      >
        تم إعداد مطعمك بنجاح. جاهز لبدء استقبال الطلبات!
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mt-10 w-full flex flex-col gap-3"
      >
        <motion.div variants={fadeUp}>
          <Button
            onClick={onGoMenu}
            className="w-full gold-gradient text-base font-semibold hover:opacity-90"
            size="lg"
          >
            <Sparkles className="size-4" />
            افتح المنيو الذكي
          </Button>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Button
            onClick={onGoDashboard}
            variant="outline"
            className="w-full border-[#d4a853]/30 text-foreground hover:bg-[#d4a853]/10 hover:text-foreground"
            size="lg"
          >
            لوحة التحكم
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
