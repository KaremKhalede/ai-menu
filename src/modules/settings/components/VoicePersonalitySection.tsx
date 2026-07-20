'use client';

import { Mic, MessageCircle, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { getAllPersonalities } from '@/lib/voice-personality';
import type { BrandVoice } from '@/lib/voice-personality';
import { SectionCard } from './SectionCard';
import type { UseAdminSettingsReturn } from '../hooks/useAdminSettings';

interface VoicePersonalitySectionProps {
  form: UseAdminSettingsReturn;
}

export function VoicePersonalitySection({ form }: VoicePersonalitySectionProps) {
  const { personalityMode, handleSavePersonality } = form;

  return (
    <SectionCard title="شخصية النادل الذكي" icon={Mic}>
      <p className="mb-4 text-xs text-muted-foreground leading-relaxed text-right">
        اختر نبرة وأسلوب النادل الذكي عند التحدث مع العملاء. كل شخصية لها طريقة مختلفة في التوصية والبيع.
      </p>
      <div className="grid grid-cols-1 gap-3">
        {getAllPersonalities().map((p: BrandVoice) => {
          const isActive = personalityMode === p.mode;
          return (
            <button
              key={p.mode}
              onClick={() => handleSavePersonality(p.mode)}
              className={`relative flex items-start gap-3 rounded-xl border p-4 text-right transition-all cursor-pointer ${
                isActive
                  ? 'border-[#d4a853]/60 bg-[#d4a853]/5'
                  : 'border-border bg-background/40 hover:border-border/80'
              }`}
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                  isActive ? 'gold-gradient' : 'bg-white/5'
                }`}
              >
                <MessageCircle
                  className={`size-5 ${isActive ? 'text-[#0a0a0f]' : 'text-muted-foreground'}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 justify-start">
                  <span className="text-sm font-bold text-foreground">{p.name}</span>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 ${
                      isActive
                        ? 'bg-[#d4a853]/20 text-[#d4a853] border-[#d4a853]/30'
                        : 'bg-white/5 text-muted-foreground border-white/10'
                    }`}
                  >
                    {p.tone}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 text-right">
                  {p.greeting}
                </p>
                <div className="mt-2 flex flex-wrap gap-1 justify-start">
                  {p.catchphrases.slice(0, 3).map((cp, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {cp}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1.5 justify-start">
                  <Zap className="size-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    أسلوب البيع:{' '}
                    {
                      {
                        gentle: 'لطيف',
                        direct: 'مباشر',
                        storytelling: 'سرد قصصي',
                        social_proof: 'إثبات اجتماعي',
                      }[p.upsellStyle]
                    }
                  </span>
                </div>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full gold-gradient"
                >
                  <CheckCircle2 className="size-3 text-[#0a0a0f]" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
