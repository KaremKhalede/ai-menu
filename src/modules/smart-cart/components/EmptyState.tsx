'use client';

import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClose: () => void;
}

export function EmptyState({ onClose }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center">
        <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-foreground">سلتك فارغة</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
          أضف أطباقاً من القائمة لبدء الطلب
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onClose}
        className="mt-2 rounded-xl border-[#d4a853]/40 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] px-6 cursor-pointer"
      >
        استعرض القائمة
      </Button>
    </div>
  );
}
