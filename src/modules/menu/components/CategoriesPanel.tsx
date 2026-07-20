'use client';

import { Plus, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Category, Dish } from '../types';
import { CategoryCard } from './CategoryCard';

interface CategoriesPanelProps {
  categories: Category[];
  expandedCategories: Set<string>;
  editingCatId: string | null;
  editingCatName: string;
  deleteConfirm: string | null;
  onSetEditingCatName: (name: string) => void;
  onAddCategory: () => void;
  onToggleCategory: (id: string) => void;
  onStartEditingCat: (cat: Category) => void;
  onSaveCatName: () => void;
  onDeleteCategory: (catId: string) => void;
  onSetDeleteConfirm: (target: string | null) => void;
  onCategoryReorder: (newOrder: Category[]) => void;
  onDishReorder: (categoryId: string, newDishes: Dish[]) => void;
  onAddDish: (categoryId: string) => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (categoryId: string, dishId: string) => void;
  onToggleFeatured: (categoryId: string, dishId: string) => void;
}

/**
 * Left-hand panel (RTL right side) that lists all categories and their dishes,
 * supporting drag-and-drop reordering at both levels.
 */
export function CategoriesPanel({
  categories,
  expandedCategories,
  editingCatId,
  editingCatName,
  deleteConfirm,
  onSetEditingCatName,
  onAddCategory,
  onToggleCategory,
  onStartEditingCat,
  onSaveCatName,
  onDeleteCategory,
  onSetDeleteConfirm,
  onCategoryReorder,
  onDishReorder,
  onAddDish,
  onEditDish,
  onDeleteDish,
  onToggleFeatured,
}: CategoriesPanelProps) {
  return (
    <section className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white/90">التصنيفات والأطباق</h2>
        <Button
          onClick={onAddCategory}
          size="sm"
          className="gap-1.5 text-black font-semibold hover:bg-[#e0b965] transition-colors"
          style={{ backgroundColor: '#d4a853' }}
        >
          <Plus className="h-4 w-4" />
          تصنيف جديد
        </Button>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card flex flex-col items-center justify-center gap-3 p-12 text-center"
        >
          <ImageIcon className="h-12 w-12 text-white/20" />
          <p className="text-sm text-white/40">لا توجد تصنيفات بعد</p>
          <Button
            onClick={onAddCategory}
            size="sm"
            className="mt-2 gap-1.5 text-black font-semibold hover:bg-[#e0b965] transition-colors"
            style={{ backgroundColor: '#d4a853' }}
          >
            <Plus className="h-4 w-4" />
            أضف أول تصنيف
          </Button>
        </motion.div>
      )}

      {/* Drag-and-drop list */}
      <Reorder.Group
        axis="y"
        values={categories}
        onReorder={onCategoryReorder}
        className="space-y-3"
        layoutScroll
      >
        <AnimatePresence mode="popLayout">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategories.has(category.id)}
              editingCatId={editingCatId}
              editingCatName={editingCatName}
              deleteConfirm={deleteConfirm}
              onSetEditingCatName={onSetEditingCatName}
              onToggle={() => onToggleCategory(category.id)}
              onStartEditing={() => onStartEditingCat(category)}
              onSaveName={onSaveCatName}
              onDelete={() => onDeleteCategory(category.id)}
              onSetDeleteConfirm={onSetDeleteConfirm}
              onDishReorder={(dishes) => onDishReorder(category.id, dishes)}
              onAddDish={() => onAddDish(category.id)}
              onEditDish={onEditDish}
              onDeleteDish={(dishId) => onDeleteDish(category.id, dishId)}
              onToggleFeatured={(dishId) => onToggleFeatured(category.id, dishId)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </section>
  );
}
