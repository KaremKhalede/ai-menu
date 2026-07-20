'use client';

import { Shield, Phone, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionCard } from './SectionCard';
import type { UseAdminSettingsReturn } from '../hooks/useAdminSettings';

interface SecuritySectionProps {
  form: UseAdminSettingsReturn;
}

export function SecuritySection({ form }: SecuritySectionProps) {
  const { handleLogout } = form;

  return (
    <SectionCard title="الأمان" icon={Shield}>
      <div className="space-y-3 text-right" dir="rtl">
        <Button
          variant="outline"
          className="w-full justify-start border-border text-foreground hover:bg-[#d4a853]/10 hover:text-foreground cursor-pointer"
        >
          <Phone className="size-4 text-muted-foreground ml-2" />
          تغيير رقم الجوال
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start border-border text-foreground hover:bg-[#d4a853]/10 hover:text-foreground cursor-pointer"
        >
          <Mail className="size-4 text-muted-foreground ml-2" />
          تغيير البريد الإلكتروني
        </Button>
        <Button
          variant="destructive"
          className="w-full justify-start mt-2 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="size-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
    </SectionCard>
  );
}
