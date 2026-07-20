'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

import {
  Menu,
  X,
  ShoppingCart,
  Mic,
  Star,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Play,
  Volume2,
  Bot,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  useServioStore,
  type Category,
  type MenuItem,
  type AIState,
  getBadge,
} from '@/lib/servio-store';
import {
  HowItWorks,
  AIVoiceDemo,
  SmartMenuExperience,
  AIDashboard,
  Results,
} from './servio-sections-a';
import {
  Pricing,
  AIPersonalization,
  Integration,
  FinalCTA,
  Footer,
} from './servio-sections-b';

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

const slideUp: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: '100%',
    transition: {
      duration: 0.35,
      ease: 'easeIn' as const,
    },
  },
};

// ─── 1. Particles ─────────────────────────────────────────────────────────────

function Particles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${((i * 37 + 13) % 100)}%`,
        size: 1 + ((i * 7 + 3) % 20) / 10,
        duration: 8 + ((i * 11 + 5) % 120) / 10,
        delay: ((i * 17 + 2) % 100) / 10,
        opacity: 0.3 + ((i * 23 + 7) % 50) / 100,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[3] overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            background: `rgba(201, 164, 108, ${p.opacity})`,
          }}
        />
      ))}
    </div>
  );
}

// ─── 2. BackgroundLayer ───────────────────────────────────────────────────────

function BackgroundLayer() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #0F0F0F 0%, #1a0f0a 25%, #0a0f1a 50%, #1a0f0a 75%, #0F0F0F 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: [
            '0% 0%',
            '100% 50%',
            '50% 100%',
            '0% 0%',
          ],
        }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
      <div className="absolute inset-0 video-overlay" />
    </div>
  );
}

// ─── 3. Navigation ────────────────────────────────────────────────────────────

function Navigation() {
  const { mobileMenuOpen, setMobileMenuOpen } = useServioStore();
  const router = useRouter();

  const navLinks = [
    { label: 'القائمة', href: '#القائمة' },
    { label: 'رؤى الذكاء', href: '#رؤى-الذكاء' },
    { label: 'الأسعار', href: '#الأسعار' },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 w-full py-4 px-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.span
            className="font-playfair text-xl font-bold gold-text select-none"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            Servio AI
          </motion.span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="glass-pill flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#F5F0E8]/70 hover:text-[#C9A46C] transition-colors duration-300 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <motion.button
              className="bg-[#C9A46C] text-[#0F0F0F] font-semibold px-5 py-2 rounded-full hover:bg-[#d4b07a] transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/login')}
            >
              ابدأ مجاناً
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden glass rounded-full p-2.5 flex items-center justify-center cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#F5F0E8]" />
            ) : (
              <Menu className="w-5 h-5 text-[#F5F0E8]" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[45] glass-strong flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-2xl font-playfair font-semibold text-[#F5F0E8] hover:text-[#C9A46C] transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button
              className="bg-[#C9A46C] text-[#0F0F0F] font-semibold px-8 py-3 rounded-full text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ابدأ مجاناً
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── 4. HeroSection ───────────────────────────────────────────────────────────

function HeroSection() {
  const { fetchMenu } = useServioStore();

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Warm glow spots */}
      <div className="warm-glow w-[400px] h-[400px] bg-[#C9A46C] -top-20 -right-40" />
      <div
        className="warm-glow w-[500px] h-[500px] bg-[#7A1C1C] -bottom-32 -left-32"
        style={{ opacity: 0.1 }}
      />
      <div className="warm-glow w-[300px] h-[300px] bg-[#C9A46C] top-1/3 left-1/4" />

      <motion.div
        className="flex flex-col items-center text-center px-4 max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} custom={0.2}>
          <span className="glass-pill inline-flex items-center gap-2 text-xs tracking-wider uppercase text-[#C9A46C]">
            <Sparkles className="w-3.5 h-3.5" />
            مدعوم بالنادل الذكي
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="mt-6 font-playfair text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
          variants={staggerContainer}
        >
          <motion.span
            className="block text-[#F5F0E8]"
            variants={fadeUp}
            custom={0.35}
          >
            منيوك الذكي
          </motion.span>
          <motion.span
            className="block gold-text mt-1"
            variants={fadeUp}
            custom={0.5}
          >
            اللي يبيع لك
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-6 text-base sm:text-lg text-[#F5F0E8]/60 max-w-xl mx-auto leading-relaxed"
          variants={fadeUp}
          custom={0.65}
        >
          ليس مجرد منيو — نظام ذكي يوجّه ويوصي ويزيد إيرادات مطعمك تلقائياً.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
          variants={fadeUp}
          custom={0.8}
        >
          <motion.button
            className="bg-[#C9A46C] text-[#0F0F0F] font-semibold px-8 py-3.5 rounded-full flex items-center gap-2 cta-pulse cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              document.getElementById('القائمة')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            جرب القائمة الحية
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="glass text-[#F5F0E8] font-medium px-8 py-3.5 rounded-full flex items-center gap-2 hover:border-[#C9A46C]/30 transition-colors duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play className="w-4 h-4" />
            شاهد العرض
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3"
          variants={fadeUp}
          custom={1.0}
        >
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A46C] to-[#7A1C1C] border-2 border-[#0F0F0F] flex items-center justify-center text-[10px] font-bold text-white">
              أ
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7A1C1C] to-[#C9A46C] border-2 border-[#0F0F0F] flex items-center justify-center text-[10px] font-bold text-white">
              م
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A46C] to-[#3a2a1a] border-2 border-[#0F0F0F] flex items-center justify-center text-[10px] font-bold text-white">
              ر
            </div>
          </div>
          <span className="text-sm text-[#F5F0E8]/40">
            موثوق من قبل 2,400+ مطعم
          </span>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5F0E8]/20">
            اسحب لاكتشاف المزيد
          </span>
          <motion.div
            className="w-5 h-8 rounded-full border border-[#C9A46C]/20 flex items-start justify-center p-1.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-1.5 rounded-full bg-[#C9A46C]/60"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Badge Component ──────────────────────────────────────────────────────────

function DishBadge({
  badge,
  tags,
  isFeatured,
  orderCount,
}: {
  badge?: 'popular' | 'recommended' | 'new' | undefined;
  tags?: string[];
  isFeatured?: boolean;
  orderCount?: number;
}) {
  // Determine which label to show
  let displayBadge = badge;
  if (!displayBadge && tags && isFeatured !== undefined && orderCount !== undefined) {
    displayBadge = getBadge(tags, isFeatured, orderCount);
  }

  if (!displayBadge) return null;

  const styles: Record<string, string> = {
    popular: 'bg-[#7A1C1C]/90 text-white',
    recommended: 'bg-[#C9A46C]/90 text-[#0F0F0F]',
    new: 'bg-white/10 text-[#F5F0E8]',
  };

  const labels: Record<string, string> = {
    popular: '🔥 الأكثر طلباً',
    recommended: '✨ اختيار الشيف',
    new: 'جديد',
  };

  return (
    <span
      className={`absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full z-10 ${styles[displayBadge] || styles.new}`}
    >
      {labels[displayBadge] || 'جديد'}
    </span>
  );
}

// ─── 5. CategoryTabs ──────────────────────────────────────────────────────────

function CategoryTabs() {
  const { categories, activeCategory, setActiveCategory } = useServioStore();

  if (categories.length === 0) return null;

  return (
    <motion.div
      className="relative z-10 px-6 pt-4 pb-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={staggerContainer}
    >
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
        {/* "All" pill */}
        <motion.button
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors duration-300 cursor-pointer ${
            activeCategory === null
              ? 'bg-[#C9A46C] text-[#0F0F0F]'
              : 'glass-pill text-[#F5F0E8]/60 hover:text-[#C9A46C]'
          }`}
          layout
          variants={scaleIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory(null)}
        >
          <Menu className="w-4 h-4" />
          الكل
        </motion.button>

        {/* Category pills */}
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#C9A46C] text-[#0F0F0F]'
                : 'glass-pill text-[#F5F0E8]/60 hover:text-[#C9A46C]'
            }`}
            layout
            variants={scaleIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 6. MenuPreview ───────────────────────────────────────────────────────────

function MenuPreview() {
  const {
    categories,
    activeCategory,
    activeDish,
    setActiveDish,
    addToCart,
    setVoiceOpen,
    menuLoading,
    menuLoaded,
  } = useServioStore();

  const allDishes = categories.flatMap((c) => c.dishes);
  const filteredDishes = activeCategory
    ? categories.find((c) => c.id === activeCategory)?.dishes || []
    : allDishes;

  return (
    <section id="القائمة" className="py-20 relative z-10">
      {/* Section header */}
      <motion.div
        className="text-center px-4 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={staggerContainer}
      >
        <motion.span
          className="glass-pill inline-flex items-center gap-2 text-xs tracking-wider uppercase text-[#C9A46C] mb-4"
          variants={fadeUp}
          custom={0}
        >
          <Flame className="w-3.5 h-3.5" />
          معاينة مباشرة
        </motion.span>
        <motion.h2
          className="font-playfair text-3xl sm:text-4xl font-bold text-[#F5F0E8] mt-3"
          variants={fadeUp}
          custom={0.1}
        >
          تجربة منسّقة بالذكاء الاصطناعي
        </motion.h2>
        <motion.p
          className="text-base text-[#F5F0E8]/50 mt-3 max-w-lg mx-auto"
          variants={fadeUp}
          custom={0.2}
        >
          كل طبق محسّن بالذكاء الاصطناعي لزيادة الجاذبية وقيمة الطلب
        </motion.p>
      </motion.div>

      {/* Loading skeletons */}
      {menuLoading && (
        <div className="flex gap-5 overflow-x-auto no-scrollbar px-6 pb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              className="relative flex-shrink-0 min-w-[280px] sm:min-w-[320px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="glass rounded-2xl overflow-hidden">
                <div className="h-48 w-full bg-white/5 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
                  <div className="flex items-center justify-between mt-4">
                    <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-white/5 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dish cards */}
      {!menuLoading && filteredDishes.length > 0 && (
        <div className="flex gap-5 overflow-x-auto no-scrollbar px-6 pb-4 scroll-smooth snap-x snap-mandatory">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish, i) => {
              const badge = getBadge(dish.tags, dish.isFeatured, dish.orderCount);
              const isExpanded = activeDish?.id === dish.id;



              return (
                <motion.div
                  key={dish.id}
                  className="relative flex-shrink-0 min-w-[280px] sm:min-w-[320px]"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  custom={i * 0.08}
                  variants={scaleIn}
                  layout
                >
                  <motion.div
                    className="glass rounded-2xl overflow-hidden card-glow cursor-pointer group snap-center"
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    onClick={() => setActiveDish(dish)}
                  >
                    {/* Image */}
                    <div className="h-48 w-full overflow-hidden relative">
                      <motion.img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                        loading="lazy"
                      />
                      <DishBadge badge={badge} />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-playfair text-lg font-semibold text-[#F5F0E8]">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-[#F5F0E8]/50 line-clamp-2 mt-1 leading-relaxed">
                        {dish.description}
                      </p>

                      {/* Rating + Order count */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[#C9A46C] text-xs">
                          <Star className="w-3 h-3 fill-[#C9A46C]" />
                          {dish.rating}
                        </span>
                        {dish.orderCount > 0 && (
                          <span className="text-[10px] text-[#F5F0E8]/25">
                            طُلب {dish.orderCount} مرة
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[#C9A46C] font-bold text-xl font-playfair">
                          {dish.price} ر.س
                        </span>
                        <motion.button
                          className="glass-pill text-xs flex items-center gap-1.5 text-[#C9A46C] cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDish(dish);
                            setVoiceOpen(true);
                          }}
                        >
                          <Mic className="w-3 h-3" />
                          تحدث مع الذكاء
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded action area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="mt-3 flex flex-col gap-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      >
                        <motion.button
                          className="w-full bg-[#C9A46C] text-[#0F0F0F] font-semibold py-3 rounded-xl text-sm cursor-pointer"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => addToCart(dish)}
                        >
                          أضف للطلب — {dish.price} ر.س
                        </motion.button>
                        <div className="flex gap-2">
                          <motion.button
                            className="flex-1 glass text-[#F5F0E8] py-2.5 rounded-xl text-sm cursor-pointer"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveDish(dish)}
                          >
                            عرض بدائل
                          </motion.button>
                          <motion.button
                            className="flex-1 glass text-[#F5F0E8] py-2.5 rounded-xl text-sm cursor-pointer"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => addToCart(dish)}
                          >
                            ترقية لكمبو
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Loaded but no dishes */}
      {!menuLoading && menuLoaded && filteredDishes.length === 0 && (
        <motion.div
          className="text-center py-16 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-[#F5F0E8]/30 text-sm">لا توجد أصناف في هذه الفئة حالياً</p>
        </motion.div>
      )}

      {/* Scroll indicator */}
      {filteredDishes.length > 0 && (
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex items-center gap-2 text-[#F5F0E8]/20 text-xs">
            <ChevronRight className="w-4 h-4 rotate-90" />
            اسحب للتصفح
            <ChevronRight className="w-4 h-4 -rotate-90" />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── 7. VoiceAIOverlay ────────────────────────────────────────────────────────

function VoiceAIOverlay() {
  const { voiceOpen, setVoiceOpen, aiState, activeDish, addToCart } =
    useServioStore();

  const getStatusText = (): string => {
    switch (aiState) {
      case 'listening':
        return 'يستمع...';
      case 'thinking':
        return 'يفكّر...';
      case 'speaking':
        return 'يتحدث...';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (aiState) {
      case 'listening':
        return <Mic className="w-5 h-5 text-[#C9A46C]" />;
      case 'thinking':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#C9A46C]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
      case 'speaking':
        return <Volume2 className="w-5 h-5 text-[#C9A46C]" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {voiceOpen && (
        <motion.div
          className="fixed inset-0 z-[60] glass-strong flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Close button */}
          <motion.button
            className="absolute top-6 left-6 glass rounded-full p-3 flex items-center justify-center cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setVoiceOpen(false)}
          >
            <X className="w-5 h-5 text-[#F5F0E8]" />
          </motion.button>

          {/* AI Avatar */}
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A46C] to-[#7A1C1C] flex items-center justify-center avatar-pulse"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 200,
              delay: 0.1,
            }}
          >
            <Bot className="w-10 h-10 text-white" />
          </motion.div>

          {/* Status */}
          <motion.div
            className="mt-6 flex items-center gap-2 text-lg font-medium text-[#F5F0E8]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </motion.div>

          {/* Voice waveform */}
          <div className="mt-8 flex items-center justify-center gap-1 h-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="voice-bar rounded-full"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  height:
                    aiState === 'speaking' || aiState === 'listening'
                      ? undefined
                      : '6px',
                  animationPlayState:
                    aiState === 'speaking' || aiState === 'listening'
                      ? 'running'
                      : 'paused',
                  opacity:
                    aiState === 'idle' || aiState === 'thinking' ? 0.3 : 1,
                }}
                animate={
                  aiState === 'thinking'
                    ? {
                        height: [6, 6, 6],
                      }
                    : undefined
                }
              />
            ))}
          </div>

          {/* AI Response */}
          <AnimatePresence>
            {aiState === 'speaking' && (
              <motion.div
                className="mt-10 max-w-md text-center px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass rounded-2xl p-6">
                  <p className="text-[#F5F0E8]/80 text-sm leading-relaxed">
                    {activeDish
                      ? `هذا ${activeDish.name} غني ومريح، بتوازن مثالي للنكهات. أنصحك بإضافة خبز طازج جانبي لتجربة كاملة.`
                      : 'كيف أقدر أساعدك اليوم؟ اسألني عن أي طبق أو دعني أرشح لك شي مميز.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestion buttons */}
          <AnimatePresence>
            {aiState === 'speaking' && (
              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-3 px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                {activeDish ? (
                  <>
                    <motion.button
                      className="bg-[#C9A46C] text-[#0F0F0F] rounded-full px-6 py-3 font-medium text-sm flex items-center gap-2 cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        addToCart(activeDish);
                        setVoiceOpen(false);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      أضف للطلب
                    </motion.button>
                    <motion.button
                      className="glass rounded-full px-6 py-3 text-[#F5F0E8] text-sm cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      عرض بدائل
                    </motion.button>
                    <motion.button
                      className="glass rounded-full px-6 py-3 text-[#F5F0E8] text-sm cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      ترقية لكمبو
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    className="bg-[#C9A46C] text-[#0F0F0F] rounded-full px-6 py-3 font-medium text-sm flex items-center gap-2 cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    رشّح لي شي
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 8. SmartCart ─────────────────────────────────────────────────────────────

function SmartCart() {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    addToCart,
    categories,
    placeOrder,
    orderPlacing,
  } = useServioStore();

  const total = cartTotal();
  const count = cartCount();

  // Find first drink from مشروبات ساخنة for upsell
  const drinkCategory = categories.find(
    (c) => c.name === 'مشروبات ساخنة'
  );
  const firstDrink = drinkCategory?.dishes[0] || null;

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] glass-strong rounded-t-3xl flex flex-col"
          variants={slideUp}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-[#C9A46C]/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between">
            <h3 className="font-playfair text-xl font-bold text-[#F5F0E8]">
              طلبك
              {count > 0 && (
                <span className="text-sm font-normal text-[#F5F0E8]/40 mr-2">
                  {count} أصناف
                </span>
              )}
            </h3>
            <motion.button
              className="p-1 cursor-pointer"
              whileTap={{ scale: 0.9 }}
              onClick={() => setCartOpen(false)}
            >
              <X className="w-5 h-5 text-[#F5F0E8]/50" />
            </motion.button>
          </div>

          {cartItems.length === 0 ? (
            /* Empty state */
            <motion.div
              className="flex-1 flex flex-col items-center justify-center py-12 px-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
                <ShoppingCart className="w-7 h-7 text-[#F5F0E8]/20" />
              </div>
              <p className="text-[#F5F0E8]/30 text-sm">
                سلتك فارغة
              </p>
              <p className="text-[#F5F0E8]/15 text-xs mt-1">
                أضف أصناف من القائمة للبدء
              </p>
            </motion.div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 overflow-y-auto px-6 space-y-4 max-h-[40vh] no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {cartItems.map(({ item, quantity }) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-4 items-center"
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[#F5F0E8] truncate">
                          {item.name}
                        </p>
                        <p className="text-[#C9A46C] text-sm font-semibold">
                          {item.price * quantity} ر.س
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          className="glass rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
                          whileTap={{ scale: 0.85 }}
                          onClick={() =>
                            updateQuantity(item.id, quantity - 1)
                          }
                        >
                          <Minus className="w-3.5 h-3.5 text-[#F5F0E8]/70" />
                        </motion.button>
                        <span className="text-sm font-medium text-[#F5F0E8] w-5 text-center">
                          {quantity}
                        </span>
                        <motion.button
                          className="glass rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
                          whileTap={{ scale: 0.85 }}
                          onClick={() =>
                            updateQuantity(item.id, quantity + 1)
                          }
                        >
                          <Plus className="w-3.5 h-3.5 text-[#F5F0E8]/70" />
                        </motion.button>
                        <motion.button
                          className="mr-1 cursor-pointer"
                          whileTap={{ scale: 0.85 }}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#F5F0E8]/30 hover:text-red-400 transition-colors" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* AI upsell suggestion */}
              {total < 50 && firstDrink && (
                <motion.div
                  className="mx-6 mt-4 p-4 glass rounded-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#C9A46C]" />
                      <span className="text-sm text-[#F5F0E8]/50">
                        معظم الزبائن يضيفون مشروب مع هذا 🍷
                      </span>
                    </div>
                    <motion.button
                      className="text-[#C9A46C] text-sm font-medium cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(firstDrink)}
                    >
                      أضف مشروب
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/5 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#F5F0E8]/50">
                    المجموع
                  </span>
                  <span className="font-playfair text-2xl font-bold gold-text">
                    {total} ر.س
                  </span>
                </div>
                <motion.button
                  className="w-full bg-[#C9A46C] text-[#0F0F0F] font-semibold py-3.5 rounded-full mt-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={orderPlacing}
                  onClick={() => placeOrder()}
                >
                  {orderPlacing ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-[#0F0F0F]/30 border-t-[#0F0F0F] rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      تأكيد الطلب — {total} ر.س
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 9. CartFAB ───────────────────────────────────────────────────────────────

function CartFAB() {
  const { cartOpen, setCartOpen, cartTotal, cartCount } = useServioStore();
  const count = cartCount();

  if (cartOpen || count === 0) return null;

  return (
    <motion.button
      className="fixed bottom-6 left-6 z-40 glass-strong rounded-full p-4 flex items-center gap-3 cta-pulse cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setCartOpen(true)}
    >
      <ShoppingCart className="w-5 h-5 text-[#C9A46C]" />
      <span className="gold-text font-bold text-sm">
        {cartTotal()} ر.س
      </span>
      {count > 0 && (
        <motion.span
          className="absolute -top-1 -left-1 bg-[#7A1C1C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
}

// ─── 10. OrderSuccessToast ────────────────────────────────────────────────────

function OrderSuccessToast() {
  const { orderSuccess, resetOrder } = useServioStore();

  return (
    <AnimatePresence>
      {orderSuccess && (
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] glass-strong rounded-2xl px-6 py-4 flex items-center gap-3 shadow-lg"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.15 }}
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </motion.div>
          <span className="text-[#F5F0E8] font-medium text-sm">
            تم تأكيد طلبك بنجاح! ✅
          </span>
          <motion.button
            className="mr-2 cursor-pointer"
            whileTap={{ scale: 0.9 }}
            onClick={resetOrder}
          >
            <X className="w-4 h-4 text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 11. Main Export ──────────────────────────────────────────────────────────

export default function ServioLanding() {
  const { fetchMenu } = useServioStore();

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return (
    <div
      className="relative min-h-screen grain-overlay vignette"
      style={{ background: '#0F0F0F' }}
    >
      <BackgroundLayer />
      <Particles />
      <Navigation />

      <main className="relative z-10">
        <HeroSection />
        <CategoryTabs />
        <MenuPreview />
        <HowItWorks />
        <AIVoiceDemo />
        <SmartMenuExperience />
        <AIDashboard />
        <Results />
        <Pricing />
        <AIPersonalization />
        <Integration />
        <FinalCTA />
      </main>

      <VoiceAIOverlay />
      <SmartCart />
      <CartFAB />
      <OrderSuccessToast />
      <Footer />
    </div>
  );
}