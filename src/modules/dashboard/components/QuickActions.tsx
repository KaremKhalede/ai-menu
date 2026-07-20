'use client';

import { motion } from 'framer-motion';
import { Star, Sparkles, UtensilsCrossed, MapPin, UserCheck, ArrowDownUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ViewType } from '@/lib/types';

interface QuickActionsProps {
  onNavigate: (view: ViewType) => void;
  onSmartSort: () => void;
}

/**
 * Quick actions card — navigation shortcuts to other dashboard sections.
 */
export function QuickActions({ onNavigate, onSmartSort }: QuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.25, duration: 0.5 }}
    >
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#d4a853]" />
            <CardTitle className="text-lg font-bold text-[#f0ece4]">إجراءات سريعة</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <Button
            className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-semibold justify-center gap-2"
            onClick={() => onNavigate('auto-menu-generator')}
          >
            <Sparkles className="h-4 w-4" />
            توليد قائمة بالذكاء الاصطناعي
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
            onClick={() => onNavigate('menu')}
          >
            <UtensilsCrossed className="h-4 w-4" />
            عرض المنيو
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
            onClick={() => onNavigate('heatmap')}
          >
            <MapPin className="h-4 w-4" />
            خريطة حرارية
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
            onClick={() => onNavigate('crm')}
          >
            <UserCheck className="h-4 w-4" />
            CRM وإعادة استهداف
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] font-semibold justify-center gap-2"
            onClick={onSmartSort}
          >
            <ArrowDownUp className="h-4 w-4" />
            ترتيب ذكي للمنيو
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
