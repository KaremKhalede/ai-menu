'use client';

import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCustomerInsights } from '@/lib/crm-engine';

interface CustomerDetailProps {
  customerId: string;
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const insight = getCustomerInsights(customerId);
  if (!insight) return null;
  const { customer } = insight;

  return (
    <div className="border-t border-white/5 p-4 bg-white/[0.01] space-y-4 text-right" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">متوسط قيمة الطلب</p>
          <p className="text-white font-bold">{insight.avgOrderValue} ر.س</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">أيام منذ آخر طلب</p>
          <p className={`font-bold ${insight.daysSinceLastOrder > 30 ? 'text-red-400' : 'text-white'}`}>
            {insight.daysSinceLastOrder} يوم
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">مستوى خطر الفقدان</p>
          <Badge
            variant="outline"
            className={
              insight.churnRiskLevel === 'مرتفع'
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : insight.churnRiskLevel === 'متوسط'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }
          >
            {insight.churnRiskLevel}
          </Badge>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-2">الأطباق المفضّلة</p>
        <div className="flex flex-wrap gap-2 justify-start">
          {customer.favoriteDishes.map((dish) => (
            <Badge key={dish} variant="outline" className="bg-[#d4a853]/10 text-[#d4a853] border-[#d4a853]/20">
              {dish}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#d4a853]/5 border border-[#d4a853]/10">
        <Sparkles className="w-4 h-4 text-[#d4a853] mt-0.5 shrink-0" />
        <p className="text-gray-300 text-sm">{insight.suggestedAction}</p>
      </div>
    </div>
  );
}
