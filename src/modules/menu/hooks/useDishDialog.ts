'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import type { Dish, Addon } from '../types';
import { emptyDish } from '../utils/dish';

/* ─────────────── useDishDialog ─────────────── */

/**
 * Manages the add/edit dish dialog: open state, form values, addons CRUD,
 * and the save / cancel flow.
 */
export function useDishDialog() {
  const { categories, setCategories } = useStore(
    useShallow((state) => ({
      categories: state.categories,
      setCategories: state.setCategories,
    }))
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishForm, setDishForm] = useState<Dish>(emptyDish(''));

  /* ── Open helpers ── */
  const openAddDish = useCallback((categoryId: string) => {
    setEditingDish(null);
    setDishForm(emptyDish(categoryId));
    setDialogOpen(true);
  }, []);

  const openEditDish = useCallback((dish: Dish) => {
    setEditingDish(dish);
    setDishForm({ ...dish, addons: dish.addons.map((a) => ({ ...a })) });
    setDialogOpen(true);
  }, []);

  /* ── Save ── */
  const saveDish = useCallback(() => {
    if (!dishForm.name.trim()) {
      toast.error('يرجى إدخال اسم الطبق');
      return;
    }

    const updatedCategories = categories.map((cat) => {
      if (cat.id !== dishForm.categoryId) return cat;
      if (editingDish) {
        return {
          ...cat,
          dishes: cat.dishes.map((d) =>
            d.id === editingDish.id ? { ...dishForm } : d
          ),
        };
      }
      return { ...cat, dishes: [...cat.dishes, { ...dishForm }] };
    });
    setCategories(updatedCategories);

    setDialogOpen(false);
    toast.success(editingDish ? 'تم تعديل الطبق بنجاح' : 'تم إضافة الطبق بنجاح');
  }, [dishForm, editingDish, categories, setCategories]);

  /* ── Addon helpers ── */
  const updateFormAddon = useCallback(
    (index: number, field: keyof Addon, value: string | number) => {
      setDishForm((prev) => {
        const newAddons = [...prev.addons];
        newAddons[index] = { ...newAddons[index], [field]: value };
        return { ...prev, addons: newAddons };
      });
    },
    []
  );

  const addFormAddon = useCallback(() => {
    setDishForm((prev) => ({
      ...prev,
      addons: [...prev.addons, { name: '', price: 0 }],
    }));
  }, []);

  const removeFormAddon = useCallback((index: number) => {
    setDishForm((prev) => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index),
    }));
  }, []);

  return {
    /* state */
    dialogOpen,
    setDialogOpen,
    editingDish,
    dishForm,
    setDishForm,
    categories,
    /* actions */
    openAddDish,
    openEditDish,
    saveDish,
    updateFormAddon,
    addFormAddon,
    removeFormAddon,
  };
}
