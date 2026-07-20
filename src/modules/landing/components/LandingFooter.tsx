'use client';

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-4 py-8 text-right" dir="rtl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <span>MenuAI © 2025 - جميع الحقوق محفوظة</span>
        <div className="flex items-center gap-6">
          <button className="transition-colors hover:text-foreground cursor-pointer">سياسة الخصوصية</button>
          <button className="transition-colors hover:text-foreground cursor-pointer">شروط الاستخدام</button>
        </div>
      </div>
    </footer>
  );
}
