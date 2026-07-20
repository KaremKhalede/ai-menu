'use client';

import { motion } from 'framer-motion';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

import { contentVariants } from '../constants';
import { useDishDetail } from '../hooks/useDishDetail';
import { DishHeroSection } from '../components/DishHeroSection';
import { DishInfoSection } from '../components/DishInfoSection';
import { DishAddonsSection } from '../components/DishAddonsSection';
import { DishPairingsSection } from '../components/DishPairingsSection';
import { AiChatButton } from '../components/AiChatButton';
import { DishAddToCartSticky } from '../components/DishAddToCartSticky';

/**
 * Dish Detail Overlay Sheet Panel.
 *
 * This orchestrator is extremely thin and focused (under 120 lines):
 *  - Handles side sheet responsiveness and layout modes.
 *  - Links inner items: details, checkable options list, upsell food recommendations.
 */
export default function DishDetailPage() {
  const form = useDishDetail();
  const {
    selectedDish,
    isDesktop,
    selectedAddons,
    added,
    totalPrice,
    emoji,
    gradient,
    toggleAddon,
    handleAddToCart,
    handleAIChat,
    handleOpenChange,
    handleClose,
  } = form;

  return (
    <Sheet open={!!selectedDish} onOpenChange={handleOpenChange}>
      <SheetContent
        className={
          isDesktop
            ? 'w-full max-w-md overflow-y-auto border-l border-primary/10 bg-background p-0 sm:max-w-md'
            : 'max-h-[92vh] overflow-y-auto border-t border-primary/10 bg-background p-0'
        }
      >
        {selectedDish && (
          <motion.div
            key={selectedDish.id}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="flex min-h-full flex-col text-right pb-10"
            dir="rtl"
          >
            {/* Hero image header */}
            <DishHeroSection dish={selectedDish} emoji={emoji} gradient={gradient} />

            {/* Title & rating details */}
            <DishInfoSection dish={selectedDish} />

            <Separator className="my-3 bg-border" />

            {/* Optional additions checklist */}
            <DishAddonsSection
              dish={selectedDish}
              selectedAddons={selectedAddons}
              onToggleAddon={toggleAddon}
            />

            {/* Pairings recommended drinks/sides */}
            <DishPairingsSection dish={selectedDish} />

            <Separator className="my-4 bg-border" />

            {/* Chat with AI Waiter */}
            <AiChatButton onAIChat={() => handleAIChat(handleClose)} />

            {/* Sticky footer action button */}
            <DishAddToCartSticky
              totalPrice={totalPrice}
              added={added}
              onAddToCart={() => handleAddToCart(handleClose)}
            />
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}
