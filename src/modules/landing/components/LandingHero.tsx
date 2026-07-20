'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stats, fadeUp, stagger } from '../constants';
import type { useLanding } from '../hooks/useLanding';

interface LandingHeroProps {
  form: ReturnType<typeof useLanding>;
}

export function LandingHero({ form }: LandingHeroProps) {
  const { setView } = form;

  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-right" dir="rtl">
      {/* Decorative floating gold blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-[#d4a853]/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-[#d4a853]/8 blur-[80px]" />
        <div className="absolute top-1/2 left-10 h-40 w-40 rounded-full bg-[#d4a853]/5 blur-[64px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl"
        >
          <span className="gold-gradient-text">حوّل منيو مطعمك</span>
          <br />
          <span className="text-foreground">إلى آلة بيع ذكية</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          نظام ذكاء اصطناعي يبيع، يقترح، يحلل، ويحسّن قائمتك تلقائياً
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={() => setView('menu')}
            className="gold-gradient px-8 text-base font-semibold hover:opacity-90 cursor-pointer text-[#0a0a0f]"
          >
            جرّب المنيو الذكي
            <Sparkles className="size-4 mr-1.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setView('dashboard')}
            className="border-[#d4a853]/30 text-foreground hover:bg-[#d4a853]/10 hover:text-foreground cursor-pointer"
          >
            لوحة التحكم
            <ArrowLeft className="size-4 ml-1.5" />
          </Button>
        </motion.div>

        {/* Animated stats row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10 md:gap-16"
        >
          {stats.map((s) => (
            <motion.div
              key={s.value}
              variants={fadeUp}
              className="flex items-center gap-2 text-sm text-muted-foreground md:text-base justify-center"
            >
              <s.icon className="size-5 text-[#d4a853]" />
              <span>{s.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
