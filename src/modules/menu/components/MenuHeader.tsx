'use client';

import { Eye, ArrowRight, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

/* ─────────────── MenuHeader ─────────────── */

/**
 * Sticky top navigation bar for the Menu Editor page.
 * Contains the page title and primary navigation actions.
 */
export function MenuHeader() {
  const { setView } = useStore();

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/5 px-4 py-3 sm:px-6 backdrop-blur-xl"
      style={{ background: 'rgba(10,10,15,0.85)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-[#d4a853]" />
          <h1 className="text-lg font-bold text-white sm:text-xl">محرر المنيو</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setView('menu')}
            className="gap-2 text-black font-semibold hover:bg-[#e0b965] transition-colors"
            style={{ backgroundColor: '#d4a853' }}
            size="sm"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">معاينة القائمة</span>
            <span className="sm:hidden">معاينة</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setView('dashboard')}
            className="gap-2 border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            size="sm"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">العودة للوحة التحكم</span>
            <span className="sm:hidden">رجوع</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
