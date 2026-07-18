'use client';

import { useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import {
  Upload,
  Brain,
  TrendingUp,
  Mic,
  Bot,
  Volume2,
  BarChart3,
  Star,
  Sparkles,
  Zap,
  Eye,
  MessageSquare,
  ChevronLeft,
  ArrowLeft,
  Play,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  QrCode,
  CreditCard,
  Users,
  Clock,
  Target,
  Quote,
} from 'lucide-react';

/* ============================================================
   CountUp component for Section 5
   ============================================================ */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    if (suffix === 'x') return `${Math.round(v)}x`;
    return `${Math.round(v)}${suffix}`;
  });
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) animate(count, target, { duration: 2, ease: 'easeOut' });
  }, [inView, count, target]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

/* ============================================================
   SECTION 1: How It Works
   ============================================================ */
const steps = [
  {
    icon: Upload,
    num: '٠١',
    title: 'أنشئ قائمتك',
    desc: 'أضف أصنافك أو ولّد قائمة كاملة بالذكاء الاصطناعي في ثوانٍ.',
  },
  {
    icon: Brain,
    num: '٠٢',
    title: 'فعّل النادل الذكي',
    desc: 'ذكاؤنا يتعلم قائمتك ويبدأ بتوجيه الزبائن فوراً.',
  },
  {
    icon: TrendingUp,
    num: '٠٣',
    title: 'زد مبيعاتك',
    desc: 'توصيات ذكية وبيع إضافي يرفع إيراداتك تلقائياً.',
  },
];

export function HowItWorks() {
  return (
    <motion.section
      className="py-24 relative z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Warm glow */}
      <div className="warm-glow w-[500px] h-[500px] bg-[#C9A46C] top-0 left-1/2 -translate-x-1/2" />

      <div className="text-center">
        {/* Badge */}
        <div className="glass-pill inline-flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#C9A46C]" />
          <span className="text-sm text-[#F5F0E8]/70">ثلاث خطوات بسيطة</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
          من منيو لآلة تبيع
        </h2>
        <p className="text-[#F5F0E8]/50 mt-4 max-w-lg mx-auto px-6">
          ابدأ في دقائق. دع الذكاء الاصطناعي يبني الباقي.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-14 px-6 relative">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              className="glass rounded-2xl p-8 text-center card-glow relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              {/* Icon container */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A46C]/20 to-[#7A1C1C]/20 flex items-center justify-center mx-auto">
                <Icon className="w-7 h-7 text-[#C9A46C]" />
              </div>

              {/* Step number */}
              <span className="gold-text text-sm font-bold mt-3 block">{step.num}</span>

              {/* Title */}
              <h3 className="text-lg font-bold mt-4 text-[#F5F0E8]">{step.title}</h3>

              {/* Description */}
              <p className="text-sm text-[#F5F0E8]/50 mt-2 leading-relaxed">
                {step.desc}
              </p>

              {/* Connector line — only between cards on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -left-3 w-6 h-[2px]">
                  <div className="w-full h-full bg-gradient-to-l from-[#C9A46C]/50 to-transparent" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C9A46C]/60" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ============================================================
   SECTION 2: AI Voice Demo
   ============================================================ */
const voiceFeatures = [
  'يفهم ذوق الزبون ويوصي بأفضل أصناف',
  'يرفع قيمة الطلب ببيع إضافي ذكي',
  'متوفر ٢٤/٧ بدون تعب أو إجازات',
  'يتعلم ويتحسّن مع كل طلب',
];

export function AIVoiceDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={containerRef}
      className="py-24 relative z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Warm glow */}
      <div className="warm-glow w-[600px] h-[400px] bg-[#7A1C1C] top-20 right-0" />
      <div className="warm-glow w-[400px] h-[400px] bg-[#C9A46C] bottom-0 left-10" />

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto px-6">
        {/* Left: Voice UI simulation */}
        <div className="lg:w-1/2 w-full">
          <motion.div
            className="glass-strong rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* AI Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A46C] to-[#7A1C1C] flex items-center justify-center avatar-pulse mb-4">
              <Bot className="text-3xl text-white" />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C9A46C] status-blink" />
              <span className="text-[#C9A46C] text-sm font-medium">
                {inView ? 'يستمع...' : ''}
              </span>
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-[3px] h-8 mb-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="voice-bar"
                  style={{ animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>

            {/* Chat Bubbles */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {/* Customer bubble */}
              <AnimatePresence>
                {inView && (
                  <motion.div
                    className="glass rounded-2xl rounded-br-sm self-end max-w-[80%] px-4 py-3"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <p className="text-sm text-[#F5F0E8]/80">وش تنصحني؟</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI bubble */}
              <AnimatePresence>
                {inView && (
                  <motion.div
                    className="bg-[#C9A46C]/10 border border-[#C9A46C]/20 rounded-2xl rounded-bl-sm self-start max-w-[85%] px-4 py-3"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    <p className="text-sm text-[#F5F0E8]/70 leading-relaxed">
                      إذا تبي شي خفيف، أنصحك بسلطة الدجاج المشوي 🥗
                      <br />
                      تقدر تضيف عصير طازج عشان تكون وجبة كاملة.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <motion.button
              className="glass-pill mt-8 inline-flex items-center gap-2 cursor-pointer hover:border-[#C9A46C]/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, duration: 0.4 }}
            >
              <Mic className="w-4 h-4 text-[#C9A46C]" />
              <span className="text-sm text-[#F5F0E8]/70">جرب تجربة الصوت</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Right: Feature text */}
        <div className="lg:w-1/2 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="glass-pill inline-flex items-center gap-2 mb-6">
              <Mic className="w-4 h-4 text-[#C9A46C]" />
              <span className="text-sm text-[#F5F0E8]/70">الميزة الأساسية</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F0E8] leading-tight">
              نادل الذكاء الاصطناعي
              <br />
              اللي فعلاً يبيع
            </h2>

            {/* Feature list */}
            <div className="mt-8 space-y-4">
              {voiceFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-[#C9A46C]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#C9A46C]" />
                    </div>
                  </div>
                  <span className="text-[#F5F0E8]/70 leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ============================================================
   SECTION 3: Smart Menu Experience
   ============================================================ */
const menuFeatures = [
  {
    icon: Zap,
    title: 'توصيات مخصصة',
    desc: 'الذكاء الاصطناعي يقترح أصناف بناءً على ذوق الزبون وسجل طلباته.',
  },
  {
    icon: Star,
    title: 'تصنيفات ذكية',
    desc: '🔥 الأكثر طلباً و ✨ اختيار الشيف تظهر تلقائياً لزيادة المبيعات.',
  },
  {
    icon: Eye,
    title: 'ترتيب ديناميكي',
    desc: 'الأصناف الأكثر ربحية تظهر أولاً لتعظيم الإيرادات.',
  },
  {
    icon: TrendingUp,
    title: 'بيع إضافي ذكي',
    desc: 'عروض مثل "أضف مشروب" تزيد قيمة الطلب تلقائياً.',
  },
];

export function SmartMenuExperience() {
  return (
    <motion.section
      className="py-24 relative z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Warm glow */}
      <div className="warm-glow w-[500px] h-[500px] bg-[#C9A46C] top-1/3 left-1/2 -translate-x-1/2" />

      {/* Centered text */}
      <div className="text-center">
        <div className="glass-pill inline-flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#C9A46C]" />
          <span className="text-sm text-[#F5F0E8]/70">تجربة تفاعلية</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
          منيو يتكيف مع كل زبون
        </h2>
        <p className="text-[#F5F0E8]/50 mt-4 max-w-md mx-auto px-6">
          كل زبون يشوف قائمة مصممة خصيصاً له
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mt-14 px-6">
        {menuFeatures.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6 card-glow"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              {/* Gold circle icon */}
              <div className="w-12 h-12 rounded-full bg-[#C9A46C]/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#C9A46C]" />
              </div>

              <h3 className="font-bold mt-4 text-[#F5F0E8]">{feat.title}</h3>
              <p className="text-sm text-[#F5F0E8]/50 mt-2 leading-relaxed">{feat.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ============================================================
   SECTION 4: AI Analytics Dashboard
   ============================================================ */
const dashBullets = [
  { icon: BarChart3, text: 'تتبع الإيرادات لحظياً' },
  { icon: Target, text: 'اعرف الأصناف الأكثر ربحية' },
  { icon: Users, text: 'سلوك الزبائن وتفضيلاتهم' },
  { icon: Clock, text: 'أوقات الذروة وساعات الهدوء' },
];

const barHeights = [40, 65, 50, 80, 55, 90, 70];
const barDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const kpis = [
  { label: 'إيرادات اليوم', value: '٢,٤٣٠ ر.س', isGold: true },
  { label: 'طلبات اليوم', value: '٦٧', isGold: false },
  { label: 'متوسط الطلب', value: '٣٦ ر.س', isGold: false },
  { label: 'معدل التحويل', value: '٧٨٪', isGold: false },
];

function BarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="flex items-end justify-between gap-2 h-32 mt-5 px-1">
      {barHeights.map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <motion.div
            className="w-full rounded-t-lg bg-gradient-to-t from-[#C9A46C] to-[#C9A46C]/30"
            initial={{ height: 0 }}
            animate={inView ? { height: `${h}%` } : { height: 0 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
          />
          <span className="text-[10px] text-[#F5F0E8]/40">{barDays[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function AIDashboard() {
  return (
    <motion.section
      className="py-24 relative z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Warm glow */}
      <div className="warm-glow w-[500px] h-[500px] bg-[#7A1C1C] bottom-0 right-0" />

      <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto px-6">
        {/* Left: Text content */}
        <div className="lg:w-1/2 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="glass-pill inline-flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-[#C9A46C]" />
              <span className="text-sm text-[#F5F0E8]/70">تحليلات ذكية</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
              اعرف وش يبيع. حسّن كل شي.
            </h2>
            <p className="mt-4 text-[#F5F0E8]/50 leading-relaxed max-w-md">
              لوحة تحكم ذكية تتابع كل شي لحظياً وتعطيك رؤى عملية تزيد أرباحك.
            </p>

            {/* AI Insight card */}
            <motion.div
              className="glass rounded-2xl p-5 mt-6 border-r-4 border-[#C9A46C]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Quote className="w-5 h-5 text-[#C9A46C] mb-2" />
              <p className="text-[#F5F0E8]/80 text-sm leading-relaxed">
                تغيير وصف هذا الصنف زاد الطلبات بنسبة ٢٣٪
              </p>
              <span className="text-xs text-[#F5F0E8]/40 mt-2 block">
                تحليل الذكاء الاصطناعي — اليوم
              </span>
            </motion.div>

            {/* Feature bullets */}
            <div className="mt-6 space-y-3">
              {dashBullets.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#C9A46C]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#C9A46C]" />
                    </div>
                    <span className="text-[#F5F0E8]/70 text-sm">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right: Mock dashboard */}
        <div className="lg:w-1/2 w-full">
          <motion.div
            className="glass-strong rounded-3xl p-6 relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Gold shimmer overlay */}
            <div className="absolute inset-0 gold-shimmer pointer-events-none rounded-3xl" />

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  className="glass rounded-xl p-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                >
                  <span className="text-xs text-[#F5F0E8]/40 block mb-1">{kpi.label}</span>
                  <span
                    className={`text-xl font-bold ${
                      kpi.isGold ? 'gold-text' : 'text-[#F5F0E8]'
                    }`}
                  >
                    {kpi.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="glass rounded-xl p-4 mt-3 relative z-10">
              <span className="text-xs text-[#F5F0E8]/40 block mb-1">الإيرادات الأسبوعية</span>
              <BarChart />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ============================================================
   SECTION 5: Results / Social Proof
   ============================================================ */
const stats = [
  { target: 32, suffix: '%', label: 'قيمة الطلب المتوسطة', prefix: '+' },
  { target: 21, suffix: '%', label: 'معدل التحويل', prefix: '+' },
  { target: 3, suffix: 'x', label: 'سرعة الطلب', prefix: '' },
  { target: 90, suffix: '%', label: 'تفاعل مع الذكاء', prefix: '' },
];

export function Results() {
  return (
    <motion.section
      className="py-24 relative z-10 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Warm glows */}
      <div className="warm-glow w-[600px] h-[400px] bg-[#C9A46C] top-0 left-1/4" />
      <div className="warm-glow w-[500px] h-[400px] bg-[#7A1C1C] bottom-0 right-1/4" />

      {/* Badge */}
      <div className="glass-pill inline-flex items-center gap-2 mb-6">
        <TrendingUp className="w-4 h-4 text-[#C9A46C]" />
        <span className="text-sm text-[#F5F0E8]/70">نتائج حقيقية</span>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
        نتائج حقيقية من مطاعم حقيقية
      </h2>
      <p className="text-[#F5F0E8]/50 mt-4">أرقام تتحدث عن نفسها</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-14 px-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="glass rounded-2xl p-8 text-center card-glow"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <div className="text-4xl sm:text-5xl font-bold gold-text">
              {stat.prefix}
              <CountUp target={stat.target} suffix={stat.suffix} />
            </div>
            <p className="text-sm text-[#F5F0E8]/50 mt-3">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}