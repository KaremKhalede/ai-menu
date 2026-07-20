'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import type { Category, Dish } from '@/lib/types';
import {
  Star,
  Plus,
  MessageCircle,
  Flame,
  ChevronRight,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackDishClick, trackAddToCart } from '@/lib/heatmap-tracker';

/* ───────── helpers ───────── */

const gradients = [
  'from-amber-900/40 via-orange-900/20 to-transparent',
  'from-emerald-900/40 via-teal-900/20 to-transparent',
  'from-rose-900/40 via-pink-900/20 to-transparent',
  'from-stone-800/40 via-zinc-800/20 to-transparent',
  'from-yellow-900/40 via-amber-800/20 to-transparent',
  'from-cyan-900/40 via-sky-900/20 to-transparent',
];

function getDishEmoji(dish: Dish, categories: Category[]): string {
  const cat = categories.find((c) => c.id === dish.categoryId);
  if (cat?.icon) return cat.icon;

  const name = cat?.name ?? '';
  if (name.includes('قهوة') || name.includes('كافيه') || name.includes('كوفيه')) return '☕';
  if (name.includes('حلو') || name.includes('كيك') || name.includes('ديزرت')) return '🍰';
  if (name.includes('سلط')) return '🥗';
  if (name.includes('معجن') || name.includes('فطير')) return '🥐';
  if (name.includes('عصير') || name.includes('مشروب') || name.includes('سموذي')) return '🥤';
  if (name.includes('سندوي') || name.includes('برجر')) return '🥪';
  if (name.includes('بيتزا')) return '🍕';
  if (name.includes('باستا')) return '🍝';
  if (name.includes('دجاج')) return '🍗';
  if (name.includes('سمك') || name.includes('قريدس') || name.includes('بحر')) return '🐟';
  if (name.includes('شوربة')) return '🍲';
  if (name.includes('مقبل')) return '🧆';
  if (name.includes('أرز')) return '🍚';
  if (name.includes('رئيسي') || name.includes('طبق')) return '🍖';

  const emojis = ['🍽️', '☕', '🥗', '🍰', '🥐', '🥤'];
  return emojis[dish.id.charCodeAt(0) % emojis.length];
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= Math.round(rating)
              ? 'fill-primary text-primary'
              : 'text-muted-foreground/40'
          }
        />
      ))}
    </span>
  );
}

/* ───────── component ───────── */

interface SmartMenuProps {
  onCartOpen?: () => void;
}

export default function SmartMenu({ onCartOpen }: SmartMenuProps) {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setSelectedDish,
    setChatOpen,
    addToCart,
    cart,
    setView,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [addedDishId, setAddedDishId] = useState<string | null>(null);

  /* derived data */
  const allDishes = useMemo(
    () => categories.flatMap((c) => c.dishes),
    [categories],
  );

  const featuredDishes = useMemo(
    () => allDishes.filter((d) => d.isFeatured),
    [allDishes],
  );

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let cats = categories;

    if (query) {
      cats = cats
        .map((c) => ({
          ...c,
          dishes: c.dishes.filter(
            (d) =>
              d.name.toLowerCase().includes(query) ||
              d.description.toLowerCase().includes(query) ||
              d.tags.some((t) => t.toLowerCase().includes(query)),
          ),
        }))
        .filter((c) => c.dishes.length > 0);
    }

    if (selectedCategory) {
      cats = cats.filter((c) => c.id === selectedCategory);
    }

    return cats;
  }, [categories, selectedCategory, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* handlers */
  const handleAddToCart = (dish: Dish, categoryId?: string, categoryName?: string) => {
    addToCart(dish);
    setAddedDishId(dish.id);
    setTimeout(() => setAddedDishId(null), 1500);
    // Track heatmap event
    trackAddToCart(dish.id, dish.name);
  };

  const handleOpenChat = (dish: Dish) => {
    setSelectedDish(dish);
    setChatOpen(true);
  };

  /* ── sub-components ── */

  /* ---------- Dish Grid Card ---------- */
  const DishCard = ({ dish, index, categoryId, categoryName }: { dish: Dish; index: number; categoryId?: string; categoryName?: string }) => {
    const isAdded = addedDishId === dish.id;
    const emoji = getDishEmoji(dish, categories);
    const gradient = gradients[index % gradients.length];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        className="glass-card group flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/40"
        onClick={() => {
          setSelectedDish(dish);
          trackDishClick(dish.id, dish.name, categoryId, categoryName);
        }}
        role="button"
        tabIndex={0}
        data-dish-id={dish.id}
        data-dish-name={dish.name}
        data-category-id={categoryId}
        data-category-name={categoryName}
        data-heatmap-label={dish.name}
      >
        {/* emoji placeholder */}
        <div
          className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
          {dish.isFeatured && (
            <Badge className="absolute top-2 start-2 gap-1 bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0">
              <Flame size={10} />
              AI يوصي
            </Badge>
          )}
        </div>

        {/* info */}
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="truncate text-sm font-bold leading-tight text-foreground">
            {dish.name}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {dish.description}
          </p>

          {/* rating + orders */}
          <div className="mt-auto flex items-center gap-2 pt-1">
            <RatingStars rating={dish.rating} />
            <span className="text-[10px] text-muted-foreground">
              ({dish.rating})
            </span>
            <span className="text-[10px] text-muted-foreground">
              {dish.orderCount} طلب
            </span>
          </div>

          {/* price + actions */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-base font-bold text-primary">
              {dish.price} <span className="text-xs font-normal">ر.س</span>
            </span>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 text-muted-foreground hover:text-primary"
                onClick={() => handleOpenChat(dish)}
                aria-label="تحدث مع الذكاء الاصطناعي"
              >
                <MessageCircle size={14} />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={`h-8 gap-1 border-primary/50 text-xs transition-all ${
                  isAdded
                    ? 'border-green-500/60 bg-green-500/10 text-green-400'
                    : 'text-primary hover:bg-primary/10'
                }`}
                onClick={() => handleAddToCart(dish)}
              >
                {isAdded ? (
                  <>تمت الإضافة ✓</>
                ) : (
                  <>
                    <Plus size={14} />
                    أضف
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  /* ---------- AI Pick Horizontal Card ---------- */
  const AIPickCard = ({ dish, index }: { dish: Dish; index: number }) => {
    const emoji = getDishEmoji(dish, categories);
    const gradient = gradients[index % gradients.length];

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
        className="glass-card group flex w-44 shrink-0 cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:border-primary/40 sm:w-52"
        onClick={() => setSelectedDish(dish)}
      >
        <div
          className={`flex h-24 items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <h4 className="truncate text-sm font-bold">{dish.name}</h4>
          <div className="flex items-center gap-1.5">
            <RatingStars rating={dish.rating} />
            <span className="text-[10px] text-muted-foreground">
              ({dish.rating})
            </span>
          </div>
          <span className="text-sm font-bold text-primary">
            {dish.price} ر.س
          </span>
        </div>
      </motion.div>
    );
  };

  /* ── render ── */
  return (
    <div className="relative min-h-screen bg-background pb-24" dir="rtl">
      {/* ─── top header bar ─── */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          onClick={() => setView('landing')}
          aria-label="رجوع"
        >
          <ChevronRight size={20} />
        </Button>

        <h1 className="gold-gradient-text text-lg font-extrabold tracking-wide">
          مطعم الذهبي
        </h1>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-primary"
          onClick={() => onCartOpen?.()}
          aria-label="السلة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -left-1 flex size-5 items-center justify-center p-0 text-[10px] font-bold">
              {cartCount}
            </Badge>
          )}
        </Button>
      </header>

      {/* ─── search bar ─── */}
      <div className="px-4 py-2">
        <div className="glass-card flex items-center gap-2 px-3 py-2.5">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن طبق..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="مسح البحث"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── category pills ─── */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto px-4 py-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'gold-gradient text-primary-foreground shadow-md'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
          }`}
        >
          الكل
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
            }
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'gold-gradient text-primary-foreground shadow-md'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <main className="flex flex-col gap-6 px-4">
        {/* ─── AI Picks Section ─── */}
        {!searchQuery && featuredDishes.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="gold-gradient-text text-base font-bold">
                موصى به لك
              </h2>
            </div>
            <div className="scrollbar-none flex items-center gap-3 overflow-x-auto pb-1">
              {featuredDishes.map((dish, i) => (
                <AIPickCard key={dish.id} dish={dish} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ─── Category Sections ─── */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-3 py-16 text-center"
          >
            <span className="text-5xl">🔍</span>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? 'لا توجد نتائج لبحثك'
                : 'لا توجد أطباق متاحة حالياً'}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {filteredCategories.map((cat) => (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-3 text-base font-bold text-foreground">
                {cat.name}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {cat.dishes.map((dish, i) => (
                  <DishCard key={dish.id} dish={dish} index={i} categoryId={cat.id} categoryName={cat.name} />
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>
      </main>

      {/* ─── Floating AI Chat Button ─── */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
        onClick={() => setChatOpen(true)}
        className="animate-pulse-glow fixed bottom-6 left-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
        aria-label="تحدث مع النادل الذكي"
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
}