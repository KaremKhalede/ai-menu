'use client';

import { GripVertical, Trash2, Edit3, Star } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import type { Dish } from '../types';
import { getDishEmoji } from '../utils/dish';

interface DishCardProps {
  dish: Dish;
  deleteConfirm: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onSetDeleteConfirm: (target: string | null) => void;
}

/**
 * A single draggable dish row inside a category.
 * Shows emoji, name, featured badge, price, featured toggle, and action buttons.
 * Inline delete confirmation expands beneath the row.
 */
export function DishCard({
  dish,
  deleteConfirm,
  onEdit,
  onDelete,
  onToggleFeatured,
  onSetDeleteConfirm,
}: DishCardProps) {
  return (
    <Reorder.Item
      value={dish}
      className="list-none"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileDrag={{ scale: 1.01, opacity: 0.85, zIndex: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Main row */}
      <div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/15" />

        <span className="text-2xl leading-none" role="img" aria-label={dish.name}>
          {getDishEmoji(dish.name)}
        </span>

        {/* Name + featured badge */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-white/85">
            {dish.name || 'بدون اسم'}
          </p>
          {dish.isFeatured && (
            <Badge className="mt-0.5 bg-[#d4a853]/15 text-[10px] text-[#d4a853] border-[#d4a853]/20">
              <Star className="mr-0.5 h-2.5 w-2.5" />
              مميز
            </Badge>
          )}
        </div>

        {/* Price */}
        <span className="shrink-0 text-sm font-bold text-[#d4a853]">
          {dish.price} ر.س
        </span>

        {/* Featured toggle */}
        <div className="flex items-center gap-1.5" title="مميز">
          <Switch
            checked={dish.isFeatured}
            onCheckedChange={onToggleFeatured}
            className="scale-75 data-[state=checked]:bg-[#d4a853]"
          />
        </div>

        {/* Edit */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-white/25 hover:text-[#d4a853] hover:bg-white/5"
          onClick={onEdit}
        >
          <Edit3 className="h-3.5 w-3.5" />
        </Button>

        {/* Delete trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-white/25 hover:text-red-400 hover:bg-white/5"
          onClick={() => onSetDeleteConfirm(`dish-${dish.id}`)}
          disabled={deleteConfirm === `dish-${dish.id}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Delete confirmation banner */}
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
    </Reorder.Item>
  );
}
