'use client';

import { useStore } from '@/lib/store';
import type { Category, Dish, Addon } from '@/lib/types';
import {
  ArrowRight,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Image as ImageIcon,
  Tag,
  DollarSign,
  AlignRight,
  Star,
  Save,
  Eye,
  Wand2,
  X,
  ChevronDown,
  ChevronUp,
  Edit3,
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/* ─────────────── emoji map ─────────────── */
const dishEmojiMap: [string, string][] = [
  ['قهوة', '☕'],
  ['شاي', '🍵'],
  ['شوربة', '🍲'],
  ['سلطة', '🥗'],
  ['برجر', '🍔'],
  ['بيتزا', '🍕'],
  ['باستا', '🍝'],
  ['سوشي', '🍣'],
  ['كعك', '🧁'],
  ['كيك', '🎂'],
  ['آيس', '🍦'],
  ['عصير', '🧃'],
  ['سمك', '🐟'],
  ['دجاج', '🍗'],
  ['لحم', '🥩'],
  ['ريزوتو', '🍚'],
  ['ستيك', '🥩'],
  ['مشويات', '🔥'],
  ['حلو', '🍮'],
  ['شوكولا', '🍫'],
  ['توست', '🍞'],
  ['ساندوي', '🥪'],
  ['فطير', '🥧'],
  ['كرواسون', '🥐'],
  ['بان', '🥖'],
];

function getDishEmoji(name: string): string {
  for (const [key, emoji] of dishEmojiMap) {
    if (name.includes(key)) return emoji;
  }
  return '🍽️';
}

/* ─────────────── AI description generator ─────────────── */
const descriptionTemplates: [string, string][] = [
  [
    'قهوة',
    'قهوة مختصة محمصة بعناية، تقدم بنكهة غنية ومتوازنة مع رائحة جذابة تملأ المكان',
  ],
  [
    'شوربة',
    'حساء دافئ يُحضّر بمكونات طازجة ومختارة بعناية، يقدم كبداية مثالية لوجبتك',
  ],
  [
    'سلطة',
    'سلطة طازجة ومقرمشة تُحضّر من أجود الخضروات الموسمية مع تتبيلة خاصة تمنحها نكهة فريدة لا تُنسى',
  ],
  [
    'برجر',
    'برجر فاخر يُعد من لحم أنقس الدواجن المشوي على الفحم، مع خبز بريوش طري وإضافات طازجة تُكمل التجربة',
  ],
  [
    'بيتزا',
    'بيتزا إيطالية أصلية بعجينة رقيقة ومقرمشة، مغطاة بصلصة الطماطم المحضّرة يدوياً وجبنة موزاريلا كريمية ذائبة',
  ],
  [
    'كعك',
    'حلوى فاخرة تُحضّر بأيدي خبراء الحلويات، تتميز بنكهات غنية وقوام هش يذوب في الفم',
  ],
  [
    'ستيك',
    'ستيك أنيق من أجود القطع المشوية حسب الطلب، يقدم مع صوص خاص وخضروات موسمية مشوية تكمل نكهة اللحم',
  ],
];

function generateAIDescription(dishName: string): string {
  for (const [key, template] of descriptionTemplates) {
    if (dishName.includes(key)) return template;
  }
  return 'مزيج رائع من النكهات الفرنسية الكلاسيكية، يُقدم بأجود المكونات الطازجة مع لمسة إبداعية تعكس فن الطبخ الراقي';
}

/* ─────────────── empty dish form ─────────────── */
function emptyDish(categoryId: string): Dish {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    price: 0,
    categoryId,
    rating: 0,
    orderCount: 0,
    tags: [],
    isAvailable: true,
    isFeatured: false,
    addons: [],
    pairings: [],
  };
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function MenuEditor() {
  const { categories, setCategories, setView } = useStore();

  // UI state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishForm, setDishForm] = useState<Dish>(emptyDish(''));

  // AI state
  const [aiDishName, setAiDishName] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ───── category helpers ───── */
  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const startEditingCat = useCallback(
    (cat: Category) => {
      setEditingCatId(cat.id);
      setEditingCatName(cat.name);
    },
    []
  );

  const saveCatName = useCallback(() => {
    if (!editingCatId || !editingCatName.trim()) return;
    setCategories(
      categories.map((c) =>
        c.id === editingCatId ? { ...c, name: editingCatName.trim() } : c
      )
    );
    setEditingCatId(null);
  }, [editingCatId, editingCatName, categories, setCategories]);

  const deleteCategory = useCallback(
    (catId: string) => {
      setCategories(categories.filter((c) => c.id !== catId));
      setDeleteConfirm(null);
      toast.success('تم حذف التصنيف بنجاح');
    },
    [categories, setCategories]
  );

  const addCategory = useCallback(() => {
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: 'تصنيف جديد',
      sortOrder: categories.length,
      dishes: [],
    };
    setCategories([...categories, newCat]);
    setExpandedCategories((prev) => new Set(prev).add(newCat.id));
  }, [categories, setCategories]);

  /* ───── dish helpers ───── */
  const openAddDish = useCallback(
    (categoryId: string) => {
      const dish = emptyDish(categoryId);
      setEditingDish(null);
      setDishForm(dish);
      setDialogOpen(true);
    },
    []
  );

  const openEditDish = useCallback((dish: Dish) => {
    setEditingDish(dish);
    setDishForm({ ...dish, addons: dish.addons.map((a) => ({ ...a })) });
    setDialogOpen(true);
  }, []);

  const saveDish = useCallback(() => {
    if (!dishForm.name.trim()) {
      toast.error('يرجى إدخال اسم الطبق');
      return;
    }

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== dishForm.categoryId) return cat;
        if (editingDish) {
          return {
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === editingDish.id ? { ...dishForm } : d
            ),
          };
        }
        return { ...cat, dishes: [...cat.dishes, { ...dishForm }] };
      })
    );

    setDialogOpen(false);
    toast.success(editingDish ? 'تم تعديل الطبق بنجاح' : 'تم إضافة الطبق بنجاح');
  }, [dishForm, editingDish, setCategories]);

  const deleteDish = useCallback(
    (categoryId: string, dishId: string) => {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, dishes: cat.dishes.filter((d) => d.id !== dishId) }
            : cat
        )
      );
      setDeleteConfirm(null);
      toast.success('تم حذف الطبق بنجاح');
    },
    [categories, setCategories]
  );

  const toggleFeatured = useCallback(
    (categoryId: string, dishId: string) => {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                dishes: cat.dishes.map((d) =>
                  d.id === dishId ? { ...d, isFeatured: !d.isFeatured } : d
                ),
              }
            : cat
        )
      );
    },
    [categories, setCategories]
  );

  /* ───── reorder helpers ───── */
  const onCategoryReorder = useCallback(
    (newOrder: Category[]) => {
      setCategories(
        newOrder.map((cat, idx) => ({ ...cat, sortOrder: idx }))
      );
    },
    [setCategories]
  );

  const onDishReorder = useCallback(
    (categoryId: string, newDishes: Dish[]) => {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, dishes: newDishes } : cat
        )
      );
    },
    [categories, setCategories]
  );

  /* ───── AI helpers ───── */
  const handleGenerateDescription = useCallback(() => {
    if (!aiDishName.trim()) {
      toast.error('يرجى إدخال اسم الطبق');
      return;
    }
    setAiLoading(true);
    setTimeout(() => {
      const desc = generateAIDescription(aiDishName);
      setAiDescription(desc);
      setAiLoading(false);
    }, 1000);
  }, [aiDishName]);

  const copyDescription = useCallback(() => {
    if (!aiDescription) return;
    navigator.clipboard.writeText(aiDescription);
    toast.success('تم نسخ الوصف بنجاح');
  }, [aiDescription]);

  /* ───── AI suggestions ───── */
  const allDishes = categories.flatMap((c) => c.dishes);
  const dishWithoutDesc = allDishes.find((d) => !d.description.trim());
  const avgPrice =
    allDishes.length > 0
      ? allDishes.reduce((s, d) => s + d.price, 0) / allDishes.length
      : 0;
  const cheapDish = allDishes.find((d) => avgPrice > 0 && d.price < avgPrice * 0.8);
  const nonFeaturedDish = allDishes.find((d) => !d.isFeatured);

  const handleSuggestion = useCallback(
    (type: string) => {
      if (type === 'improve' && dishWithoutDesc) {
        const desc = generateAIDescription(dishWithoutDesc.name);
        setCategories(
          categories.map((cat) => ({
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === dishWithoutDesc.id ? { ...d, description: desc } : d
            ),
          }))
        );
        toast.success(`تم تحسين وصف "${dishWithoutDesc.name}"`);
      } else if (type === 'price' && cheapDish) {
        const newPrice = Math.round(avgPrice);
        setCategories(
          categories.map((cat) => ({
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === cheapDish.id ? { ...d, price: newPrice } : d
            ),
          }))
        );
        toast.success(`تم تعديل سعر "${cheapDish.name}" إلى ${newPrice} ر.س`);
      } else if (type === 'feature' && nonFeaturedDish) {
        setCategories(
          categories.map((cat) => ({
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === nonFeaturedDish.id ? { ...d, isFeatured: true } : d
            ),
          }))
        );
        toast.success(`تم تمييز "${nonFeaturedDish.name}"`);
      }
    },
    [dishWithoutDesc, cheapDish, nonFeaturedDish, avgPrice, categories, setCategories]
  );

  /* ───── dialog addon helpers ───── */
  const updateFormAddon = useCallback(
    (index: number, field: keyof Addon, value: string | number) => {
      const newAddons = [...dishForm.addons];
      newAddons[index] = { ...newAddons[index], [field]: value };
      setDishForm({ ...dishForm, addons: newAddons });
    },
    [dishForm]
  );

  const addFormAddon = useCallback(() => {
    setDishForm({
      ...dishForm,
      addons: [...dishForm.addons, { name: '', price: 0 }],
    });
  }, [dishForm]);

  const removeFormAddon = useCallback(
    (index: number) => {
      setDishForm({
        ...dishForm,
        addons: dishForm.addons.filter((_, i) => i !== index),
      });
    },
    [dishForm]
  );

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
      {/* ───── Top Bar ───── */}
      <header className="sticky top-0 z-40 border-b border-white/5 px-4 py-3 sm:px-6 backdrop-blur-xl" style={{ background: 'rgba(10,10,15,0.85)' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-[#d4a853]" />
            <h1 className="text-lg font-bold text-white sm:text-xl">محرر المنيو</h1>
          </div>
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

      {/* ───── Main Content ───── */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">

          {/* ══════════════ RIGHT PANEL (RTL left side) — Categories ══════════════ */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white/90">التصنيفات والأطباق</h2>
              <Button
                onClick={addCategory}
                size="sm"
                className="gap-1.5 text-black font-semibold hover:bg-[#e0b965] transition-colors"
                style={{ backgroundColor: '#d4a853' }}
              >
                <Plus className="h-4 w-4" />
                تصنيف جديد
              </Button>
            </div>

            {categories.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card flex flex-col items-center justify-center gap-3 p-12 text-center"
              >
                <ImageIcon className="h-12 w-12 text-white/20" />
                <p className="text-sm text-white/40">لا توجد تصنيفات بعد</p>
                <Button
                  onClick={addCategory}
                  size="sm"
                  className="mt-2 gap-1.5 text-black font-semibold hover:bg-[#e0b965] transition-colors"
                  style={{ backgroundColor: '#d4a853' }}
                >
                  <Plus className="h-4 w-4" />
                  أضف أول تصنيف
                </Button>
              </motion.div>
            )}

            <Reorder.Group
              axis="y"
              values={categories}
              onReorder={onCategoryReorder}
              className="space-y-3"
              layoutScroll
            >
              <AnimatePresence mode="popLayout">
                {categories.map((category) => {
                  const isExpanded = expandedCategories.has(category.id);
                  return (
                    <Reorder.Item
                      key={category.id}
                      value={category}
                      className="list-none"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      whileDrag={{ scale: 1.02, opacity: 0.9, zIndex: 50 }}
                    >
                      <div className="glass-card overflow-hidden">
                        {/* Category Header */}
                        <div className="flex items-center gap-2 px-4 py-3">
                          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/25" />

                          {/* Inline editable name */}
                          {editingCatId === category.id ? (
                            <input
                              autoFocus
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              onBlur={saveCatName}
                              onKeyDown={(e) => e.key === 'Enter' && saveCatName()}
                              className="flex-1 rounded border border-[#d4a853]/40 bg-transparent px-2 py-0.5 text-sm text-white outline-none focus:border-[#d4a853]"
                            />
                          ) : (
                            <span
                              onDoubleClick={() => startEditingCat(category)}
                              className="flex-1 cursor-text truncate text-sm font-semibold text-white/90 select-none"
                              title="انقر مرتين للتعديل"
                            >
                              {category.name}
                            </span>
                          )}

                          <Badge
                            variant="secondary"
                            className="shrink-0 bg-white/5 text-[10px] text-white/50"
                          >
                            {category.dishes.length} أطباق
                          </Badge>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-white/30 hover:text-[#d4a853] hover:bg-white/5"
                            onClick={() => openAddDish(category.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-white/30 hover:text-red-400 hover:bg-white/5"
                            onClick={() => deleteCategory(category.id)}
                            disabled={deleteConfirm === `cat-${category.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-white/40 hover:text-white/80 hover:bg-white/5"
                            onClick={() => toggleCategory(category.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Delete Confirmation for Category */}
                        <AnimatePresence>
                          {deleteConfirm === `cat-${category.id}` && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-center justify-between border-t border-white/5 bg-red-500/5 px-4 py-2.5">
                                <span className="text-xs text-red-300">
                                  هل تريد حذف "{category.name}"؟
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-7 text-xs"
                                    onClick={() => deleteCategory(category.id)}
                                  >
                                    حذف
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-white/50 hover:text-white"
                                    onClick={() => setDeleteConfirm(null)}
                                  >
                                    إلغاء
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expanded Dishes */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <Separator className="bg-white/5" />

                              {category.dishes.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-8 text-center">
                                  <p className="text-xs text-white/30">لا توجد أطباق في هذا التصنيف</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 gap-1 text-xs text-[#d4a853] hover:text-[#e0b965]"
                                    onClick={() => openAddDish(category.id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                    أضف طبق
                                  </Button>
                                </div>
                              ) : (
                                <Reorder.Group
                                  axis="y"
                                  values={category.dishes}
                                  onReorder={(newDishes) =>
                                    onDishReorder(category.id, newDishes)
                                  }
                                  className="divide-y divide-white/5"
                                >
                                  <AnimatePresence mode="popLayout">
                                    {category.dishes.map((dish) => (
                                      <Reorder.Item
                                        key={dish.id}
                                        value={dish}
                                        className="list-none"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        whileDrag={{
                                          scale: 1.01,
                                          opacity: 0.85,
                                          zIndex: 40,
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                      >
                                        <div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
                                          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/15" />

                                          <span className="text-2xl leading-none" role="img" aria-label={dish.name}>
                                            {getDishEmoji(dish.name)}
                                          </span>

                                          <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-white/85">
                                              {dish.name || 'بدون اسم'}
                                            </p>
                                            {dish.isFeatured && (
                                              <Badge
                                                className="mt-0.5 bg-[#d4a853]/15 text-[10px] text-[#d4a853] border-[#d4a853]/20"
                                              >
                                                <Star className="mr-0.5 h-2.5 w-2.5" />
                                                مميز
                                              </Badge>
                                            )}
                                          </div>

                                          <span className="shrink-0 text-sm font-bold text-[#d4a853]">
                                            {dish.price} ر.س
                                          </span>

                                          {/* Featured Toggle */}
                                          <div
                                            className="flex items-center gap-1.5"
                                            title="مميز"
                                          >
                                            <Switch
                                              checked={dish.isFeatured}
                                              onCheckedChange={() =>
                                                toggleFeatured(category.id, dish.id)
                                              }
                                              className="scale-75 data-[state=checked]:bg-[#d4a853]"
                                            />
                                          </div>

                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 text-white/25 hover:text-[#d4a853] hover:bg-white/5"
                                            onClick={() => openEditDish(dish)}
                                          >
                                            <Edit3 className="h-3.5 w-3.5" />
                                          </Button>

                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 text-white/25 hover:text-red-400 hover:bg-white/5"
                                            onClick={() =>
                                              setDeleteConfirm(`dish-${dish.id}`)
                                            }
                                            disabled={deleteConfirm === `dish-${dish.id}`}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>

                                        {/* Delete Confirmation for Dish */}
                                        <AnimatePresence>
                                          {deleteConfirm === `dish-${dish.id}` && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              className="overflow-hidden"
                                            >
                                              <div className="flex items-center justify-between bg-red-500/5 px-4 py-2.5">
                                                <span className="text-xs text-red-300">
                                                  حذف &quot;{dish.name}&quot;؟
                                                </span>
                                                <div className="flex gap-2">
                                                  <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-7 text-xs"
                                                    onClick={() =>
                                                      deleteDish(category.id, dish.id)
                                                    }
                                                  >
                                                    حذف
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 text-xs text-white/50 hover:text-white"
                                                    onClick={() => setDeleteConfirm(null)}
                                                  >
                                                    إلغاء
                                                  </Button>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </Reorder.Item>
                                    ))}
                                  </AnimatePresence>
                                </Reorder.Group>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </AnimatePresence>
            </Reorder.Group>
          </section>

          {/* ══════════════ LEFT PANEL (RTL right side) — AI Tools ══════════════ */}
          <aside className="space-y-5">
            {/* ───── AI Description Generator ───── */}
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
                    onClick={handleGenerateDescription}
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

            {/* ───── AI Suggestions ───── */}
            <Card className="glass-card border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#d4a853]">
                  <Wand2 className="h-4 w-4" />
                  اقتراحات AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Suggestion 1: Missing description */}
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
                      onClick={() => handleSuggestion('improve')}
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

                {/* Suggestion 2: Low price */}
                {cheapDish ? (
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="mb-2 text-xs leading-relaxed text-white/60">
                      سعر{' '}
                      <span className="font-semibold text-[#d4a853]">
                        {cheapDish.name}
                      </span>{' '}
                      أقل من المتوسط بنسبة 20%
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
                      onClick={() => handleSuggestion('price')}
                    >
                      تعديل السعر
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-xs leading-relaxed text-white/30">
                      ✅ الأسعار مناسبة
                    </p>
                  </div>
                )}

                {/* Suggestion 3: Non-featured dish */}
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
                      onClick={() => handleSuggestion('feature')}
                    >
                      تمييز
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-xs leading-relaxed text-white/30">
                      ✅ جميع الأطباق مميزة
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* ══════════════ Add/Edit Dish Dialog ══════════════ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#12121a] sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              {editingDish ? 'تعديل الطبق' : 'إضافة طبق جديد'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Dish Name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/50">
                اسم الطبق <span className="text-red-400">*</span>
              </Label>
              <Input
                value={dishForm.name}
                onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                placeholder="أدخل اسم الطبق"
                className="border-white/10 bg-white/5 text-sm text-white placeholder:text-white/25 focus:border-[#d4a853]/50 focus:ring-[#d4a853]/20"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/50">الوصف</Label>
              <Textarea
                value={dishForm.description}
                onChange={(e) =>
                  setDishForm({ ...dishForm, description: e.target.value })
                }
                placeholder="أدخل وصف الطبق..."
                rows={3}
                className="resize-none border-white/10 bg-white/5 text-sm leading-relaxed text-white/80 placeholder:text-white/25 focus:border-[#d4a853]/50 focus:ring-[#d4a853]/20"
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/50">السعر (ر.س)</Label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                <Input
                  type="number"
                  min={0}
                  value={dishForm.price || ''}
                  onChange={(e) =>
                    setDishForm({ ...dishForm, price: Number(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="border-white/10 bg-white/5 pr-9 text-sm text-white placeholder:text-white/25 focus:border-[#d4a853]/50 focus:ring-[#d4a853]/20"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/50">التصنيف</Label>
              <select
                value={dishForm.categoryId}
                onChange={(e) =>
                  setDishForm({ ...dishForm, categoryId: e.target.value })
                }
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#d4a853]/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#12121a]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Separator className="bg-white/5" />

            {/* Addons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-white/50">الإضافات</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-[#d4a853] hover:text-[#e0b965]"
                  onClick={addFormAddon}
                >
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </div>

              <AnimatePresence mode="popLayout">
                {dishForm.addons.map((addon, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-end gap-2 overflow-hidden"
                  >
                    <div className="flex-1 space-y-1">
                      {idx === 0 && (
                        <span className="text-[10px] text-white/30">الاسم</span>
                      )}
                      <Input
                        value={addon.name}
                        onChange={(e) =>
                          updateFormAddon(idx, 'name', e.target.value)
                        }
                        placeholder="اسم الإضافة"
                        className="h-9 border-white/10 bg-white/5 text-xs text-white placeholder:text-white/20 focus:border-[#d4a853]/50"
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      {idx === 0 && (
                        <span className="text-[10px] text-white/30">السعر</span>
                      )}
                      <Input
                        type="number"
                        min={0}
                        value={addon.price || ''}
                        onChange={(e) =>
                          updateFormAddon(idx, 'price', Number(e.target.value) || 0)
                        }
                        placeholder="0"
                        className="h-9 border-white/10 bg-white/5 text-xs text-white placeholder:text-white/20 focus:border-[#d4a853]/50"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-white/25 hover:text-red-400 hover:bg-white/5"
                      onClick={() => removeFormAddon(idx)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {dishForm.addons.length === 0 && (
                <p className="text-center text-xs text-white/20 py-2">
                  لا توجد إضافات — انقر &quot;إضافة&quot; لإضافة واحدة
                </p>
              )}
            </div>

            <Separator className="bg-white/5" />

            {/* Toggles */}
            <div className="flex items-center justify-between">
              <Label className="text-sm text-white/70">مميز؟</Label>
              <Switch
                checked={dishForm.isFeatured}
                onCheckedChange={(checked) =>
                  setDishForm({ ...dishForm, isFeatured: checked })
                }
                className="data-[state=checked]:bg-[#d4a853]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-white/70">متاح؟</Label>
              <Switch
                checked={dishForm.isAvailable}
                onCheckedChange={(checked) =>
                  setDishForm({ ...dishForm, isAvailable: checked })
                }
                className="data-[state=checked]:bg-[#d4a853]"
              />
            </div>

            <Separator className="bg-white/5" />

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={saveDish}
                className="flex-1 gap-2 text-black font-semibold hover:bg-[#e0b965] transition-colors"
                style={{ backgroundColor: '#d4a853' }}
              >
                <Save className="h-4 w-4" />
                {editingDish ? 'حفظ التعديلات' : 'إضافة الطبق'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}