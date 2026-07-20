'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { useLanding } from '../hooks/useLanding';

interface LandingCTAProps {
  form: ReturnType<typeof useLanding>;
}

export function LandingCTA({ form }: LandingCTAProps) {
  const { setView } = form;

  return (
    <section className="px-4 py-20 md:py-28 text-right" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl overflow-hidden rounded-2xl"
      >
        <div className="gold-gradient px-6 py-14 text-center md:px-12 md:py-20">
          <h2 className="text-2xl font-bold text-background md:text-4xl">
            ابدأ رحلتك الآن مجاناً
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-background/70 md:text-base">
            انضم إلى مئات المطاعم التي تستخدم MenuAI لزيادة مبيعاتها
          </p>
          <Button
            size="lg"
            onClick={() => setView('login')}
            className="mt-8 bg-background px-8 text-base font-semibold text-[#d4a853] hover:bg-background/90 cursor-pointer"
          >
            ابدأ مجاناً
            <Sparkles className="size-4 mr-1.5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
