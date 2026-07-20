'use client';

import { motion } from 'framer-motion';
import { GripVertical, Crown, Star, Check, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { fadeUp } from '../constants';
import type { Dish } from '@/lib/types';

interface DishCardProps {
  dish: Dish;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (field: keyof Dish, value: unknown) => void;
  index: number;
}

export function DishCard({ dish, isEditing, onEdit, onUpdate, index }: DishCardProps) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className={`relative rounded-xl border transition-all text-right ${
        dish.isFeatured
          ? 'bg-[#d4a853]/[0.04] border-[#d4a853]/20'
          : 'bg-white/[0.02] border-white/[0.06]'
      } ${isEditing ? 'ring-1 ring-[#d4a853]/40' : ''}`}
      dir="rtl"
    >
      {/* Drag handle + Featured badge row */}
      <div className="flex items-start gap-3 p-4">
        <GripVertical className="h-4 w-4 text-[#8a8578]/40 mt-1 shrink-0 cursor-grab" />

        <div className="flex-1 min-w-0 space-y-2">
          {/* Top row: name + price + badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={dish.name}
                  onChange={(e) => onUpdate('name', e.target.value)}
                  className="h-9 bg-[#0a0a0f] border-[#d4a853]/30 text-sm mb-2"
                  dir="rtl"
                />
              ) : (
                <h4 className="font-bold text-sm text-[#f0ece4] truncate">{dish.name}</h4>
              )}
              {dish.nameEn && !isEditing && (
                <p className="text-[10px] text-[#8a8578] text-right">{dish.nameEn}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 justify-end">
              {dish.isFeatured && (
                <Badge className="bg-[#d4a853]/20 text-[#d4a853] border-[#d4a853]/30 text-[10px] gap-1">
                  <Crown className="h-3 w-3" />
                  مميز
                </Badge>
              )}
              <div className="flex items-center gap-1 text-[#d4a853]">
                <Star className="h-3 w-3 fill-[#d4a853]" />
                <span className="text-xs font-semibold">{dish.rating}</span>
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  value={dish.price}
                  onChange={(e) => onUpdate('price', parseFloat(e.target.value) || 0)}
                  className="w-20 h-8 bg-[#0a0a0f] border-[#d4a853]/30 text-xs text-left text-[#d4a853]"
                  dir="ltr"
                />
              ) : (
                <span className="text-base font-bold text-[#d4a853]">{dish.price} ر.س</span>
              )}
            </div>
          </div>

          {/* Description */}
          {isEditing ? (
            <Textarea
              value={dish.description}
              onChange={(e) => onUpdate('description', e.target.value)}
              className="h-16 bg-[#0a0a0f] border-[#d4a853]/30 text-xs resize-none"
              dir="rtl"
            />
          ) : (
            <p className="text-xs text-[#8a8578] leading-relaxed line-clamp-2">{dish.description}</p>
          )}

          {/* Tags */}
          {dish.tags.length > 0 && !isEditing && (
            <div className="flex flex-wrap gap-1.5 mt-1 justify-start">
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#8a8578]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Addons & Pairings (collapsed) */}
          {!isEditing && (
            <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-[#8a8578]/70 justify-start">
              {dish.addons.length > 0 && (
                <span>+{dish.addons.length} إضافات</span>
              )}
              {dish.pairings.length > 0 && (
                <span>{dish.pairings.length} اقتراحات تقديم</span>
              )}
            </div>
          )}

          {/* Edit mode: addons & pairings detail */}
          {isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2 border-t border-white/[0.06]">
              <div className="space-y-1">
                <p className="text-[10px] text-[#8a8578] font-semibold text-right">الإضافات</p>
                {dish.addons.map((addon, ai) => (
                  <div key={ai} className="flex gap-2 items-center">
                    <Input
                      value={addon.name}
                      onChange={(e) => {
                        const newAddons = [...dish.addons];
                        newAddons[ai] = { ...addon, name: e.target.value };
                        onUpdate('addons', newAddons);
                      }}
                      className="h-7 bg-[#0a0a0f] border-white/[0.06] text-[10px]"
                      dir="rtl"
                      placeholder="اسم الإضافة"
                    />
                    <Input
                      type="number"
                      value={addon.price}
                      onChange={(e) => {
                        const newAddons = [...dish.addons];
                        newAddons[ai] = { ...addon, price: parseFloat(e.target.value) || 0 };
                        onUpdate('addons', newAddons);
                      }}
                      className="w-16 h-7 bg-[#0a0a0f] border-white/[0.06] text-[10px] text-left"
                      dir="ltr"
                      placeholder="السعر"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-[#8a8578] font-semibold text-right">اقتراحات التقديم</p>
                {dish.pairings.map((pairing, pi) => (
                  <Input
                    key={pi}
                    value={pairing}
                    onChange={(e) => {
                      const newPairings = [...dish.pairings];
                      newPairings[pi] = e.target.value;
                      onUpdate('pairings', newPairings);
                    }}
                    className="h-7 bg-[#0a0a0f] border-white/[0.06] text-[10px]"
                    dir="rtl"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit button */}
        <button
          onClick={onEdit}
          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            isEditing
              ? 'bg-[#d4a853]/20 text-[#d4a853]'
              : 'bg-white/[0.05] text-[#8a8578] hover:text-[#f0ece4] hover:bg-white/[0.08]'
          }`}
        >
          {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-3.5 w-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}
