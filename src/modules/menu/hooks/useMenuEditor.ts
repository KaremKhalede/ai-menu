'use client';

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import type { Category, Dish } from '../types';
import { emptyDish, generateAIDescription } from '../utils/dish';

/* ─────────────── useMenuEditor ─────────────── */

/**
 * Centralises all state and event-handlers required by the MenuEditor page.
 * Components consume this hook and receive only the slice they need.
 */
export function useMenuEditor() {
  const { categories, setCategories } = useStore(
    useShallow((state) => ({
      categories: state.categories,
      setCategories: state.setCategories,
    }))
  );

  /* ── Category expand / collapse ── */
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.id))
  );

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* ── Category inline-name editing ── */
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const startEditingCat = useCallback((cat: Category) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  }, []);

  const saveCatName = useCallback(() => {
    if (!editingCatId || !editingCatName.trim()) return;
    setCategories(
      categories.map((c) =>
        c.id === editingCatId ? { ...c, name: editingCatName.trim() } : c
      )
    );
    setEditingCatId(null);
  }, [editingCatId, editingCatName, categories, setCategories]);

  /* ── Category CRUD ── */
  const deleteCategory = useCallback(
    (catId: string) => {
      setCategories(categories.filter((c) => c.id !== catId));
      toast.success('تم حذف التصنيف بنجاح');
    },
    [categories, setCategories]
  );

  const addCategory = useCallback(() => {
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: 'تصنيف جديد',
      sortOrder: categories.length,
      dishes: [],
    };
    setCategories([...categories, newCat]);
    setExpandedCategories((prev) => new Set(prev).add(newCat.id));
  }, [categories, setCategories]);

  /* ── Category reorder (drag-and-drop) ── */
  const onCategoryReorder = useCallback(
    (newOrder: Category[]) => {
      setCategories(newOrder.map((cat, idx) => ({ ...cat, sortOrder: idx })));
    },
    [setCategories]
  );

  /* ── Dish reorder ── */
  const onDishReorder = useCallback(
    (categoryId: string, newDishes: Dish[]) => {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, dishes: newDishes } : cat
        )
      );
    },
    [categories, setCategories]
  );

  /* ── Dish featured toggle ── */
  const toggleFeatured = useCallback(
    (categoryId: string, dishId: string) => {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                dishes: cat.dishes.map((d) =>
                  d.id === dishId ? { ...d, isFeatured: !d.isFeatured } : d
                ),
              }
            : cat
        )
      );
    },
    [categories, setCategories]
  );

  /* ── Dish delete ── */
  const deleteDish = useCallback(
    (categoryId: string, dishId: string) => {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, dishes: cat.dishes.filter((d) => d.id !== dishId) }
            : cat
        )
      );
      toast.success('تم حذف الطبق بنجاح');
    },
    [categories, setCategories]
  );

  /* ── Delete confirmation ── */
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ── AI suggestions: Memoized expensive calculation ── */
  const allDishes = useMemo(() => categories.flatMap((c) => c.dishes), [categories]);
  const dishWithoutDesc = useMemo(() => allDishes.find((d) => !d.description.trim()), [allDishes]);
  const avgPrice = useMemo(() => {
    return allDishes.length > 0
      ? allDishes.reduce((s, d) => s + d.price, 0) / allDishes.length
      : 0;
  }, [allDishes]);
  const cheapDish = useMemo(() => {
    return allDishes.find(
      (d) => avgPrice > 0 && d.price < avgPrice * 0.8
    );
  }, [allDishes, avgPrice]);
  const nonFeaturedDish = useMemo(() => allDishes.find((d) => !d.isFeatured), [allDishes]);

  const handleSuggestion = useCallback(
    (type: string) => {
      if (type === 'improve' && dishWithoutDesc) {
        const desc = generateAIDescription(dishWithoutDesc.name);
        setCategories(
          categories.map((cat) => ({
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === dishWithoutDesc.id ? { ...d, description: desc } : d
            ),
          }))
        );
        toast.success(`تم تحسين وصف "${dishWithoutDesc.name}"`);
      } else if (type === 'price' && cheapDish) {
        const newPrice = Math.round(avgPrice);
        setCategories(
          categories.map((cat) => ({
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === cheapDish.id ? { ...d, price: newPrice } : d
            ),
          }))
        );
        toast.success(`تم تعديل سعر "${cheapDish.name}" إلى ${newPrice} ر.س`);
      } else if (type === 'feature' && nonFeaturedDish) {
        setCategories(
          categories.map((cat) => ({
            ...cat,
            dishes: cat.dishes.map((d) =>
              d.id === nonFeaturedDish.id ? { ...d, isFeatured: true } : d
            ),
          }))
        );
        toast.success(`تم تمييز "${nonFeaturedDish.name}"`);
      }
    },
    [
      dishWithoutDesc,
      cheapDish,
      nonFeaturedDish,
      avgPrice,
      categories,
      setCategories,
    ]
  );

  return {
    /* state */
    categories,
    expandedCategories,
    editingCatId,
    editingCatName,
    setEditingCatName,
    deleteConfirm,
    setDeleteConfirm,
    /* category actions */
    toggleCategory,
    startEditingCat,
    saveCatName,
    addCategory,
    deleteCategory,
    onCategoryReorder,
    /* dish actions */
    onDishReorder,
    toggleFeatured,
    deleteDish,
    /* AI derived data */
    dishWithoutDesc,
    cheapDish,
    nonFeaturedDish,
    handleSuggestion,
  };
}
