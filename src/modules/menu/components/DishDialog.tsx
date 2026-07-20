'use client';

import { Plus, X, Save, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Dish, Addon, Category } from '../types';

interface DishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDish: Dish | null;
  dishForm: Dish;
  categories: Category[];
  onSetDishForm: (dish: Dish) => void;
  onSave: () => void;
  onUpdateAddon: (index: number, field: keyof Addon, value: string | number) => void;
  onAddAddon: () => void;
  onRemoveAddon: (index: number) => void;
}

/**
 * Modal dialog for adding or editing a dish.
 * Receives all state and handlers from the parent / hook —
 * the component itself is purely presentational.
 */
export function DishDialog({
  open,
  onOpenChange,
  editingDish,
  dishForm,
  categories,
  onSetDishForm,
  onSave,
  onUpdateAddon,
  onAddAddon,
  onRemoveAddon,
}: DishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#12121a] sm:max-w-lg"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-white">
            {editingDish ? 'تعديل الطبق' : 'إضافة طبق جديد'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Dish name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">
              اسم الطبق <span className="text-red-400">*</span>
            </Label>
            <Input
              value={dishForm.name}
              onChange={(e) => onSetDishForm({ ...dishForm, name: e.target.value })}
              placeholder="أدخل اسم الطبق"
              className="border-white/10 bg-white/5 text-sm text-white placeholder:text-white/25 focus:border-[#d4a853]/50 focus:ring-[#d4a853]/20"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">الوصف</Label>
            <Textarea
              value={dishForm.description}
              onChange={(e) => onSetDishForm({ ...dishForm, description: e.target.value })}
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
                  onSetDishForm({ ...dishForm, price: Number(e.target.value) || 0 })
                }
                placeholder="0"
                className="border-white/10 bg-white/5 pr-9 text-sm text-white placeholder:text-white/25 focus:border-[#d4a853]/50 focus:ring-[#d4a853]/20"
              />
            </div>
          </div>

          {/* Category select */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">التصنيف</Label>
            <select
              value={dishForm.categoryId}
              onChange={(e) => onSetDishForm({ ...dishForm, categoryId: e.target.value })}
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
                onClick={onAddAddon}
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
                      onChange={(e) => onUpdateAddon(idx, 'name', e.target.value)}
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
                        onUpdateAddon(idx, 'price', Number(e.target.value) || 0)
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
                    onClick={() => onRemoveAddon(idx)}
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
                onSetDishForm({ ...dishForm, isFeatured: checked })
              }
              className="data-[state=checked]:bg-[#d4a853]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white/70">متاح؟</Label>
            <Switch
              checked={dishForm.isAvailable}
              onCheckedChange={(checked) =>
                onSetDishForm({ ...dishForm, isAvailable: checked })
              }
              className="data-[state=checked]:bg-[#d4a853]"
            />
          </div>

          <Separator className="bg-white/5" />

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              onClick={onSave}
              className="flex-1 gap-2 text-black font-semibold hover:bg-[#e0b965] transition-colors"
              style={{ backgroundColor: '#d4a853' }}
            >
              <Save className="h-4 w-4" />
              {editingDish ? 'حفظ التعديلات' : 'إضافة الطبق'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
