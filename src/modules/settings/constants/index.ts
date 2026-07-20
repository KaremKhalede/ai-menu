export const themes = [
  {
    id: 'luxury' as const,
    name: 'فاخر',
    accent: '#d4a853',
    preview: ['bg-[#d4a853]', 'bg-[#e8c47c]', 'bg-[#c9956b]', 'bg-[#f0ece4]'],
  },
  {
    id: 'modern' as const,
    name: 'عصري',
    accent: '#2dd4bf',
    preview: ['bg-teal-400', 'bg-teal-300', 'bg-emerald-400', 'bg-cyan-400'],
  },
  {
    id: 'warm' as const,
    name: 'دافئ',
    accent: '#f97316',
    preview: ['bg-orange-500', 'bg-amber-500', 'bg-orange-400', 'bg-yellow-500'],
  },
];

export const currencies = ['ر.س', 'د.إ', 'د.ك', 'ر.ع', 'ر.ق', 'د.ج'];

export const roleLabels: Record<string, string> = {
  owner: 'صاحب المطعم',
  manager: 'مدير',
  employee: 'موظف',
};

export const teamMembers = [
  {
    id: '1',
    name: 'أحمد المطعمي',
    role: 'owner' as const,
    phone: '+966501234567',
    email: 'ahmed@menuai.sa',
  },
  {
    id: '2',
    name: 'سارة العتيبي',
    role: 'manager' as const,
    phone: '+966559876543',
    email: 'sara@menuai.sa',
  },
];

export const planFeatures = [
  'قائمة طعام ذكية بـ AI',
  'حتى 50 طبق',
  'كود QR لكل طاولة',
  'نادل AI ذكي',
  'سلة طلبات ذكية',
  'تقارير أساسية',
];

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: i * 0.06 },
  }),
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
