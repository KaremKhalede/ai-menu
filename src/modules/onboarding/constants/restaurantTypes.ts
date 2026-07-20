import {
  Coffee,
  UtensilsCrossed,
  ChefHat,
  Cookie,
  Salad,
  CupSoda,
  type LucideIcon,
} from 'lucide-react';

export interface RestaurantType {
  id: string;
  emoji: string;
  icon: LucideIcon;
  name: string;
  desc: string;
}

export const RESTAURANT_TYPES: RestaurantType[] = [
  {
    id: 'cafe',
    emoji: '☕',
    icon: Coffee,
    name: 'كافيه / قهوة',
    desc: 'قهوة مختصة، مشروبات ساخنة وباردة',
  },
  {
    id: 'fine-dining',
    emoji: '🍽️',
    icon: UtensilsCrossed,
    name: 'مطعم فاخر',
    desc: 'تجربة طعام راقية بأجواء فاخرة',
  },
  {
    id: 'fast-food',
    emoji: '🥙',
    icon: ChefHat,
    name: 'مطعم سريع',
    desc: 'وجبات سريعة وتوصيل فوري',
  },
  {
    id: 'bakery',
    emoji: '🍰',
    icon: Cookie,
    name: 'حلويات / مخبز',
    desc: 'معجنات، كيك، وحلويات شرقية وغربية',
  },
  {
    id: 'healthy',
    emoji: '🥗',
    icon: Salad,
    name: 'صحي / سلطات',
    desc: 'وجبات صحية وسلطات طازجة',
  },
  {
    id: 'juice',
    emoji: '🧃',
    icon: CupSoda,
    name: 'عصائر / سموذي',
    desc: 'عصائر طبيعية وسموذي طازج',
  },
];
