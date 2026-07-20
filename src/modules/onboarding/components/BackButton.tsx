'use client';

/** Shared back button used at the top of Steps 2, 3. */
export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      → <span>رجوع</span>
    </button>
  );
}
