'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, GripVertical, Plus, ChevronUp, ChevronDown, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DishCard } from './DishCard';
import { staggerContainer, fadeUp } from '../constants';
import type { UseAutoMenuGeneratorReturn } from '../hooks/useAutoMenuGenerator';

interface StepPreviewProps {
  form: UseAutoMenuGeneratorReturn;
}

export function StepPreview({ form }: StepPreviewProps) {
  const {
    restaurantName,
    categories,
    expandedCategories,
    editingDish,
    setEditingDish,
    totalDishes,
    toggleCategory,
    expandAll,
    collapseAll,
    updateDish,
    addDish,
    handleSave,
    handleRegenerate,
    setStep,
  } = form;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ece4] text-right" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setStep('input')}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="text-right">
              <h1 className="text-lg font-bold gold-gradient-text">{restaurantName}</h1>
              <p className="text-xs text-[#8a8578]">{categories.length} قسم · {totalDishes} طبق</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={expandAll}
              className="text-xs text-[#8a8578] hover:text-[#f0ece4] cursor-pointer"
            >
              توسيع الكل
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              className="text-xs text-[#8a8578] hover:text-[#f0ece4] cursor-pointer"
            >
              طي الكل
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Categories */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
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
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 justify-start flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-[#8a8578]/50 shrink-0" />
                    <span className="text-2xl shrink-0">{cat.icon || '🍽️'}</span>
                    <div className="text-right min-w-0 flex-1">
                      <h3 className="font-bold text-base text-[#f0ece4] truncate">{cat.name}</h3>
                      {cat.nameEn && (
                        <p className="text-[10px] text-[#8a8578] truncate">{cat.nameEn}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-[#d4a853]/10 text-[#d4a853] text-[10px] mr-2 shrink-0">
                      {cat.dishes.length} طبق
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addDish(cat.id);
                      }}
                      className="h-7 w-7 rounded-lg bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853] hover:bg-[#d4a853]/20 transition-colors cursor-pointer"
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
              className="flex-1 h-12 text-base font-bold gold-gradient hover:opacity-90 rounded-xl gap-2 cursor-pointer"
            >
              <Save className="h-5 w-5" />
              حفظ القائمة
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerate}
              className="flex-1 h-12 text-base font-semibold rounded-xl gap-2 border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] cursor-pointer"
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
