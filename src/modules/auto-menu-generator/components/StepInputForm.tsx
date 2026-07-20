'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CUISINES, PRICE_RANGES } from '../constants';
import type { UseAutoMenuGeneratorReturn } from '../hooks/useAutoMenuGenerator';

interface StepInputFormProps {
  form: UseAutoMenuGeneratorReturn;
}

export function StepInputForm({ form }: StepInputFormProps) {
  const {
    restaurantType,
    setRestaurantType,
    cuisine,
    setCuisine,
    priceRange,
    setPriceRange,
    numCategories,
    setNumCategories,
    loading,
    error,
    setError,
    handleGenerate,
    setView,
  } = form;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ece4] text-right" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setView('dashboard')}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1 justify-start">
            <div className="h-10 w-10 rounded-xl gold-gradient flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#0a0a0f]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold gold-gradient-text text-right">
                مولّد القائمة بالذكاء الاصطناعي
              </h1>
              <p className="text-xs text-[#8a8578] text-right">أنشئ قائمة كاملة في ثوانٍ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 py-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#d4a853]/10 border border-[#d4a853]/20 mb-2">
            <Sparkles className="h-10 w-10 text-[#d4a853]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            <span className="gold-gradient-text">وصّف مطعمك</span> ونحن نبني القائمة
          </h2>
          <p className="text-[#8a8578] text-sm max-w-md mx-auto">
            أدخل نوع مطعمك واختر التفاصيل، وسيقوم الذكاء الاصطناعي بتوليد قائمة طعام كاملة بأسماء وأوصاف وأسعار احترافية
          </p>
        </motion.div>

        {/* Restaurant Type */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <Label className="text-[#f0ece4] text-sm font-semibold">نوع المطعم</Label>
          <Input
            value={restaurantType}
            onChange={(e) => {
              setRestaurantType(e.target.value);
              setError('');
            }}
            placeholder="مثال: مطعم برجر، كافيه، مطعم سعودي..."
            className="h-12 bg-[#12121a] border-[#d4a853]/20 text-base placeholder:text-[#8a8578]/60 focus-visible:border-[#d4a853] focus-visible:ring-[#d4a853]/20"
            dir="rtl"
          />
        </motion.div>

        {/* Cuisine */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <Label className="text-[#f0ece4] text-sm font-semibold">نوع المطبخ</Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CUISINES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCuisine(c.value)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                  cuisine === c.value
                    ? 'bg-[#d4a853]/15 border-[#d4a853] text-[#d4a853]'
                    : 'bg-[#12121a] border-white/[0.06] text-[#8a8578] hover:border-[#d4a853]/30 hover:text-[#f0ece4]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Price Range */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Label className="text-[#f0ece4] text-sm font-semibold">مستوى الأسعار</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRICE_RANGES.map((pr) => (
              <button
                key={pr.value}
                onClick={() => setPriceRange(pr.value)}
                className={`relative p-4 rounded-2xl text-center transition-all border cursor-pointer ${
                  priceRange === pr.value
                    ? 'bg-[#d4a853]/10 border-[#d4a853] shadow-lg shadow-[#d4a853]/10'
                    : 'bg-[#12121a] border-white/[0.06] hover:border-[#d4a853]/20'
                }`}
              >
                <div className="text-2xl mb-2">{pr.icon}</div>
                <div
                  className={`text-sm font-bold ${
                    priceRange === pr.value ? 'text-[#d4a853]' : 'text-[#f0ece4]'
                  }`}
                >
                  {pr.label}
                </div>
                <div className="text-[10px] text-[#8a8578] mt-1">{pr.range}</div>
                {priceRange === pr.value && (
                  <div className="absolute top-2 left-2">
                    <Check className="h-3.5 w-3.5 text-[#d4a853]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Number of Categories */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Label className="text-[#f0ece4] text-sm font-semibold">عدد الأقسام</Label>
            <span className="text-lg font-bold gold-gradient-text">{numCategories}</span>
          </div>
          <Slider
            value={[numCategories]}
            onValueChange={(v) => setNumCategories(v[0])}
            min={3}
            max={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-[#8a8578]">
            <span>3 أقسام</span>
            <span>8 أقسام</span>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button / Loading Wave */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-6 py-10">
              <div className="text-center">
                <div className="gold-gradient-text text-2xl font-black mb-3">MenuAI</div>
                <p className="text-[#8a8578] text-sm">جارٍ توليد القائمة...</p>
                <p className="text-[#8a8578]/60 text-xs mt-1">يستغرق عادةً 5-10 ثوانٍ</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 h-10">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="voice-wave-bar"
                    style={{
                      animationDelay: `${i * 0.12}s`,
                      height: '8px',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Button
              onClick={handleGenerate}
              className="w-full h-14 text-base font-bold gold-gradient hover:opacity-90 rounded-2xl gap-3 cursor-pointer"
            >
              <Sparkles className="h-5 w-5" />
              توليد القائمة بالذكاء الاصطناعي
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
