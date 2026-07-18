'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Shield,
  LogOut,
  Crown,
  UserPlus,
  ChefHat,
  Save,
  Phone,
  Mail,
  Mic,
  Volume2,
  Sparkles,
  MessageCircle,
  Zap,
  Users,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import type { Restaurant, PersonalityMode } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getAllPersonalities } from '@/lib/voice-personality';
import type { BrandVoice } from '@/lib/voice-personality';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const themes = [
  {
    id: 'luxury' as const,
    name: 'فاخر',
    accent: '#d4a853',
    preview: ['bg-[#d4a853]', 'bg-[#e8c47c]', 'bg-[#c9956b]', 'bg-[#f0ece4]'],
  },
  {
    id: 'modern' as const,
    name: 'عصري',
    accent: '#2dd4bf',
    preview: ['bg-teal-400', 'bg-teal-300', 'bg-emerald-400', 'bg-cyan-400'],
  },
  {
    id: 'warm' as const,
    name: 'دافئ',
    accent: '#f97316',
    preview: ['bg-orange-500', 'bg-amber-500', 'bg-orange-400', 'bg-yellow-500'],
  },
];

const currencies = ['ر.س', 'د.إ', 'د.ك', 'ر.ع', 'ر.ق', 'د.ج'];

const roleLabels: Record<string, string> = {
  owner: 'صاحب المطعم',
  manager: 'مدير',
  employee: 'موظف',
};

const teamMembers = [
  {
    id: '1',
    name: 'أحمد المطعمي',
    role: 'owner' as const,
    phone: '+966501234567',
    email: 'ahmed@menuai.sa',
  },
  {
    id: '2',
    name: 'سارة العتيبي',
    role: 'manager' as const,
    phone: '+966559876543',
    email: 'sara@menuai.sa',
  },
];

const planFeatures = [
  'قائمة طعام ذكية بـ AI',
  'حتى 50 طبق',
  'كود QR لكل طاولة',
  'نادل AI ذكي',
  'سلة طلبات ذكية',
  'تقارير أساسية',
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.06 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ------------------------------------------------------------------ */
/*  Section Card                                                       */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#d4a853]/10">
          <Icon className="size-4.5 text-[#d4a853]" />
        </div>
        <h3 className="text-base font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function AdminSettings() {
  const { user, setUser, restaurant, setRestaurant, setView, personalityMode, setPersonalityMode } = useStore();
  const { toast } = useToast();

  const [editName, setEditName] = useState(user?.name || '');
  const [restName, setRestName] = useState(restaurant.name);
  const [restDesc, setRestDesc] = useState(restaurant.description);
  const [restTheme, setRestTheme] = useState<Restaurant['theme']>(restaurant.theme);
  const [restCurrency, setRestCurrency] = useState(restaurant.currency);

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name: editName });
      toast({ title: 'تم حفظ التعديلات', description: 'تم تحديث بياناتك بنجاح' });
    }
  };

  const handleSaveRestaurant = () => {
    setRestaurant({
      ...restaurant,
      name: restName,
      description: restDesc,
      theme: restTheme,
      currency: restCurrency,
    });
    toast({ title: 'تم الحفظ', description: 'تم تحديث بيانات المطعم' });
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    toast({ title: 'تم تسجيل الخروج', description: 'تم تسجيل خروجك بنجاح' });
  };

  const handleSavePersonality = (mode: PersonalityMode) => {
    setPersonalityMode(mode);
    const personality = getAllPersonalities().find(p => p.mode === mode);
    toast({
      title: 'تم تغيير الشخصية',
      description: `الآن النادل الذكي هو "${personality?.name || mode}"`,
    });
  };

  const initials = (editName || 'م').charAt(0);

  return (
    <div dir="rtl" className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      {/* ===================== TOP BAR ===================== */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView('dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-xl font-bold sm:text-2xl">الإعدادات</h1>
        </div>
      </motion.div>

      {/* ===================== TWO COLUMNS ===================== */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* ---- Right column (in RTL = Profile) ---- */}
        <motion.div variants={fadeUp} custom={0} className="lg:col-span-4">
          <SectionCard title="الملف الشخصي" icon={ChefHat}>
            {/* Avatar */}
            <div className="mb-5 flex flex-col items-center">
              <div className="relative group">
                <div className="flex size-24 items-center justify-center rounded-full gold-gradient text-3xl font-black text-[#0a0a0f]">
                  {initials}
                </div>
                <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="size-6 text-white" />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  رقم الجوال
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{user?.phone || '+966501234567'}</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  البريد الإلكتروني
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-sm text-foreground" dir="ltr">
                    {user?.email || 'demo@menuai.sa'}
                  </span>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  الدور
                </label>
                <Badge className="bg-[#d4a853]/15 text-[#d4a853] border-[#d4a853]/30 px-3 py-1 text-xs">
                  <Crown className="size-3" />
                  {roleLabels[user?.role || 'owner']}
                </Badge>
              </div>
            </div>

            {/* Save button */}
            <Button
              onClick={handleSaveProfile}
              className="mt-5 w-full gold-gradient text-sm font-semibold hover:opacity-90"
            >
              <Save className="size-4" />
              حفظ التعديلات
            </Button>
          </SectionCard>
        </motion.div>

        {/* ---- Left column (in RTL = Settings sections) ---- */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* ---- Restaurant Info ---- */}
          <motion.div variants={fadeUp} custom={1}>
            <SectionCard title="معلومات المطعم" icon={ChefHat}>
              <div className="space-y-4">
                {/* Restaurant name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    اسم المطعم
                  </label>
                  <Input
                    value={restName}
                    onChange={(e) => setRestName(e.target.value)}
                    className="h-10 bg-background/60 text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    الوصف
                  </label>
                  <Textarea
                    value={restDesc}
                    onChange={(e) => setRestDesc(e.target.value)}
                    className="min-h-20 bg-background/60 text-sm"
                    placeholder="نصف قصير عن مطعمك..."
                  />
                </div>

                {/* Theme */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    سمة التصميم
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((t) => {
                      const isActive = restTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setRestTheme(t.id)}
                          className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                            isActive
                              ? 'border-[#d4a853]/60 bg-[#d4a853]/5'
                              : 'border-border bg-background/40 hover:border-border/80'
                          }`}
                        >
                          <div className="flex gap-1.5">
                            {t.preview.map((c, i) => (
                              <div key={i} className={`size-4 rounded-full ${c}`} />
                            ))}
                          </div>
                          <span
                            className={`text-xs font-semibold ${isActive ? 'text-[#d4a853]' : 'text-foreground'}`}
                          >
                            {t.name}
                          </span>
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
                </div>

                {/* Currency */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    العملة
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => setRestCurrency(c)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                          restCurrency === c
                            ? 'border-[#d4a853]/60 bg-[#d4a853]/10 text-[#d4a853]'
                            : 'border-border bg-background/40 text-muted-foreground hover:border-[#d4a853]/30'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveRestaurant}
                className="mt-5 gold-gradient text-sm font-semibold hover:opacity-90"
              >
                <Save className="size-4" />
                حفظ
              </Button>
            </SectionCard>
          </motion.div>

          {/* ---- Voice Personality (AI Waiter) ---- */}
          <motion.div variants={fadeUp} custom={2}>
            <SectionCard title="شخصية النادل الذكي" icon={Mic}>
              <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
                اختر نبرة وأسلوب النادل الذكي عند التحدث مع العملاء. كل شخصية لها طريقة مختلفة في التوصية والبيع.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {getAllPersonalities().map((p: BrandVoice) => {
                  const isActive = personalityMode === p.mode;
                  return (
                    <button
                      key={p.mode}
                      onClick={() => handleSavePersonality(p.mode)}
                      className={`relative flex items-start gap-3 rounded-xl border p-4 text-start transition-all ${
                        isActive
                          ? 'border-[#d4a853]/60 bg-[#d4a853]/5'
                          : 'border-border bg-background/40 hover:border-border/80'
                      }`}
                    >
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? 'gold-gradient' : 'bg-white/5'
                      }`}>
                        <MessageCircle className={`size-5 ${isActive ? 'text-[#0a0a0f]' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-foreground">{p.name}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${
                            isActive
                              ? 'bg-[#d4a853]/20 text-[#d4a853] border-[#d4a853]/30'
                              : 'bg-white/5 text-muted-foreground border-white/10'
                          }`}>
                            {p.tone}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {p.greeting}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.catchphrases.slice(0, 3).map((cp, i) => (
                            <span key={i} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                              {cp}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <Zap className="size-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            أسلوب البيع: {{ gentle: 'لطيف', direct: 'مباشر', storytelling: 'سرد قصصي', social_proof: 'إثبات اجتماعي' }[p.upsellStyle]}
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
          </motion.div>

          {/* ---- Team ---- */}
          <motion.div variants={fadeUp} custom={3}>
            <SectionCard title="الفريق" icon={UserPlus}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">أعضاء الفريق</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background/30 p-3"
                  >
                    {/* Avatar */}
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d4a853]/10 text-sm font-bold text-[#d4a853]">
                      {member.name.charAt(0)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
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
                      <p className="mt-0.5 text-[11px] text-muted-foreground truncate" dir="ltr">
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-4 w-full border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
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
          </motion.div>

          {/* ---- Security ---- */}
          <motion.div variants={fadeUp} custom={4}>
            <SectionCard title="الأمان" icon={Shield}>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-[#d4a853]/10 hover:text-foreground"
                >
                  <Phone className="size-4 text-muted-foreground ml-2" />
                  تغيير رقم الجوال
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-foreground hover:bg-[#d4a853]/10 hover:text-foreground"
                >
                  <Mail className="size-4 text-muted-foreground ml-2" />
                  تغيير البريد الإلكتروني
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start mt-2"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </div>
            </SectionCard>
          </motion.div>

          {/* ---- Subscription ---- */}
          <motion.div variants={fadeUp} custom={5}>
            <SectionCard title="الاشتراك" icon={Crown}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#d4a853]/10">
                  <Crown className="size-5 text-[#d4a853]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">الخطة المجانية</p>
                  <p className="text-[11px] text-muted-foreground">الخطة الحالية</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-5">
                {planFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-[#d4a853]/70" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full gold-gradient text-sm font-semibold hover:opacity-90">
                <Crown className="size-4" />
                ترقية للخطة الاحترافية
              </Button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                15 يوم تجربة مجانية
              </p>
            </SectionCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}