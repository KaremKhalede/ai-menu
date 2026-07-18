'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import type { Category, Dish } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Pencil,
  RefreshCw,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Star,
  GripVertical,
  Save,
  UtensilsCrossed,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

/* ───────────────────── Constants ───────────────────── */

const CUISINES = [
  { value: 'أمريكي', label: 'أمريكي' },
  { value: 'سعودي', label: 'سعودي' },
  { value: 'إيطالي', label: 'إيطالي' },
  { value: 'ياباني', label: 'ياباني' },
  { value: 'هندي', label: 'هندي' },
  { value: 'تركي', label: 'تركي' },
  { value: 'عربي عام', label: 'عربي عام' },
  { value: 'مشويات', label: 'مشويات' },
  { value: 'حلويات', label: 'حلويات' },
  { value: 'متعدد', label: 'متعدد' },
];

const PRICE_RANGES = [
  { value: 'budget', label: 'اقتصادي', range: '5-25 ر.س', icon: '💰' },
  { value: 'medium', label: 'متوسط', range: '20-60 ر.س', icon: '💳' },
  { value: 'premium', label: 'فاخر', range: '50-120 ر.س', icon: '✨' },
  { value: 'luxury', label: 'بريميوم', range: '100-300+ ر.س', icon: '👑' },
] as const;

type Step = 'input' | 'preview' | 'success';

/* ───────────────────── Animation Variants ───────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const successPop = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 15, delay: 0.2 },
  },
};

/* ───────────────────── Component ───────────────────── */

export default function AutoMenuGenerator() {
  const { setCategories, setView } = useStore();

  // Form state
  const [restaurantType, setRestaurantType] = useState('');
  const [cuisine, setCuisine] = useState('سعودي');
  const [priceRange, setPriceRange] = useState<'budget' | 'medium' | 'premium' | 'luxury'>('medium');
  const [numCategories, setNumCategories] = useState(5);

  // Flow state
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generated data
  const [restaurantName, setRestaurantName] = useState('');
  const [categories, setLocalCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingDish, setEditingDish] = useState<string | null>(null);

  // Success summary
  const [totalDishes, setTotalDishes] = useState(0);

  /* ─── Toggle category expand ─── */
  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  /* ─── Expand all ─── */
  const expandAll = useCallback(() => {
    setExpandedCategories(new Set(categories.map((c) => c.id)));
  }, [categories]);

  /* ─── Collapse all ─── */
  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  /* ─── Generate menu ─── */
  const handleGenerate = async () => {
    if (!restaurantType.trim()) {
      setError('يرجى كتابة نوع المطعم');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/generate-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantType: restaurantType.trim(),
          cuisine,
          priceRange,
          numberOfCategories: numCategories,
          dishesPerCategory: 4,
          currency: 'ر.س',
          language: 'ar',
          specialRequirements: '',
        }),
      });

      if (!res.ok) {
        throw new Error('فشل في توليد القائمة');
      }

      const data = await res.json();

      if (data.categories && data.categories.length > 0) {
        setRestaurantName(data.restaurantName || restaurantType);
        setLocalCategories(data.categories);
        // Expand first category
        setExpandedCategories(new Set([data.categories[0].id]));
        setTotalDishes(data.categories.reduce((sum: number, cat: Category) => sum + cat.dishes.length, 0));
        setStep('preview');
      } else {
        throw new Error('لم يتم توليد بيانات صالحة');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء التوليد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Update dish field ─── */
  const updateDish = (catId: string, dishId: string, field: keyof Dish, value: unknown) => {
    setLocalCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          dishes: cat.dishes.map((dish) => {
            if (dish.id !== dishId) return dish;
            return { ...dish, [field]: value };
          }),
        };
      })
    );
  };

  /* ─── Add empty dish to category ─── */
  const addDish = (catId: string) => {
    const newDish: Dish = {
      id: crypto.randomUUID(),
      name: 'طبق جديد',
      nameEn: 'New Dish',
      description: 'وصف الطبق الجديد هنا',
      price: 0,
      categoryId: catId,
      rating: 4.0,
      orderCount: 0,
      tags: ['جديد'],
      isAvailable: true,
      isFeatured: false,
      addons: [{ name: 'إضافة 1', price: 3 }],
      pairings: ['مشروب مناسب'],
    };
    setLocalCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, dishes: [...cat.dishes, newDish] };
      })
    );
    setEditingDish(newDish.id);
    setExpandedCategories((prev) => new Set(prev).add(catId));
  };

  /* ─── Save menu to store ─── */
  const handleSave = () => {
    setCategories(categories);
    setStep('success');
  };

  /* ─── Regenerate ─── */
  const handleRegenerate = () => {
    setStep('input');
  };

  /* ═══════════════════════════════════════════════════════════════
     Step 1: Input Form
     ═══════════════════════════════════════════════════════════════ */

  function StepInput() {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0ece4]">
        {/* Header */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setView('dashboard')}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-xl gold-gradient flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[#0a0a0f]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold gold-gradient-text">
                  مولّد القائمة بالذكاء الاصطناعي
                </h1>
                <p className="text-xs text-[#8a8578]">أنشئ قائمة كاملة في ثوانٍ</p>
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
              onChange={(e) => { setRestaurantType(e.target.value); setError(''); }}
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
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
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
                  className={`relative p-4 rounded-2xl text-center transition-all border ${
                    priceRange === pr.value
                      ? 'bg-[#d4a853]/10 border-[#d4a853] shadow-lg shadow-[#d4a853]/10'
                      : 'bg-[#12121a] border-white/[0.06] hover:border-[#d4a853]/20'
                  }`}
                >
                  <div className="text-2xl mb-2">{pr.icon}</div>
                  <div className={`text-sm font-bold ${priceRange === pr.value ? 'text-[#d4a853]' : 'text-[#f0ece4]'}`}>
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

          {/* Generate Button */}
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
                className="w-full h-14 text-base font-bold gold-gradient hover:opacity-90 rounded-2xl gap-3"
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

  /* ═══════════════════════════════════════════════════════════════
     Step 2: Preview & Edit
     ═══════════════════════════════════════════════════════════════ */

  function StepPreview() {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0ece4]">
        {/* Header */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setStep('input')}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold gold-gradient-text">{restaurantName}</h1>
                <p className="text-xs text-[#8a8578]">{categories.length} قسم · {totalDishes} طبق</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs text-[#8a8578] hover:text-[#f0ece4]">
                توسيع الكل
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs text-[#8a8578] hover:text-[#f0ece4]">
                طي الكل
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Categories */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {categories.map((cat, catIdx) => {
              const isExpanded = expandedCategories.has(cat.id);
              return (
                <motion.div
                  key={cat.id}
                  custom={catIdx}
                  variants={fadeUp}
                  className="glass-card overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-[#8a8578]/50 shrink-0" />
                      <span className="text-2xl">{cat.icon || '🍽️'}</span>
                      <div className="text-right">
                        <h3 className="font-bold text-base text-[#f0ece4]">{cat.name}</h3>
                        {cat.nameEn && (
                          <p className="text-[10px] text-[#8a8578]">{cat.nameEn}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-[#d4a853]/10 text-[#d4a853] text-[10px] mr-2">
                        {cat.dishes.length} طبق
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); addDish(cat.id); }}
                        className="h-7 w-7 rounded-lg bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853] hover:bg-[#d4a853]/20 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-[#8a8578]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#8a8578]" />
                      )}
                    </div>
                  </button>

                  {/* Category Dishes */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-4 space-y-3">
                          {cat.dishes.map((dish, dishIdx) => (
                            <DishCard
                              key={dish.id}
                              dish={dish}
                              isEditing={editingDish === dish.id}
                              onEdit={() => setEditingDish(editingDish === dish.id ? null : dish.id)}
                              onUpdate={(field, value) => updateDish(cat.id, dish.id, field, value)}
                              index={dishIdx}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="sticky bottom-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pt-6 pb-6 -mx-4 px-4 sm:px-6"
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSave}
                className="flex-1 h-12 text-base font-bold gold-gradient hover:opacity-90 rounded-xl gap-2"
              >
                <Save className="h-5 w-5" />
                حفظ القائمة
              </Button>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                className="flex-1 h-12 text-base font-semibold rounded-xl gap-2 border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة توليد
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     Dish Card Sub-component
     ═══════════════════════════════════════════════════════════════ */

  function DishCard({
    dish,
    isEditing,
    onEdit,
    onUpdate,
    index,
  }: {
    dish: Dish;
    isEditing: boolean;
    onEdit: () => void;
    onUpdate: (field: keyof Dish, value: unknown) => void;
    index: number;
  }) {
    return (
      <motion.div
        custom={index}
        variants={fadeUp}
        className={`relative rounded-xl border transition-all ${
          dish.isFeatured
            ? 'bg-[#d4a853]/[0.04] border-[#d4a853]/20'
            : 'bg-white/[0.02] border-white/[0.06]'
        } ${isEditing ? 'ring-1 ring-[#d4a853]/40' : ''}`}
      >
        {/* Drag handle + Featured badge row */}
        <div className="flex items-start gap-3 p-4">
          <GripVertical className="h-4 w-4 text-[#8a8578]/40 mt-1 shrink-0 cursor-grab" />

          <div className="flex-1 min-w-0 space-y-2">
            {/* Top row: name + price + badges */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={dish.name}
                    onChange={(e) => onUpdate('name', e.target.value)}
                    className="h-9 bg-[#0a0a0f] border-[#d4a853]/30 text-sm mb-2"
                    dir="rtl"
                  />
                ) : (
                  <h4 className="font-bold text-sm text-[#f0ece4] truncate">{dish.name}</h4>
                )}
                {dish.nameEn && !isEditing && (
                  <p className="text-[10px] text-[#8a8578]">{dish.nameEn}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {dish.isFeatured && (
                  <Badge className="bg-[#d4a853]/20 text-[#d4a853] border-[#d4a853]/30 text-[10px] gap-1">
                    <Crown className="h-3 w-3" />
                    مميز
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-[#d4a853]">
                  <Star className="h-3 w-3 fill-[#d4a853]" />
                  <span className="text-xs font-semibold">{dish.rating}</span>
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    value={dish.price}
                    onChange={(e) => onUpdate('price', parseFloat(e.target.value) || 0)}
                    className="w-20 h-8 bg-[#0a0a0f] border-[#d4a853]/30 text-xs text-left text-[#d4a853]"
                    dir="ltr"
                  />
                ) : (
                  <span className="text-base font-bold text-[#d4a853]">{dish.price} ر.س</span>
                )}
              </div>
            </div>

            {/* Description */}
            {isEditing ? (
              <Textarea
                value={dish.description}
                onChange={(e) => onUpdate('description', e.target.value)}
                className="h-16 bg-[#0a0a0f] border-[#d4a853]/30 text-xs resize-none"
                dir="rtl"
              />
            ) : (
              <p className="text-xs text-[#8a8578] leading-relaxed line-clamp-2">{dish.description}</p>
            )}

            {/* Tags */}
            {dish.tags.length > 0 && !isEditing && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {dish.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#8a8578]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Addons & Pairings (collapsed) */}
            {!isEditing && (
              <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-[#8a8578]/70">
                {dish.addons.length > 0 && (
                  <span>+{dish.addons.length} إضافات</span>
                )}
                {dish.pairings.length > 0 && (
                  <span>{dish.pairings.length} اقتراحات تقديم</span>
                )}
              </div>
            )}

            {/* Edit mode: addons & pairings detail */}
            {isEditing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2 border-t border-white/[0.06]">
                <div className="space-y-1">
                  <p className="text-[10px] text-[#8a8578] font-semibold">الإضافات</p>
                  {dish.addons.map((addon, ai) => (
                    <div key={ai} className="flex gap-2 items-center">
                      <Input
                        value={addon.name}
                        onChange={(e) => {
                          const newAddons = [...dish.addons];
                          newAddons[ai] = { ...addon, name: e.target.value };
                          onUpdate('addons', newAddons);
                        }}
                        className="h-7 bg-[#0a0a0f] border-white/[0.06] text-[10px]"
                        dir="rtl"
                        placeholder="اسم الإضافة"
                      />
                      <Input
                        type="number"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddons = [...dish.addons];
                          newAddons[ai] = { ...addon, price: parseFloat(e.target.value) || 0 };
                          onUpdate('addons', newAddons);
                        }}
                        className="w-16 h-7 bg-[#0a0a0f] border-white/[0.06] text-[10px] text-left"
                        dir="ltr"
                        placeholder="السعر"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#8a8578] font-semibold">اقتراحات التقديم</p>
                  {dish.pairings.map((pairing, pi) => (
                    <Input
                      key={pi}
                      value={pairing}
                      onChange={(e) => {
                        const newPairings = [...dish.pairings];
                        newPairings[pi] = e.target.value;
                        onUpdate('pairings', newPairings);
                      }}
                      className="h-7 bg-[#0a0a0f] border-white/[0.06] text-[10px]"
                      dir="rtl"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit button */}
          <button
            onClick={onEdit}
            className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isEditing
                ? 'bg-[#d4a853]/20 text-[#d4a853]'
                : 'bg-white/[0.05] text-[#8a8578] hover:text-[#f0ece4] hover:bg-white/[0.08]'
            }`}
          >
            {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-3.5 w-3.5" />}
          </button>
        </div>
      </motion.div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     Step 3: Success
     ═══════════════════════════════════════════════════════════════ */

  function StepSuccess() {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0ece4] flex items-center justify-center p-6">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full text-center space-y-8"
        >
          {/* Success Icon */}
          <motion.div variants={successPop} className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="absolute -top-1 -right-1 w-8 h-8 rounded-full gold-gradient flex items-center justify-center"
              >
                <Sparkles className="h-4 w-4 text-[#0a0a0f]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h2 className="text-2xl sm:text-3xl font-bold">
              تم إنشاء القائمة <span className="gold-gradient-text">بنجاح!</span>
            </h2>
            <p className="text-[#8a8578] text-sm">
              تم توليد قائمة طعام كاملة لمطعمك باستخدام الذكاء الاصطناعي
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="glass-card p-4 space-y-1">
              <p className="text-3xl font-bold gold-gradient-text">{categories.length}</p>
              <p className="text-xs text-[#8a8578]">قسم</p>
            </div>
            <div className="glass-card p-4 space-y-1">
              <p className="text-3xl font-bold gold-gradient-text">{totalDishes}</p>
              <p className="text-xs text-[#8a8578]">طبق</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Button
              onClick={() => setView('menu')}
              className="w-full h-12 text-base font-bold gold-gradient hover:opacity-90 rounded-xl gap-2"
            >
              <Eye className="h-5 w-5" />
              معاينة المنيو
            </Button>
            <Button
              variant="outline"
              onClick={() => setView('menu-editor')}
              className="w-full h-12 text-base font-semibold rounded-xl gap-2 border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
            >
              <Pencil className="h-4 w-4" />
              تعديل متقدم
            </Button>
            <Button
              variant="ghost"
              onClick={() => setView('dashboard')}
              className="w-full text-[#8a8578] hover:text-[#f0ece4]"
            >
              العودة للوحة التحكم
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     Main Render
     ═══════════════════════════════════════════════════════════════ */

  return (
    <div dir="rtl">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div key="input" variants={scaleIn} initial="hidden" animate="visible" exit="exit">
            <StepInput />
          </motion.div>
        )}
        {step === 'preview' && (
          <motion.div key="preview" variants={scaleIn} initial="hidden" animate="visible" exit="exit">
            <StepPreview />
          </motion.div>
        )}
        {step === 'success' && (
          <motion.div key="success" variants={scaleIn} initial="hidden" animate="visible" exit="exit">
            <StepSuccess />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}