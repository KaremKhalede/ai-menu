import type { Variants } from 'framer-motion';

/**
 * Step slide transition — slides in from right/left based on direction.
 * Pass `custom={1}` for forward, `custom={-1}` for backward.
 */
export const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

/** Fade-in from below. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/** Stagger container — staggers its children by 60 ms. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/** Spring bounce-in for celebratory icons. */
export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 14, delay: 0.15 },
  },
};
