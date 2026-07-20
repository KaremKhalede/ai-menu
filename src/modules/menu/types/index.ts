/* ─────────────── Menu Module – shared types ─────────────── */

// Re-export the project-wide types needed inside this module so internal
// imports only have to reach one place.
export type { Dish, Addon, Category } from '@/lib/types';

/* ─────────────── Local / module-specific types ─────────────── */

/** Identifies a pending delete confirmation target. */
export type DeleteConfirmTarget =
  | `cat-${string}`
  | `dish-${string}`
  | null;

/** The three flavours of AI suggestion cards shown in the AI panel. */
export type AISuggestionType = 'improve' | 'price' | 'feature';
