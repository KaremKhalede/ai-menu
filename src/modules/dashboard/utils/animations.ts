import type { Variants } from 'framer-motion';

/**
 * Staggered fade-up used for KPI card grids.
 * Pass `custom={i}` on each child to get per-card delay.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/** Stagger container — staggers children by 60 ms. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
