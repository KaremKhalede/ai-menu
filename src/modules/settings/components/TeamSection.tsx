'use client';

import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from './SectionCard';
import { teamMembers, roleLabels } from '../constants';
import type { UseAdminSettingsReturn } from '../hooks/useAdminSettings';

interface TeamSectionProps {
  form: UseAdminSettingsReturn;
}

export function TeamSection({ form }: TeamSectionProps) {
  const { toast } = form;

  return (
    <SectionCard title="الفريق" icon={UserPlus}>
      <h4 className="mb-3 text-sm font-semibold text-foreground text-right">أعضاء الفريق</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-background/30 p-3 text-right"
            dir="rtl"
          >
            {/* Avatar */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d4a853]/10 text-sm font-bold text-[#d4a853]">
              {member.name.charAt(0)}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 justify-start">
                <span className="text-sm font-semibold truncate">{member.name}</span>
                <Badge
                  variant={member.role === 'owner' ? 'default' : 'secondary'}
                  className={`text-[10px] px-1.5 py-0 ${
                    member.role === 'owner'
                      ? 'bg-[#d4a853]/15 text-[#d4a853] border-[#d4a853]/30'
                      : ''
                  }`}
                >
                  {roleLabels[member.role]}
                </Badge>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground truncate text-right" dir="ltr">
                {member.email}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] cursor-pointer"
        onClick={() =>
          toast({
            title: 'قريباً!',
            description: 'ستتوفر ميزة دعوة أعضاء الفريق قريباً',
          })
        }
      >
        <UserPlus className="size-4" />
        دعوة عضو جديد
      </Button>
    </SectionCard>
  );
}
