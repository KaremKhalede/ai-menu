'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AI_GENERATED_DISHES } from '../constants/aiDishes';
import { slideVariants, stagger, fadeUp } from '../utils/animations';
import { BackButton } from './BackButton';

interface StepAIProps {
  type: string;
  acceptAI: boolean;
  setAcceptAI: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step 3 — AI menu generation offer.
 * Has its own local state for the generating / generated phases.
 */
export function StepAI({ type: _type, acceptAI, setAcceptAI, onNext, onBack }: StepAIProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (generated) { onNext(); return; }
    if (!acceptAI) { onNext(); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <motion.div variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit">
      <BackButton onBack={onBack} />

      {/* Header */}
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#d4a853]/10"
        >
          <Sparkles className="size-8 text-[#d4a853]" />
        </motion.div>
        <h2 className="text-2xl font-bold sm:text-3xl">✨ هل تريد أن يولد AI قائمتك؟</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          يمكن لذكاء الاصطناعي إنشاء قائمة طعام كاملة بناءً على نوع مطعمك
        </p>
      </div>

      {/* Options (shown before generating/generated) */}
      {!generating && !generated && (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-col gap-3"
        >
          {/* Accept AI option */}
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setAcceptAI(true)}
            className={`flex items-center gap-3 rounded-xl p-4 text-right transition-all ${
              acceptAI
                ? 'gold-gradient shadow-lg shadow-[#d4a853]/15'
                : 'border border-border bg-background/40 hover:border-[#d4a853]/30'
            }`}
          >
            <Sparkles className={`size-5 ${acceptAI ? 'text-[#0a0a0f]' : 'text-[#d4a853]'}`} />
            <div>
              <span className={`text-base font-semibold ${acceptAI ? 'text-[#0a0a0f]' : 'text-foreground'}`}>
                نعم، أنشئ قائمة ذكية
              </span>
              <p className={`mt-0.5 text-xs ${acceptAI ? 'text-[#0a0a0f]/60' : 'text-muted-foreground'}`}>
                قائمة كاملة جاهزة خلال ثوانٍ
              </p>
            </div>
          </motion.button>

          {/* Decline AI option */}
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setAcceptAI(false)}
            className={`flex items-center gap-3 rounded-xl p-4 text-right transition-all ${
              !acceptAI
                ? 'border-2 border-[#d4a853]/50 bg-[#d4a853]/5'
                : 'border border-border bg-background/40 hover:border-[#d4a853]/30'
            }`}
          >
            <UtensilsCrossed className="size-5 text-muted-foreground" />
            <div>
              <span className="text-base font-semibold text-foreground">لا، سأضيف الأطباق بنفسي</span>
              <p className="mt-0.5 text-xs text-muted-foreground">تحكم كامل في إضافة الأطباق يدوياً</p>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Generating spinner */}
      {generating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="size-12 text-[#d4a853]" />
          </motion.div>
          <p className="mt-4 text-sm font-semibold text-foreground">جارٍ توليد القائمة...</p>
          <p className="mt-1 text-xs text-muted-foreground">AI يحلل نوع مطعمك ويقترح أفضل الأطباق</p>
        </motion.div>
      )}

      {/* Generated dishes preview */}
      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[#d4a853]" />
            <span className="text-sm font-semibold text-foreground">
              تم توليد {AI_GENERATED_DISHES.length} أطباق
            </span>
          </div>
          <div className="space-y-2">
            {AI_GENERATED_DISHES.map((dish, i) => (
              <motion.div
                key={dish.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card flex items-center justify-between p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{dish.name}</p>
                  <p className="text-[11px] text-muted-foreground">{dish.category}</p>
                </div>
                <span className="text-sm font-bold text-[#d4a853]">{dish.price}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            يمكنك تعديل أو إضافة المزيد من الأطباق لاحقاً
          </p>
        </motion.div>
      )}

      {/* Action button */}
      {!generating && (
        <div className="mt-8">
          <Button
            onClick={handleGenerate}
            className="w-full gold-gradient text-base font-semibold hover:opacity-90"
            size="lg"
          >
            {generated ? 'إنهاء الإعداد' : acceptAI ? 'توليد القائمة الآن' : 'التالي'}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
