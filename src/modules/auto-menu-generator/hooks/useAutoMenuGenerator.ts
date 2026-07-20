'use client';

import { useState, useCallback } from 'react';
import { useStore } from '@/lib/store';
import type { Category, Dish } from '@/lib/types';
import { generateMenu } from '../services/ai';
import { createNewDish } from '../utils';
import type { Step } from '../types';

export function useAutoMenuGenerator() {
  const { setCategories, setView } = useStore();

  // Form configurations state
  const [restaurantType, setRestaurantType] = useState('');
  const [cuisine, setCuisine] = useState('سعودي');
  const [priceRange, setPriceRange] = useState<'budget' | 'medium' | 'premium' | 'luxury'>('medium');
  const [numCategories, setNumCategories] = useState(5);

  // Workflow steps progress
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generated menus state
  const [restaurantName, setRestaurantName] = useState('');
  const [categories, setLocalCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [totalDishes, setTotalDishes] = useState(0);

  // Expand / collapse subviews
  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(new Set(categories.map((c) => c.id)));
  }, [categories]);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  // Request trigger
  const handleGenerate = async () => {
    if (!restaurantType.trim()) {
      setError('يرجى كتابة نوع المطعم');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await generateMenu({
        restaurantType: restaurantType.trim(),
        cuisine,
        priceRange,
        numberOfCategories: numCategories,
      });

      if (data.categories && data.categories.length > 0) {
        setRestaurantName(data.restaurantName || restaurantType);
        setLocalCategories(data.categories);
        setExpandedCategories(new Set([data.categories[0].id]));
        setTotalDishes(
          data.categories.reduce((sum: number, cat: Category) => sum + cat.dishes.length, 0)
        );
        setStep('preview');
      } else {
        throw new Error('لم يتم توليد بيانات صالحة');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء التوليد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const updateDish = (catId: string, dishId: string, field: keyof Dish, value: unknown) => {
    setLocalCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          dishes: cat.dishes.map((dish) => {
            if (dish.id !== dishId) return dish;
            return { ...dish, [field]: value };
          }),
        };
      })
    );
  };

  const addDish = (catId: string) => {
    const newDish = createNewDish(catId);
    setLocalCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, dishes: [...cat.dishes, newDish] };
      })
    );
    setEditingDish(newDish.id);
    setExpandedCategories((prev) => new Set(prev).add(catId));
  };

  const handleSave = () => {
    setCategories(categories);
    setStep('success');
  };

  const handleRegenerate = () => {
    setStep('input');
  };

  return {
    restaurantType,
    setRestaurantType,
    cuisine,
    setCuisine,
    priceRange,
    setPriceRange,
    numCategories,
    setNumCategories,
    step,
    setStep,
    loading,
    error,
    setError,
    restaurantName,
    categories,
    expandedCategories,
    editingDish,
    setEditingDish,
    totalDishes,
    toggleCategory,
    expandAll,
    collapseAll,
    handleGenerate,
    updateDish,
    addDish,
    handleSave,
    handleRegenerate,
    setView,
  };
}
export type UseAutoMenuGeneratorReturn = ReturnType<typeof useAutoMenuGenerator>;
