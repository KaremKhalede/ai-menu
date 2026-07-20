'use client';

import { ChefHat, Camera, Phone, Mail, Crown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from './SectionCard';
import { roleLabels } from '../constants';
import type { UseAdminSettingsReturn } from '../hooks/useAdminSettings';

interface ProfileSectionProps {
  form: UseAdminSettingsReturn;
}

export function ProfileSection({ form }: ProfileSectionProps) {
  const { user, editName, setEditName, handleSaveProfile } = form;
  const initials = (editName || 'م').charAt(0);

  return (
    <SectionCard title="الملف الشخصي" icon={ChefHat}>
      {/* Avatar */}
      <div className="mb-5 flex flex-col items-center">
        <div className="relative group">
          <div className="flex size-24 items-center justify-center rounded-full gold-gradient text-3xl font-black text-[#0a0a0f]">
            {initials}
          </div>
          <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer">
            <Camera className="size-6 text-white" />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4 text-right" dir="rtl">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground text-right">
            الاسم
          </label>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-10 bg-background/60 text-sm"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground text-right">
            رقم الجوال
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 justify-start">
            <Phone className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{user?.phone || '+966501234567'}</span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground text-right">
            البريد الإلكتروني
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 justify-start">
            <Mail className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground" dir="ltr">
              {user?.email || 'demo@menuai.sa'}
            </span>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground text-right">
            الدور
          </label>
          <div className="flex justify-start">
            <Badge className="bg-[#d4a853]/15 text-[#d4a853] border-[#d4a853]/30 px-3 py-1 text-xs gap-1">
              <Crown className="size-3" />
              {roleLabels[user?.role || 'owner']}
            </Badge>
          </div>
        </div>
      </div>

      {/* Save button */}
      <Button
        onClick={handleSaveProfile}
        className="mt-5 w-full gold-gradient text-sm font-semibold hover:opacity-90 cursor-pointer"
      >
        <Save className="size-4" />
        حفظ التعديلات
      </Button>
    </SectionCard>
  );
}
