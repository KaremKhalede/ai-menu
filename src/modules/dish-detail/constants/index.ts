export const gradients = [
  'from-amber-900/50 via-orange-900/30 to-transparent',
  'from-emerald-900/50 via-teal-900/30 to-transparent',
  'from-rose-900/50 via-pink-900/30 to-transparent',
  'from-stone-800/50 via-zinc-800/30 to-transparent',
  'from-yellow-900/50 via-amber-800/30 to-transparent',
  'from-cyan-900/50 via-sky-900/30 to-transparent',
];

export const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};
