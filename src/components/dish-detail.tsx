'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import type { Dish, Addon } from '@/lib/types';
import {
  Star,
  Plus,
  Minus,
  MessageCircle,
  X,
  ChefHat,
  Clock,
  Users,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

/* ───────── helpers ───────── */

const gradients = [
  'from-amber-900/50 via-orange-900/30 to-transparent',
  'from-emerald-900/50 via-teal-900/30 to-transparent',
  'from-rose-900/50 via-pink-900/30 to-transparent',
  'from-stone-800/50 via-zinc-800/30 to-transparent',
  'from-yellow-900/50 via-amber-800/30 to-transparent',
  'from-cyan-900/50 via-sky-900/30 to-transparent',
];

function getDishEmoji(dish: Dish): string {
  const emojis = ['🍽️', '☕', '🥗', '🍰', '🥐', '🥤', '🍗', '🍕', '🍝', '🥪', '🐟', '🍲', '🧆', '🍚'];
  return emojis[dish.id.charCodeAt(0) % emojis.length];
}

/* ───────── animation variants ───────── */

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/* ───────── inner content (keyed by dish.id → state resets on dish change) ───────── */

function DishDetailInner({
  dish,
  onClose,
}: {
  dish: Dish;
  onClose: () => void;
}) {
  const { addToCart, setChatOpen } = useStore();

  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [added, setAdded] = useState(false);

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) return prev.filter((a) => a.name !== addon.name);
      return [...prev, addon];
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = dish.price + addonsTotal;

  const handleAddToCart = () => {
    addToCart(dish, selectedAddons);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleAIChat = () => {
    onClose();
    setChatOpen(true);
  };

  const emoji = getDishEmoji(dish);
  const gradient = gradients[dish.id.charCodeAt(1) % gradients.length];

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-full flex-col"
    >
      {/* ── 1. Hero Section ── */}
      <motion.div
        variants={itemVariants}
        className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${gradient} md:h-56`}
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-7xl md:text-8xl"
        >
          {emoji}
        </motion.span>

        {dish.isFeatured && (
          <Badge className="absolute top-4 start-4 gap-1 bg-primary/90 text-primary-foreground">
            <ChefHat size={12} />
            يوصي به الذكاء الاصطناعي
          </Badge>
        )}
      </motion.div>

      {/* ── 2. Title + Rating & Stats ── */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 px-5 pt-5">
        <SheetHeader className="p-0">
          <SheetTitle className="text-xl font-extrabold leading-tight text-foreground">
            {dish.name}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-wrap items-center gap-4">
          {/* stars */}
          <div className="flex items-center gap-1.5" dir="ltr">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={15}
                className={
                  i <= Math.round(dish.rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground/30'
                }
              />
            ))}
            <span className="ms-1 text-sm font-semibold text-foreground">
              {dish.rating}
            </span>
          </div>

          {/* order count */}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={13} />
            {dish.orderCount} طلب
          </span>

          {/* price */}
          <span className="ms-auto text-lg font-bold text-primary">
            {dish.price} <span className="text-xs font-normal">ر.س</span>
          </span>
        </div>
      </motion.div>

      <Separator className="my-3 bg-border" />

      {/* ── 3. Description ── */}
      <motion.div variants={itemVariants} className="px-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {dish.description}
        </p>
      </motion.div>

      {/* ── 4. Tags ── */}
      {dish.tags.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-3 flex flex-wrap items-center gap-2 px-5"
        >
          {dish.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-primary/30 text-xs text-primary"
            >
              {tag}
            </Badge>
          ))}
        </motion.div>
      )}

      <Separator className="my-4 bg-border" />

      {/* ── 5. Add-ons Section ── */}
      {dish.addons.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col gap-3 px-5">
          <h3 className="text-sm font-bold text-foreground">إضافات</h3>
          <div className="flex flex-col gap-2.5">
            {dish.addons.map((addon) => {
              const isSelected = selectedAddons.some(
                (a) => a.name === addon.name,
              );
              return (
                <label
                  key={addon.name}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                    isSelected
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border hover:border-primary/20'
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleAddon(addon)}
                    className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="flex-1 text-sm text-foreground">
                    {addon.name}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    +{addon.price} ر.س
                  </span>
                </label>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── 6. Pairings ── */}
      {dish.pairings.length > 0 && (
        <>
          <Separator className="my-4 bg-border" />
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-3 px-5"
          >
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <SparklesIcon />
              ينصح مع:
            </h3>
            <div className="flex flex-wrap gap-2">
              {dish.pairings.map((pairing) => (
                <Badge
                  key={pairing}
                  variant="secondary"
                  className="text-xs"
                >
                  {pairing}
                </Badge>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <Separator className="my-4 bg-border" />

      {/* ── 7. AI Chat Button ── */}
      <motion.div variants={itemVariants} className="px-5">
        <Button
          variant="outline"
          className="w-full gap-2 border-primary/30 text-sm text-primary hover:bg-primary/10"
          onClick={handleAIChat}
        >
          <MessageCircle size={16} />
          تحدث مع النادل الذكي عن هذا الطبق
        </Button>
      </motion.div>

      {/* spacer for sticky footer */}
      <div className="h-20" />

      {/* ── 8. Add to Cart – sticky footer ── */}
      <motion.div
        variants={itemVariants}
        className="fixed bottom-0 left-0 right-0 z-10 border-t border-primary/10 bg-background/95 px-5 py-3 backdrop-blur-md md:absolute md:bottom-0 md:left-0 md:right-0"
      >
        <Button
          size="lg"
          className={`w-full gap-2 text-base font-bold transition-all ${
            added
              ? 'bg-green-600 text-white hover:bg-green-600'
              : 'gold-gradient hover:opacity-90'
          }`}
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ? (
            <>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                ✓
              </motion.span>
              تمت الإضافة
            </>
          ) : (
            <>
              <Plus size={18} />
              أضف إلى السلة — {totalPrice} ر.س
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ───────── main sheet wrapper ───────── */

export default function DishDetail() {
  const { selectedDish, setSelectedDish } = useStore();
  const [isDesktop, setIsDesktop] = useState(false);

  /* responsive side detection */
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedDish(null);
  };

  const handleClose = () => {
    setSelectedDish(null);
  };

  return (
    <Sheet
      open={!!selectedDish}
      onOpenChange={handleOpenChange}
      side={isDesktop ? 'right' : 'bottom'}
    >
      <SheetContent
        className={
          isDesktop
            ? 'w-full max-w-md overflow-y-auto border-l border-primary/10 bg-background p-0 sm:max-w-md'
            : 'max-h-[92vh] overflow-y-auto border-t border-primary/10 bg-background p-0'
        }
      >
        {/* key ensures state resets when dish changes */}
        {selectedDish && (
          <DishDetailInner key={selectedDish.id} dish={selectedDish} onClose={handleClose} />
        )}
      </SheetContent>
    </Sheet>
  );
}

/* tiny inline icon for pairings header */
function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}