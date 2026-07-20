'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { useToast } from '@/hooks/use-toast';
import { getAllPersonalities } from '@/lib/voice-personality';
import type { Restaurant, PersonalityMode } from '@/lib/types';

export function useAdminSettings() {
  const {
    user,
    setUser,
    restaurant,
    setRestaurant,
    setView,
    personalityMode,
    setPersonalityMode,
  } = useStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
      restaurant: state.restaurant,
      setRestaurant: state.setRestaurant,
      setView: state.setView,
      personalityMode: state.personalityMode,
      setPersonalityMode: state.setPersonalityMode,
    }))
  );
  const { toast } = useToast();

  const [editName, setEditName] = useState(user?.name || '');
  const [restName, setRestName] = useState(restaurant.name);
  const [restDesc, setRestDesc] = useState(restaurant.description);
  const [restTheme, setRestTheme] = useState<Restaurant['theme']>(restaurant.theme);
  const [restCurrency, setRestCurrency] = useState(restaurant.currency);

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name: editName });
      toast({ title: 'تم حفظ التعديلات', description: 'تم تحديث بياناتك بنجاح' });
    }
  };

  const handleSaveRestaurant = () => {
    setRestaurant({
      ...restaurant,
      name: restName,
      description: restDesc,
      theme: restTheme,
      currency: restCurrency,
    });
    toast({ title: 'تم الحفظ', description: 'تم تحديث بيانات المطعم' });
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    toast({ title: 'تم تسجيل الخروج', description: 'تم تسجيل خروجك بنجاح' });
  };

  const handleSavePersonality = (mode: PersonalityMode) => {
    setPersonalityMode(mode);
    const personality = getAllPersonalities().find((p) => p.mode === mode);
    toast({
      title: 'تم تغيير الشخصية',
      description: `الآن النادل الذكي هو "${personality?.name || mode}"`,
    });
  };

  return {
    user,
    restaurant,
    personalityMode,
    editName,
    setEditName,
    restName,
    setRestName,
    restDesc,
    setRestDesc,
    restTheme,
    setRestTheme,
    restCurrency,
    setRestCurrency,
    handleSaveProfile,
    handleSaveRestaurant,
    handleLogout,
    handleSavePersonality,
    setView,
    toast,
  };
}

export type UseAdminSettingsReturn = ReturnType<typeof useAdminSettings>;
