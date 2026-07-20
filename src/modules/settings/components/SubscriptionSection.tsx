'use client';

import { Crown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionCard } from './SectionCard';
import { planFeatures } from '../constants';
import type { UseAdminSettingsReturn } from '../hooks/useAdminSettings';

interface SubscriptionSectionProps {
  form: UseAdminSettingsReturn;
}

export function SubscriptionSection({ form }: SubscriptionSectionProps) {
  return (
    <SectionCard title="الاشتراك" icon={Crown}>
      <div className="mb-4 flex items-center gap-3 text-right" dir="rtl">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#d4a853]/10">
          <Crown className="size-5 text-[#d4a853]" />
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">الخطة المجانية</p>
          <p className="text-[11px] text-muted-foreground">الخطة الحالية</p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2 mb-5 text-right" dir="rtl">
        {planFeatures.map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm justify-start">
            <CheckCircle2 className="size-4 shrink-0 text-[#d4a853]/70" />
            <span className="text-muted-foreground">{f}</span>
          </div>
        ))}
      </div>

      <Button className="w-full gold-gradient text-sm font-semibold hover:opacity-90 cursor-pointer">
        <Crown className="size-4" />
        ترقية للخطة الاحترافية
      </Button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        15 يوم تجربة مجانية
      </p>
    </SectionCard>
  );
}
