'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  ChefHat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import type { CartItem, Dish } from '@/lib/types';

interface SmartCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartCart({ isOpen, onClose }: SmartCartProps) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setShowCheckout,
    categories,
    addToCart,
  } = useStore();

  const [animatingTotal, setAnimatingTotal] = useState(false);

  // Trigger total animation when cart changes
  const totalDisplay = cartTotal;

  // AI Upsell logic
  const upsellSuggestion = useMemo(() => {
    if (totalDisplay >= 50) return null;

    // Find drink and dessert categories
    const drinkCategory = categories.find(
      (c) =>
        c.nameEn?.toLowerCase().includes('drink') ||
        c.name.includes('مشروب') ||
        c.name.includes('عصير') ||
        c.name.includes('قهوة') ||
        c.name.includes('شاي')
    );
    const dessertCategory = categories.find(
      (c) =>
        c.nameEn?.toLowerCase().includes('dessert') ||
        c.name.includes('حلى') ||
        c.name.includes('حلو') ||
        c.name.includes('كنافة') ||
        c.name.includes('مهلبية')
    );

    if (totalDisplay < 30 && drinkCategory && drinkCategory.dishes.length > 0) {
      return {
        type: 'drink' as const,
        dish: drinkCategory.dishes[0],
        message: '90% من العملاء يضيفون مشروب مع طلبهم',
      };
    }

    if (
      totalDisplay < 50 &&
      dessertCategory &&
      dessertCategory.dishes.length > 0
    ) {
      return {
        type: 'dessert' as const,
        dish: dessertCategory.dishes[0],
        message: 'وجبتك تحتاج لمسة حلا! جرب الحلويات المميزة',
      };
    }

    // Fallback: find first available suggestion
    const fallbackDish =
      drinkCategory?.dishes[0] ?? dessertCategory?.dishes[0] ?? null;
    if (fallbackDish) {
      return {
        type: (drinkCategory ? 'drink' : 'dessert') as const,
        dish: fallbackDish,
        message: 'أكمل وجبتك بإضافة هذا الصنف المميز',
      };
    }

    return null;
  }, [categories, totalDisplay]);

  const handleAddUpsell = (dish: Dish) => {
    addToCart(dish);
    // Brief scale animation on total
    setAnimatingTotal(true);
    setTimeout(() => setAnimatingTotal(false), 300);
  };

  const handleQuantityChange = (dishId: string, newQty: number) => {
    updateQuantity(dishId, newQty);
    setAnimatingTotal(true);
    setTimeout(() => setAnimatingTotal(false), 300);
  };

  const handleRemove = (dishId: string) => {
    removeFromCart(dishId);
    setAnimatingTotal(true);
    setTimeout(() => setAnimatingTotal(false), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Panel — slides in from the right (RTL end side) */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 end-0 bottom-0 z-50 w-full md:w-[400px] bg-[#12121a] border-s-2 border-[#d4a853]/40 rounded-s-2xl shadow-2xl shadow-black/60 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#0a0a0f]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    سلة الطلب
                  </h2>
                  {cart.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {cart.length} {cart.length === 1 ? 'صنف' : 'أصناف'}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Content */}
            {cart.length === 0 ? (
              /* Empty Cart State */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-foreground">
                    سلتك فارغة
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[250px]">
                    أضف أطباقاً من القائمة لبدء الطلب
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="mt-2 rounded-xl border-[#d4a853]/40 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] px-6"
                >
                  استعرض القائمة
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item: CartItem) => (
                      <motion.div
                        key={`${item.dish.id}-${item.selectedAddons.map((a) => a.name).join(',')}`}
                        layout
                        initial={{ opacity: 0, x: 30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="glass-card p-3.5 space-y-2.5"
                      >
                        {/* Dish name + price row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-foreground truncate">
                              {item.dish.name}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {item.dish.price.toFixed(2)} ر.س
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item.dish.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-full flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Addons */}
                        {item.selectedAddons.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.selectedAddons.map((addon) => (
                              <span
                                key={addon.name}
                                className="text-[11px] text-[#d4a853]/80 bg-[#d4a853]/10 px-2 py-0.5 rounded-full"
                              >
                                +{addon.name} ({addon.price.toFixed(2)})
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quantity + line total */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(
                                  item.dish.id,
                                  item.quantity - 1
                                )
                              }
                              className="h-7 w-7 rounded-lg bg-white/[0.06] hover:bg-white/10 text-foreground"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className="w-8 text-center text-sm font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(
                                  item.dish.id,
                                  item.quantity + 1
                                )
                              }
                              className="h-7 w-7 rounded-lg bg-white/[0.06] hover:bg-white/10 text-foreground"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <span className="text-sm font-bold gold-gradient-text">
                            {item.totalPrice.toFixed(2)} ر.س
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* AI Upsell Section */}
                  <AnimatePresence>
                    {upsellSuggestion && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="mt-3 border border-[#d4a853]/25 rounded-xl bg-gradient-to-br from-[#d4a853]/[0.06] to-transparent p-4 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#d4a853]" />
                          <span className="text-sm font-bold text-[#d4a853]">
                            🤖 اقتراح ذكي
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {upsellSuggestion.message}
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#d4a853]/10 flex items-center justify-center flex-shrink-0">
                              {upsellSuggestion.type === 'drink' ? (
                                <span className="text-base">🥤</span>
                              ) : (
                                <ChefHat className="w-4 h-4 text-[#d4a853]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {upsellSuggestion.dish.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {upsellSuggestion.dish.price.toFixed(2)} ر.س
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAddUpsell(upsellSuggestion.dish)
                            }
                            className="h-8 px-3 gold-gradient rounded-lg hover:opacity-90 flex-shrink-0 text-xs font-bold"
                          >
                            <Plus className="w-3.5 h-3.5 ml-1" />
                            أضف
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Complete meal message */}
                  {totalDisplay >= 50 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 text-center py-4 px-3 glass-card"
                    >
                      <p className="text-sm font-bold text-[#d4a853]">
                        وجبتك مكتملة! بالعافية 🎉
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Bottom: Total + Checkout */}
                <div className="border-t border-white/[0.08] bg-[#0e0e16]/80 backdrop-blur-md px-5 py-4 space-y-3">
                  <Separator className="opacity-0" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      الإجمالي
                    </span>
                    <motion.span
                      key={totalDisplay}
                      initial={animatingTotal ? { scale: 1.2 } : {}}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="text-lg font-bold gold-gradient-text"
                    >
                      {totalDisplay.toFixed(2)} ر.س
                    </motion.span>
                  </div>
                  <Button
                    onClick={() => {
                      setShowCheckout(true);
                      onClose();
                    }}
                    className="w-full h-12 gold-gradient rounded-xl text-base font-bold hover:opacity-90 transition-opacity"
                  >
                    إتمام الطلب
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

