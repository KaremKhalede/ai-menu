'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { useLanding } from '../hooks/useLanding';

interface LandingNavProps {
  form: ReturnType<typeof useLanding>;
}

export function LandingNav({ form }: LandingNavProps) {
  const { setView } = form;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-card !rounded-none border-x-0 border-t-0 px-4 py-3 md:px-8 text-right"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo — right side in RTL */}
        <span className="text-2xl font-bold gold-gradient-text select-none">
          MenuAI
        </span>

        {/* Links — left side in RTL */}
        <div className="hidden items-center gap-6 md:flex">
          <button
            onClick={() =>
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            المميزات
          </button>
          <button
            onClick={() => setView('login')}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setView('dashboard')}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            لوحة التحكم
          </button>
          <button
            onClick={() => setView('menu-editor')}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            محرر المنيو
          </button>
        </div>

        <Button
          onClick={() => setView('login')}
          className="gold-gradient text-sm font-semibold hover:opacity-90 cursor-pointer text-[#0a0a0f]"
        >
          تسجيل الدخول
        </Button>
      </div>
    </motion.nav>
  );
}
