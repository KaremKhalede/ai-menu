'use client';

interface DashboardHeaderProps {
  userName?: string;
}

/**
 * Page-level header: "لوحة التحكم" title + optional greeting.
 */
export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold gold-gradient-text">لوحة التحكم</h1>
      {userName && (
        <p className="text-sm text-muted-foreground mt-1">مرحباً، {userName}</p>
      )}
    </div>
  );
}
