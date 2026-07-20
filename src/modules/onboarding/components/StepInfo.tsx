'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { THEMES, CURRENCIES } from '../constants/themes';
import { slideVariants } from '../utils/animations';
import { BackButton } from './BackButton';
import type { OnboardingRestaurant } from '../types';

interface StepInfoProps {
  data: OnboardingRestaurant;
  onChange: (partial: Partial<OnboardingRestaurant>) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step 2 — Restaurant name, description, theme, and currency.
 */
export function StepInfo({ data, onChange, onNext, onBack }: StepInfoProps) {
  return (
    <motion.div variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit">
      <BackButton onBack={onBack} />

      <h2 className="text-2xl font-bold sm:text-3xl">أخبرنا عن مطعمك</h2>

      <div className="mt-6 space-y-5">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            اسم المطعم <span className="text-destructive">*</span>
          </label>
          <Input
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="مثال: مقهى السعادة"
            className="h-11 bg-background/60 text-base"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            وصف مختصر (اختياري)
          </label>
          <Textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="نصف قصير عن مطعمك..."
            className="min-h-20 bg-background/60 text-sm"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">سمة التصميم</label>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => {
              const isActive = data.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChange({ theme: t.id })}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                    isActive
                      ? 'border-[#d4a853]/60 bg-[#d4a853]/5'
                      : 'border-border bg-background/40 hover:border-border/80'
                  }`}
                >
                  {/* Color preview dots */}
                  <div className="flex gap-1.5">
                    {t.preview.map((c, i) => (
                      <div key={i} className={`size-4 rounded-full ${c}`} />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? 'text-[#d4a853]' : 'text-foreground'
                    }`}
                  >
                    {t.name}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full gold-gradient"
                    >
                      <CheckCircle2 className="size-3 text-[#0a0a0f]" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">العملة</label>
          <div className="flex gap-2 flex-wrap">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                onClick={() => onChange({ currency: c })}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  data.currency === c
                    ? 'border-[#d4a853]/60 bg-[#d4a853]/10 text-[#d4a853]'
                    : 'border-border bg-background/40 text-muted-foreground hover:border-[#d4a853]/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={onNext}
          disabled={!data.name.trim()}
          className="w-full gold-gradient text-base font-semibold hover:opacity-90"
          size="lg"
        >
          التالي
        </Button>
      </div>
    </motion.div>
  );
}
