'use client';

import { motion } from 'framer-motion';
import { Bot, UtensilsCrossed, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { demoDishes, fadeUp } from '../constants';
import type { useLanding } from '../hooks/useLanding';

interface LandingDemoPreviewProps {
  form: ReturnType<typeof useLanding>;
}

export function LandingDemoPreview({ form }: LandingDemoPreviewProps) {
  const { setView } = form;

  return (
    <section className="px-4 py-20 md:py-28 text-right" dir="rtl">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            شاهد النظام <span className="gold-gradient-text">في العمل</span>
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-muted-foreground">
            واجهة أنيقة تعمل على أي جهاز — جرّبها الآن
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto flex flex-col items-center"
        >
          {/* Phone frame */}
          <div className="relative w-[280px] rounded-[2.5rem] border border-[#d4a853]/15 bg-[#0e0e16] p-2 shadow-2xl shadow-[#d4a853]/5 sm:w-[300px]">
            {/* Notch */}
            <div className="mx-auto mb-2 h-6 w-28 rounded-full bg-background" />

            {/* Screen */}
            <div className="rounded-[2rem] bg-background px-4 pb-5 pt-3">
              {/* Mini header */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">القائمة</span>
                <div className="flex size-7 items-center justify-center rounded-full bg-[#d4a853]/10">
                  <Bot className="size-3.5 text-[#d4a853]" />
                </div>
              </div>

              {/* Mini dish cards */}
              <div className="flex flex-col gap-2.5">
                {demoDishes.map((dish) => (
                  <div
                    key={dish.name}
                    className="glass-card flex items-center justify-between p-2.5 text-right"
                    dir="rtl"
                  >
                    <div className="flex items-center gap-2.5 justify-start">
                      {/* Placeholder food image */}
                      <div className="flex size-10 items-center justify-center rounded-lg bg-[#d4a853]/10">
                        <UtensilsCrossed className="size-4 text-[#d4a853]/60" />
                      </div>
                      <div className="text-start">
                        <p className="text-xs font-medium leading-tight">{dish.name}</p>
                        <p className="mt-0.5 text-[11px] text-[#d4a853] font-bold text-right" dir="ltr">{dish.price}</p>
                      </div>
                    </div>
                    {dish.popular && (
                      <span className="rounded-full bg-[#d4a853]/15 px-2 py-0.5 text-[10px] font-medium text-[#d4a853]">
                        الأكثر طلباً
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            onClick={() => setView('menu')}
            className="gold-gradient mt-10 px-8 text-base font-semibold hover:opacity-90 cursor-pointer text-[#0a0a0f]"
          >
            جرّب بنفسك
            <ChevronLeft className="size-4 ml-1.5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
