'use client';

import { ChefHat, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SectionCard } from './SectionCard';
import { themes, currencies } from '../constants';
import type { UseAdminSettingsReturn } from '../hooks/useAdminSettings';

interface RestaurantInfoSectionProps {
  form: UseAdminSettingsReturn;
}

export function RestaurantInfoSection({ form }: RestaurantInfoSectionProps) {
  const {
    restName,
    setRestName,
    restDesc,
    setRestDesc,
    restTheme,
    setRestTheme,
    restCurrency,
    setRestCurrency,
    handleSaveRestaurant,
  } = form;

  return (
    <SectionCard title="معلومات المطعم" icon={ChefHat}>
      <div className="space-y-4 text-right" dir="rtl">
        {/* Restaurant name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground text-right">
            اسم المطعم
          </label>
          <Input
            value={restName}
            onChange={(e) => setRestName(e.target.value)}
            className="h-10 bg-background/60 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground text-right">
            الوصف
          </label>
          <Textarea
            value={restDesc}
            onChange={(e) => setRestDesc(e.target.value)}
            className="min-h-20 bg-background/60 text-sm resize-none"
            placeholder="نصف قصير عن مطعمك..."
          />
        </div>

        {/* Theme */}
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground text-right">
            سمة التصميم
          </label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const isActive = restTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setRestTheme(t.id)}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#d4a853]/60 bg-[#d4a853]/5'
                      : 'border-border bg-background/40 hover:border-border/80'
                  }`}
                >
                  <div className="flex gap-1.5">
                    {t.preview.map((c, i) => (
                      <div key={i} className={`size-4 rounded-full ${c}`} />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-semibold ${isActive ? 'text-[#d4a853]' : 'text-foreground'}`}
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
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground text-right">
            العملة
          </label>
          <div className="flex flex-wrap gap-2 justify-start">
            {currencies.map((c) => (
              <button
                key={c}
                onClick={() => setRestCurrency(c)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  restCurrency === c
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

      <Button
        onClick={handleSaveRestaurant}
        className="mt-5 gold-gradient text-sm font-semibold hover:opacity-90 cursor-pointer"
      >
        <Save className="size-4" />
        حفظ
      </Button>
    </SectionCard>
  );
}
