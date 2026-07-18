'use client';

import { useStore } from '@/lib/store';
import {
  Sparkles,
  Bot,
  BarChart3,
  Mic,
  UtensilsCrossed,
  ArrowLeft,
  Star,
  Zap,
  Shield,
  Globe,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Bot,
    title: 'نادل AI ذكي',
    desc: 'نادل افتراضي يشرح الأطباق ويقترح إضافات بطريقة ذكية',
  },
  {
    icon: Sparkles,
    title: 'منيو شخصي',
    desc: 'كل عميل يرى منيو مخصص حسب ذوقه وتفضيلاته',
  },
  {
    icon: BarChart3,
    title: 'تحليلات ذكية',
    desc: 'تحليل عميق للمبيعات والعملاء مع اقتراحات AI',
  },
  {
    icon: Mic,
    title: 'طلب بالصوت',
    desc: 'تحدث مع النادل الذكي واطلب بالصوت مباشرة',
  },
  {
    icon: Zap,
    title: 'ترقية ذكية',
    desc: 'اقتراحات Upselling تزيد قيمة الطلب تلقائياً',
  },
  {
    icon: Shield,
    title: 'تكامل كامل',
    desc: 'ربط مع أنظمة POS وأدوات الإدارة',
  },
];

const steps = [
  {
    num: '١',
    icon: UtensilsCrossed,
    title: 'ارفع قائمتك',
    desc: 'أضف أطباقك وصورك وسيقوم AI بتحسين الوصفاف تلقائياً',
  },
  {
    num: '٢',
    icon: Globe,
    title: 'شارك QR كود',
    desc: 'كل طاولة تحصل على QR فريد يفتح المنيو الذكي',
  },
  {
    num: '٣',
    icon: BarChart3,
    title: 'راقب المبيعات',
    desc: 'تابع أداء مطعمك بالتحليلات الذكية واقتراحات AI',
  },
];

const stats = [
  { value: 'أكثر من 500 مطعم', icon: UtensilsCrossed },
  { value: 'زيادة 40% في المبيعات', icon: BarChart3 },
  { value: 'تقييم 4.9/5', icon: Star },
];

const demoDishes = [
  { name: 'مشاوي مشكّلة', price: '85 ر.س', popular: true },
  { name: 'كبسة لحم', price: '65 ر.س', popular: false },
  { name: 'فتة حمص', price: '32 ر.س', popular: false },
  { name: 'كنافة نابلسية', price: '28 ر.س', popular: true },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const setView = useStore((s) => s.setView);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ===================== NAVIGATION ===================== */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 glass-card !rounded-none border-x-0 border-t-0 px-4 py-3 md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo — right side in RTL */}
          <span className="text-2xl font-bold gold-gradient-text select-none">
            MenuAI
          </span>

          {/* Links — left side in RTL */}
          <div className="hidden items-center gap-6 md:flex">
            <button
              onClick={() =>
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              المميزات
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              لوحة التحكم
            </button>
            <button
              onClick={() => setView('menu-editor')}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              محرر المنيو
            </button>
          </div>

          <Button
            onClick={() => setView('menu')}
            className="gold-gradient text-sm font-semibold hover:opacity-90"
          >
            ابدأ الآن
          </Button>
        </div>
      </motion.nav>

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Decorative floating gold blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-[#d4a853]/10 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-[#d4a853]/8 blur-[80px]" />
          <div className="absolute top-1/2 left-10 h-40 w-40 rounded-full bg-[#d4a853]/5 blur-[64px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            <span className="gold-gradient-text">
              حوّل منيو مطعمك
            </span>
            <br />
            <span className="text-foreground">إلى آلة بيع ذكية</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            نظام ذكاء اصطناعي يبيع، يقترح، يحلل، ويحسّن قائمتك تلقائياً
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => setView('menu')}
              className="gold-gradient px-8 text-base font-semibold hover:opacity-90"
            >
              جرّب المنيو الذكي
              <Sparkles className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setView('dashboard')}
              className="border-[#d4a853]/30 text-foreground hover:bg-[#d4a853]/10 hover:text-foreground"
            >
              لوحة التحكم
              <ArrowLeft className="size-4" />
            </Button>
          </motion.div>

          {/* Animated stats row */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10 md:gap-16"
          >
            {stats.map((s) => (
              <motion.div
                key={s.value}
                variants={fadeUp}
                className="flex items-center gap-2 text-sm text-muted-foreground md:text-base"
              >
                <s.icon className="size-5 text-[#d4a853]" />
                <span>{s.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="features" className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold md:text-5xl">
              مميزات <span className="gold-gradient-text">خرافية</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              أدوات ذكية مصممة خصيصاً لتعزيز تجربة عملائك وزيادة مبيعاتك
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="glass-card group p-6 transition-colors hover:border-[#d4a853]/25"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#d4a853]/10 transition-colors group-hover:bg-[#d4a853]/20">
                  <f.icon className="size-6 text-[#d4a853]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold md:text-5xl">
              كيف يعمل <span className="gold-gradient-text">النظام؟</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex flex-col gap-10 md:flex-row md:gap-0"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                className="flex flex-1 flex-col items-center text-center"
              >
                {/* Connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block">
                    <div className="absolute mt-7 h-px w-full bg-gradient-to-l from-[#d4a853]/30 to-transparent" />
                  </div>
                )}

                {/* Step number circle */}
                <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-full gold-gradient text-lg font-bold text-background">
                  {s.num}
                </div>

                {/* Icon */}
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#d4a853]/10">
                  <s.icon className="size-5 text-[#d4a853]" />
                </div>

                <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
                <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== DEMO PREVIEW ===================== */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              شاهد النظام <span className="gold-gradient-text">في العمل</span>
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-muted-foreground">
              واجهة أنيقة تعمل على أي جهاز — جرّبها الآن
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mx-auto flex flex-col items-center"
          >
            {/* Phone frame */}
            <div className="relative w-[280px] rounded-[2.5rem] border border-[#d4a853]/15 bg-[#0e0e16] p-2 shadow-2xl shadow-[#d4a853]/5 sm:w-[300px]">
              {/* Notch */}
              <div className="mx-auto mb-2 h-6 w-28 rounded-full bg-background" />

              {/* Screen */}
              <div className="rounded-[2rem] bg-background px-4 pb-5 pt-3">
                {/* Mini header */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">القائمة</span>
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#d4a853]/10">
                    <Bot className="size-3.5 text-[#d4a853]" />
                  </div>
                </div>

                {/* Mini dish cards */}
                <div className="flex flex-col gap-2.5">
                  {demoDishes.map((dish) => (
                    <div
                      key={dish.name}
                      className="glass-card flex items-center justify-between p-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Placeholder food image */}
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[#d4a853]/10">
                          <UtensilsCrossed className="size-4 text-[#d4a853]/60" />
                        </div>
                        <div className="text-start">
                          <p className="text-xs font-medium leading-tight">{dish.name}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{dish.price}</p>
                        </div>
                      </div>
                      {dish.popular && (
                        <span className="rounded-full bg-[#d4a853]/15 px-2 py-0.5 text-[10px] font-medium text-[#d4a853]">
                          الأكثر طلباً
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              onClick={() => setView('menu')}
              className="gold-gradient mt-10 px-8 text-base font-semibold hover:opacity-90"
            >
              جرّب بنفسك
              <ChevronLeft className="size-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl"
        >
          <div className="gold-gradient px-6 py-14 text-center md:px-12 md:py-20">
            <h2 className="text-2xl font-bold text-background md:text-4xl">
              ابدأ رحلتك الآن مجاناً
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-background/70 md:text-base">
              انضم إلى مئات المطاعم التي تستخدم MenuAI لزيادة مبيعاتها
            </p>
            <Button
              size="lg"
              onClick={() => setView('menu')}
              className="mt-8 bg-background px-8 text-base font-semibold text-[#d4a853] hover:bg-background/90"
            >
              ابدأ مجاناً
              <Sparkles className="size-4" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span>MenuAI © 2025 - جميع الحقوق محفوظة</span>
          <div className="flex items-center gap-6">
            <button className="transition-colors hover:text-foreground">سياسة الخصوصية</button>
            <button className="transition-colors hover:text-foreground">شروط الاستخدام</button>
          </div>
        </div>
      </footer>
    </div>
  );
}