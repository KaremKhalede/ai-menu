'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  ChefHat,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Salad,
  CupSoda,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/lib/store';
import type { Restaurant } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const restaurantTypes = [
  {
    id: 'cafe',
    emoji: '☕',
    icon: Coffee,
    name: 'كافيه / قهوة',
    desc: 'قهوة مختصة، مشروبات ساخنة وباردة',
  },
  {
    id: 'fine-dining',
    emoji: '🍽️',
    icon: UtensilsCrossed,
    name: 'مطعم فاخر',
    desc: 'تجربة طعام راقية بأجواء فاخرة',
  },
  {
    id: 'fast-food',
    emoji: '🥙',
    icon: ChefHat,
    name: 'مطعم سريع',
    desc: 'وجبات سريعة وتوصيل فوري',
  },
  {
    id: 'bakery',
    emoji: '🍰',
    icon: Cookie,
    name: 'حلويات / مخبز',
    desc: 'معجنات، كيك، وحلويات شرقية وغربية',
  },
  {
    id: 'healthy',
    emoji: '🥗',
    icon: Salad,
    name: 'صحي / سلطات',
    desc: 'وجبات صحية وسلطات طازجة',
  },
  {
    id: 'juice',
    emoji: '🧃',
    icon: CupSoda,
    name: 'عصائر / سموذي',
    desc: 'عصائر طبيعية وسموذي طازج',
  },
];

const themes = [
  {
    id: 'luxury' as const,
    name: 'فاخر',
    accent: '#d4a853',
    accentLight: 'rgba(212,168,83,0.15)',
    preview: ['bg-[#d4a853]', 'bg-[#e8c47c]', 'bg-[#c9956b]', 'bg-[#f0ece4]'],
  },
  {
    id: 'modern' as const,
    name: 'عصري',
    accent: '#2dd4bf',
    accentLight: 'rgba(45,212,191,0.15)',
    preview: ['bg-teal-400', 'bg-teal-300', 'bg-emerald-400', 'bg-cyan-400'],
  },
  {
    id: 'warm' as const,
    name: 'دافئ',
    accent: '#f97316',
    accentLight: 'rgba(249,115,22,0.15)',
    preview: ['bg-orange-500', 'bg-amber-500', 'bg-orange-400', 'bg-yellow-500'],
  },
];

const currencies = ['ر.س', 'د.إ', 'د.ك', 'ر.ع', 'ر.ق', 'د.ج'];

const aiGeneratedDishes = [
  { name: 'لاتيه كراميل', price: '22 ر.س', category: 'مشروبات' },
  { name: 'بان كيك بالشوكولاتة', price: '34 ر.س', category: 'إفطار' },
  { name: 'سندويش دجاج أفاتو', price: '28 ر.س', category: 'وجبات' },
  { name: 'تشيز كيك توت', price: '26 ر.س', category: 'حلويات' },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const bounceIn = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 14, delay: 0.15 },
  },
};

/* ------------------------------------------------------------------ */
/*  Progress bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ step }: { step: number }) {
  const labels = ['نوع المطعم', 'معلومات المطعم', 'قائمة AI', 'الانطلاق'];
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>الخطوة {step} من 4</span>
        <span>{labels[step - 1]}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
        <motion.div
          className="h-full rounded-full gold-gradient"
          initial={{ width: '25%' }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: Restaurant Type                                            */
/* ------------------------------------------------------------------ */

function StepType({
  selected,
  onSelect,
  onNext,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit">
      <h2 className="text-2xl font-bold sm:text-3xl">ما نوع مطعمك؟</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        اختر النوع الأقرب لمطعمك لنتخصّص لك
      </p>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-2 gap-3 sm:gap-4"
      >
        {restaurantTypes.map((type) => {
          const isSelected = selected === type.id;
          return (
            <motion.button
              key={type.id}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(type.id)}
              className={`relative flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all sm:p-5 ${
                isSelected
                  ? 'glass-card border-[#d4a853]/60 shadow-lg shadow-[#d4a853]/10'
                  : 'border border-border bg-background/40 hover:border-[#d4a853]/20'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="type-glow"
                  className="absolute inset-0 rounded-xl bg-[#d4a853]/5"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative text-3xl sm:text-4xl">{type.emoji}</span>
              <span className="relative text-sm font-semibold sm:text-base">{type.name}</span>
              <span className="relative text-[11px] text-muted-foreground leading-relaxed">
                {type.desc}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-8">
        <Button
          onClick={onNext}
          disabled={!selected}
          className="w-full gold-gradient text-base font-semibold hover:opacity-90"
          size="lg"
        >
          التالي
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Restaurant Name & Theme                                    */
/* ------------------------------------------------------------------ */

function StepInfo({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: Restaurant;
  onChange: (r: Partial<Restaurant>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit">
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        → <span>رجوع</span>
      </button>

      <h2 className="text-2xl font-bold sm:text-3xl">أخبرنا عن مطعمك</h2>

      <div className="mt-6 space-y-5">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            اسم المطعم <span className="text-destructive">*</span>
          </label>
          <Input
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="مثال: مقهى السعادة"
            className="h-11 bg-background/60 text-base"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            وصف مختصر (اختياري)
          </label>
          <Textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="نصف قصير عن مطعمك..."
            className="min-h-20 bg-background/60 text-sm"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">سمة التصميم</label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const isActive = data.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChange({ theme: t.id })}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                    isActive
                      ? 'border-[#d4a853]/60 bg-[#d4a853]/5'
                      : 'border-border bg-background/40 hover:border-border/80'
                  }`}
                >
                  {/* Color preview dots */}
                  <div className="flex gap-1.5">
                    {t.preview.map((c, i) => (
                      <div key={i} className={`size-4 rounded-full ${c}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? 'text-[#d4a853]' : 'text-foreground'}`}>
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
          <label className="mb-1.5 block text-sm font-medium text-foreground">العملة</label>
          <div className="flex gap-2 flex-wrap">
            {currencies.map((c) => (
              <button
                key={c}
                onClick={() => onChange({ currency: c })}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  data.currency === c
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

      <div className="mt-8">
        <Button
          onClick={onNext}
          disabled={!data.name.trim()}
          className="w-full gold-gradient text-base font-semibold hover:opacity-90"
          size="lg"
        >
          التالي
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: AI Menu Generation                                         */
/* ------------------------------------------------------------------ */

function StepAI({
  type,
  acceptAI,
  setAcceptAI,
  onNext,
  onBack,
}: {
  type: string;
  acceptAI: boolean;
  setAcceptAI: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (generated) {
      onNext();
      return;
    }
    if (!acceptAI) {
      onNext();
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <motion.div variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit">
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        → <span>رجوع</span>
      </button>

      <div className="text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#d4a853]/10"
        >
          <Sparkles className="size-8 text-[#d4a853]" />
        </motion.div>
        <h2 className="text-2xl font-bold sm:text-3xl">
          ✨ هل تريد أن يولد AI قائمتك؟
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          يمكن لذكاء الاصطناعي إنشاء قائمة طعام كاملة بناءً على نوع مطعمك
        </p>
      </div>

      {/* Options */}
      {!generating && !generated && (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-col gap-3"
        >
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setAcceptAI(true)}
            className={`flex items-center gap-3 rounded-xl p-4 text-right transition-all ${
              acceptAI
                ? 'gold-gradient shadow-lg shadow-[#d4a853]/15'
                : 'border border-border bg-background/40 hover:border-[#d4a853]/30'
            }`}
          >
            <Sparkles
              className={`size-5 ${acceptAI ? 'text-[#0a0a0f]' : 'text-[#d4a853]'}`}
            />
            <div>
              <span
                className={`text-base font-semibold ${acceptAI ? 'text-[#0a0a0f]' : 'text-foreground'}`}
              >
                نعم، أنشئ قائمة ذكية
              </span>
              <p
                className={`mt-0.5 text-xs ${acceptAI ? 'text-[#0a0a0f]/60' : 'text-muted-foreground'}`}
              >
                قائمة كاملة جاهزة خلال ثوانٍ
              </p>
            </div>
          </motion.button>

          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setAcceptAI(false)}
            className={`flex items-center gap-3 rounded-xl p-4 text-right transition-all ${
              !acceptAI
                ? 'border-2 border-[#d4a853]/50 bg-[#d4a853]/5'
                : 'border border-border bg-background/40 hover:border-[#d4a853]/30'
            }`}
          >
            <UtensilsCrossed className="size-5 text-muted-foreground" />
            <div>
              <span className="text-base font-semibold text-foreground">
                لا، سأضيف الأطباق بنفسي
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                تحكم كامل في إضافة الأطباق يدوياً
              </p>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Generating animation */}
      {generating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="size-12 text-[#d4a853]" />
          </motion.div>
          <p className="mt-4 text-sm font-semibold text-foreground">
            جارٍ توليد القائمة...
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            AI يحلل نوع مطعمك ويقترح أفضل الأطباق
          </p>
        </motion.div>
      )}

      {/* Generated preview */}
      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[#d4a853]" />
            <span className="text-sm font-semibold text-foreground">
              تم توليد {aiGeneratedDishes.length} أطباق
            </span>
          </div>
          <div className="space-y-2">
            {aiGeneratedDishes.map((dish, i) => (
              <motion.div
                key={dish.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card flex items-center justify-between p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{dish.name}</p>
                  <p className="text-[11px] text-muted-foreground">{dish.category}</p>
                </div>
                <span className="text-sm font-bold text-[#d4a853]">{dish.price}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            يمكنك تعديل أو إضافة المزيد من الأطباق لاحقاً
          </p>
        </motion.div>
      )}

      {/* Action button */}
      {!generating && (
        <div className="mt-8">
          <Button
            onClick={handleGenerate}
            disabled={false}
            className="w-full gold-gradient text-base font-semibold hover:opacity-90"
            size="lg"
          >
            {generated ? 'إنهاء الإعداد' : acceptAI ? 'توليد القائمة الآن' : 'التالي'}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4: Success / Welcome                                          */
/* ------------------------------------------------------------------ */

function StepSuccess({ onGoMenu, onGoDashboard }: { onGoMenu: () => void; onGoDashboard: () => void }) {
  return (
    <motion.div
      variants={slideVariants}
      custom={1}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center text-center py-4"
    >
      <motion.div
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        className="mb-6 flex size-24 items-center justify-center rounded-full bg-[#d4a853]/10"
      >
        <CheckCircle2 className="size-14 text-[#d4a853]" />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-2xl font-bold sm:text-3xl"
      >
        مرحباً بك في MenuAI! 🎉
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-3 max-w-sm text-sm text-muted-foreground"
      >
        تم إعداد مطعمك بنجاح. جاهز لبدء استقبال الطلبات!
      </motion.p>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mt-10 w-full flex flex-col gap-3"
      >
        <motion.div variants={fadeUp}>
          <Button
            onClick={onGoMenu}
            className="w-full gold-gradient text-base font-semibold hover:opacity-90"
            size="lg"
          >
            <Sparkles className="size-4" />
            افتح المنيو الذكي
          </Button>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Button
            onClick={onGoDashboard}
            variant="outline"
            className="w-full border-[#d4a853]/30 text-foreground hover:bg-[#d4a853]/10 hover:text-foreground"
            size="lg"
          >
            لوحة التحكم
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Onboarding() {
  const { setView, setRestaurant, restaurant } = useStore();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(restaurant.type || '');
  const [acceptAI, setAcceptAI] = useState(true);
  const [localRest, setLocalRest] = useState<Restaurant>(restaurant);

  // Keyboard shortcut: Enter to go next
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (step === 1 && selectedType) setStep(2);
        else if (step === 2 && localRest.name.trim()) setStep(3);
        else if (step === 3) {
          // handled by button
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, selectedType, localRest.name]);

  const handleFinish = () => {
    const finalRestaurant: Restaurant = {
      ...localRest,
      type: selectedType,
    };
    setRestaurant(finalRestaurant);
    setView('dashboard');
  };

  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-[#d4a853]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#d4a853]/8 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #d4a853 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-card p-6 sm:p-8">
          <ProgressBar step={step} />

          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <StepType
                key="step1"
                selected={selectedType}
                onSelect={setSelectedType}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <StepInfo
                key="step2"
                data={localRest}
                onChange={(partial) =>
                  setLocalRest((prev) => ({ ...prev, ...partial }))
                }
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepAI
                key="step3"
                type={selectedType}
                acceptAI={acceptAI}
                setAcceptAI={setAcceptAI}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <StepSuccess
                key="step4"
                onGoMenu={handleFinish}
                onGoDashboard={handleFinish}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}