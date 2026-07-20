'use client';

import { Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useMenuEditor } from '../hooks/useMenuEditor';
import { useDishDialog } from '../hooks/useDishDialog';
import { MenuHeader } from '../components/MenuHeader';
import { CategoriesPanel } from '../components/CategoriesPanel';
import { DishDialog } from '../components/DishDialog';
import { AiPanel } from '../components/AiPanel';

/* ─────────────── Auth guard ─────────────── */

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { setView, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#1a1a2e] flex items-center justify-center">
          <Edit3 className="h-10 w-10 text-[#d4a853]" />
        </div>
        <h2 className="text-2xl font-bold gold-gradient-text">محرر المنيو</h2>
        <p className="text-muted-foreground max-w-sm">
          يجب تسجيل الدخول للوصول إلى محرر المنيو
        </p>
        <Button
          onClick={() => setView('login')}
          className="gold-gradient hover:opacity-90"
        >
          تسجيل الدخول
        </Button>
        <Button variant="ghost" onClick={() => setView('landing')}>
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

/* ─────────────── MenuEditor page ─────────────── */

/**
 * Full-page Menu Editor.
 *
 * Composes the two feature hooks (`useMenuEditor` + `useDishDialog`) and
 * delegates rendering to focused child components.
 */
export default function MenuEditor() {
  const editor = useMenuEditor();
  const dialog = useDishDialog();

  return (
    <AuthGuard>
      <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
        <MenuHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
            {/* Categories panel */}
            <CategoriesPanel
              categories={editor.categories}
              expandedCategories={editor.expandedCategories}
              editingCatId={editor.editingCatId}
              editingCatName={editor.editingCatName}
              deleteConfirm={editor.deleteConfirm}
              onSetEditingCatName={editor.setEditingCatName}
              onAddCategory={editor.addCategory}
              onToggleCategory={editor.toggleCategory}
              onStartEditingCat={editor.startEditingCat}
              onSaveCatName={editor.saveCatName}
              onDeleteCategory={editor.deleteCategory}
              onSetDeleteConfirm={editor.setDeleteConfirm}
              onCategoryReorder={editor.onCategoryReorder}
              onDishReorder={editor.onDishReorder}
              onAddDish={dialog.openAddDish}
              onEditDish={dialog.openEditDish}
              onDeleteDish={editor.deleteDish}
              onToggleFeatured={editor.toggleFeatured}
            />

            {/* AI sidebar */}
            <AiPanel
              dishWithoutDesc={editor.dishWithoutDesc}
              cheapDish={editor.cheapDish}
              nonFeaturedDish={editor.nonFeaturedDish}
              onSuggestion={editor.handleSuggestion}
            />
          </div>
        </main>

        {/* Add / Edit dish dialog */}
        <DishDialog
          open={dialog.dialogOpen}
          onOpenChange={dialog.setDialogOpen}
          editingDish={dialog.editingDish}
          dishForm={dialog.dishForm}
          categories={dialog.categories}
          onSetDishForm={dialog.setDishForm}
          onSave={dialog.saveDish}
          onUpdateAddon={dialog.updateFormAddon}
          onAddAddon={dialog.addFormAddon}
          onRemoveAddon={dialog.removeFormAddon}
        />
      </div>
    </AuthGuard>
  );
}
