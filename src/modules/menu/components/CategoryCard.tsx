'use client';

import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Category, Dish } from '../types';
import { DishCard } from './DishCard';

interface CategoryCardProps {
  category: Category;
  isExpanded: boolean;
  editingCatId: string | null;
  editingCatName: string;
  deleteConfirm: string | null;
  onSetEditingCatName: (name: string) => void;
  onToggle: () => void;
  onStartEditing: () => void;
  onSaveName: () => void;
  onDelete: () => void;
  onSetDeleteConfirm: (target: string | null) => void;
  onDishReorder: (dishes: Dish[]) => void;
  onAddDish: () => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dishId: string) => void;
  onToggleFeatured: (dishId: string) => void;
}

/**
 * A single draggable category row.
 * Renders a collapsible header with inline name editing and a nested
 * drag-and-drop list of dish cards.
 */
export function CategoryCard({
  category,
  isExpanded,
  editingCatId,
  editingCatName,
  deleteConfirm,
  onSetEditingCatName,
  onToggle,
  onStartEditing,
  onSaveName,
  onDelete,
  onSetDeleteConfirm,
  onDishReorder,
  onAddDish,
  onEditDish,
  onDeleteDish,
  onToggleFeatured,
}: CategoryCardProps) {
  return (
    <Reorder.Item
      value={category}
      className="list-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileDrag={{ scale: 1.02, opacity: 0.9, zIndex: 50 }}
    >
      <div className="glass-card overflow-hidden">
        {/* ── Category header ── */}
        <div className="flex items-center gap-2 px-4 py-3">
          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/25" />

          {/* Inline editable name */}
          {editingCatId === category.id ? (
            <input
              autoFocus
              value={editingCatName}
              onChange={(e) => onSetEditingCatName(e.target.value)}
              onBlur={onSaveName}
              onKeyDown={(e) => e.key === 'Enter' && onSaveName()}
              className="flex-1 rounded border border-[#d4a853]/40 bg-transparent px-2 py-0.5 text-sm text-white outline-none focus:border-[#d4a853]"
            />
          ) : (
            <span
              onDoubleClick={onStartEditing}
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
            onClick={onAddDish}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-white/30 hover:text-red-400 hover:bg-white/5"
            onClick={onDelete}
            disabled={deleteConfirm === `cat-${category.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-white/40 hover:text-white/80 hover:bg-white/5"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* ── Delete confirmation banner ── */}
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
                  هل تريد حذف &quot;{category.name}&quot;؟
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 text-xs"
                    onClick={onDelete}
                  >
                    حذف
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-white/50 hover:text-white"
                    onClick={() => onSetDeleteConfirm(null)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Expanded dishes list ── */}
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
                    onClick={onAddDish}
                  >
                    <Plus className="h-3 w-3" />
                    أضف طبق
                  </Button>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={category.dishes}
                  onReorder={onDishReorder}
                  className="divide-y divide-white/5"
                >
                  <AnimatePresence mode="popLayout">
                    {category.dishes.map((dish) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        deleteConfirm={deleteConfirm}
                        onEdit={() => onEditDish(dish)}
                        onDelete={() => onDeleteDish(dish.id)}
                        onToggleFeatured={() => onToggleFeatured(dish.id)}
                        onSetDeleteConfirm={onSetDeleteConfirm}
                      />
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
}
