'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useSmartCart } from '../hooks/useSmartCart';
import { CartItemRow } from '../components/CartItemRow';
import { AiUpsellCard } from '../components/AiUpsellCard';
import { EmptyState } from '../components/EmptyState';
import { CartSummary } from '../components/CartSummary';
import type { SmartCartProps } from '../types';

/**
 * Smart Cart Drawer Panel (replaces the main page orchestrator).
 *
 * This orchestrator is extremely thin and focused (under 120 lines):
 *  - Slides in a sidebar panel containing cart items.
 *  - Handles quantity updates, removals, and checkout transitions.
 *  - Triggers intelligent recommendations based on purchase bounds.
 */
export default function SmartCartPage({ isOpen, onClose }: SmartCartProps) {
  const cartForm = useSmartCart();
  const {
    cart,
    totalDisplay,
    animatingTotal,
    upsellSuggestion,
    handleAddUpsell,
    handleQuantityChange,
    handleRemove,
    setShowCheckout,
  } = cartForm;

  const handleCheckoutClick = () => {
    setShowCheckout(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Slide-out Sidebar Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 end-0 bottom-0 z-50 w-full md:w-[400px] bg-[#12121a] border-s-2 border-[#d4a853]/40 rounded-s-2xl shadow-2xl shadow-black/60 flex flex-col text-right"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3 justify-start">
                <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#0a0a0f]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">سلة الطلب</h2>
                  {cart.length > 0 && (
                    <span className="text-xs text-muted-foreground block text-right">
                      {cart.length} {cart.length === 1 ? 'صنف' : 'أصناف'}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content Switcher */}
            {cart.length === 0 ? (
              <EmptyState onClose={onClose} />
            ) : (
              <>
                {/* Scrollable Items List */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <CartItemRow
                        key={`${item.dish.id}-${item.selectedAddons.map((a) => a.name).join(',')}`}
                        item={item}
                        onRemove={handleRemove}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))}
                  </AnimatePresence>

                  {/* AI Upsell Card */}
                  <AnimatePresence>
                    {upsellSuggestion && (
                      <AiUpsellCard suggestion={upsellSuggestion} onAdd={handleAddUpsell} />
                    )}
                  </AnimatePresence>

                  {/* Complete meal alert */}
                  {totalDisplay >= 50 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 text-center py-4 px-3 glass-card"
                    >
                      <p className="text-sm font-bold text-[#d4a853]">وجبتك مكتملة! بالعافية 🎉</p>
                    </motion.div>
                  )}
                </div>

                {/* Subtotals & checkout CTA */}
                <CartSummary
                  total={totalDisplay}
                  animatingTotal={animatingTotal}
                  onCheckout={handleCheckoutClick}
                />
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
