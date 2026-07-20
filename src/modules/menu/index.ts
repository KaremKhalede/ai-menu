/**
 * modules/menu — public API
 *
 * Only the symbols here form the stable contract for external consumers.
 * Internal utils, constants, and component sub-pieces are NOT exported
 * so that the implementation can evolve freely.
 *
 *   import { MenuEditor, useMenuEditor, useDishDialog } from '@/modules/menu';
 */

/* ── Page (primary entry point) ── */
export { default as MenuEditor } from './pages/MenuEditor';

/* ── Composable hooks (for embedding the editor in other pages) ── */
export { useMenuEditor } from './hooks/useMenuEditor';
export { useDishDialog } from './hooks/useDishDialog';

/* ── Components (exported for targeted reuse, e.g. DishDialog in another page) ── */
export { MenuHeader } from './components/MenuHeader';
export { CategoriesPanel } from './components/CategoriesPanel';
export { CategoryCard } from './components/CategoryCard';
export { DishCard } from './components/DishCard';
export { DishDialog } from './components/DishDialog';
export { AiPanel } from './components/AiPanel';

/* ── Module-specific types only ── */
export type { DeleteConfirmTarget, AISuggestionType } from './types';
