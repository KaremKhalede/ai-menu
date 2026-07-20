import type { Restaurant } from '@/lib/types';

export interface ThemeOption {
  id: Restaurant['theme'];
  name: string;
  accent: string;
  accentLight: string;
  preview: string[];
}

export const THEMES: ThemeOption[] = [
  {
    id: 'luxury',
    name: 'فاخر',
    accent: '#d4a853',
    accentLight: 'rgba(212,168,83,0.15)',
    preview: ['bg-[#d4a853]', 'bg-[#e8c47c]', 'bg-[#c9956b]', 'bg-[#f0ece4]'],
  },
  {
    id: 'modern',
    name: 'عصري',
    accent: '#2dd4bf',
    accentLight: 'rgba(45,212,191,0.15)',
    preview: ['bg-teal-400', 'bg-teal-300', 'bg-emerald-400', 'bg-cyan-400'],
  },
  {
    id: 'warm',
    name: 'دافئ',
    accent: '#f97316',
    accentLight: 'rgba(249,115,22,0.15)',
    preview: ['bg-orange-500', 'bg-amber-500', 'bg-orange-400', 'bg-yellow-500'],
  },
];

export const CURRENCIES: string[] = ['ر.س', 'د.إ', 'د.ك', 'ر.ع', 'ر.ق', 'د.ج'];
