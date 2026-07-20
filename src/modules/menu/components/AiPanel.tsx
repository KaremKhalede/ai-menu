'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateAIDescription } from '../utils/dish';
import type { Dish } from '../types';

interface AIPanelProps {
  /** Dish with no description — used to generate the "improve" suggestion. */
  dishWithoutDesc: Dish | undefined;
  /** Dish whose price is below the menu average — triggers the "price" suggestion. */
  cheapDish: Dish | undefined;
  /** First non-featured dish — triggers the "feature" suggestion. */
  nonFeaturedDish: Dish | undefined;
  onSuggestion: (type: 'improve' | 'price' | 'feature') => void;
}

/**
 * Right-hand sidebar (RTL left side) for AI tools:
 *   1. Luxury description generator
 *   2. Context-aware AI suggestion cards
 */
export function AiPanel({
  dishWithoutDesc,
  cheapDish,
  nonFeaturedDish,
  onSuggestion,
}: AIPanelProps) {
  /* ── Local AI generator state ── */
  const [aiDishName, setAiDishName] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!aiDishName.trim()) {
      toast.error('يرجى إدخال اسم الطبق');
      return;
    }
    setAiLoading(true);
    setTimeout(() => {
      setAiDescription(generateAIDescription(aiDishName));
      setAiLoading(false);
    }, 1000);
  }, [aiDishName]);

  const copyDescription = useCallback(() => {
    if (!aiDescription) return;
    navigator.clipboard.writeText(aiDescription);
    toast.success('تم نسخ الوصف بنجاح');
  }, [aiDescription]);

  return (
    <aside className="space-y-5">
      {/* ── AI Description Generator ── */}
      <Card className="glass-card border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#d4a853]">
            <Sparkles className="h-4 w-4" />
            مولّد الوصف الذكي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">اسم الطبق</Label>
            <Input
              value={aiDishName}
              onChange={(e) => setAiDishName(e.target.value)}
              placeholder="مثال: قهوة تركية"
              className="border-white/10 bg-white/5 text-sm text-white placeholder:text-white/25 focus:border-[#d4a853]/50 focus:ring-[#d4a853]/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">الوصف</Label>
            <Textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              placeholder="سيظهر الوصف المُولّد هنا..."
              rows={4}
              className="resize-none border-white/10 bg-white/5 text-sm leading-relaxed text-white/80 placeholder:text-white/25 focus:border-[#d4a853]/50 focus:ring-[#d4a853]/20"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={aiLoading}
              className="flex-1 gap-2 text-black font-semibold hover:bg-[#e0b965] transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#d4a853' }}
              size="sm"
            >
              {aiLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {aiLoading ? 'جارٍ التوليد...' : 'أنشئ وصف فاخر'}
            </Button>

            {aiDescription && (
              <Button
                variant="outline"
                onClick={copyDescription}
                className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                size="sm"
              >
                نسخ
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── AI Suggestions ── */}
      <Card className="glass-card border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#d4a853]">
            <Wand2 className="h-4 w-4" />
            اقتراحات AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Suggestion 1: missing description */}
          {dishWithoutDesc ? (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="mb-2 text-xs leading-relaxed text-white/60">
                أضف وصفاً جذاباً لـ{' '}
                <span className="font-semibold text-[#d4a853]">
                  {dishWithoutDesc.name}
                </span>
              </p>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
                onClick={() => onSuggestion('improve')}
              >
                تحسين
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="text-xs leading-relaxed text-white/30">
                ✅ جميع الأطباق لها أوصاف
              </p>
            </div>
          )}

          {/* Suggestion 2: low price */}
          {cheapDish ? (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="mb-2 text-xs leading-relaxed text-white/60">
                سعر{' '}
                <span className="font-semibold text-[#d4a853]">{cheapDish.name}</span>{' '}
                أقل من المتوسط بنسبة 20%
              </p>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
                onClick={() => onSuggestion('price')}
              >
                تعديل السعر
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="text-xs leading-relaxed text-white/30">✅ الأسعار مناسبة</p>
            </div>
          )}

          {/* Suggestion 3: non-featured dish */}
          {nonFeaturedDish ? (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="mb-2 text-xs leading-relaxed text-white/60">
                أنصح بجعل{' '}
                <span className="font-semibold text-[#d4a853]">
                  {nonFeaturedDish.name}
                </span>{' '}
                مميزاً هذا الأسبوع
              </p>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
                onClick={() => onSuggestion('feature')}
              >
                تمييز
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="text-xs leading-relaxed text-white/30">✅ جميع الأطباق مميزة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
