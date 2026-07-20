'use client';

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
  return (
    <div className="glass-card p-5 sm:p-6 text-right" dir="rtl">
      <div className="mb-4 flex items-center gap-2.5 justify-start">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#d4a853]/10">
          <Icon className="size-4.5 text-[#d4a853]" />
        </div>
        <h3 className="text-base font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
