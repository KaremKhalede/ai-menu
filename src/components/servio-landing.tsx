'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowRight,
  Play,
  Volume2,
  Bot,
  Flame,
} from 'lucide-react';
import { useServioStore, type MenuItem } from '@/lib/servio-store';

// ─── Demo Menu Data ───────────────────────────────────────────────────────────

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Risotto',
    description:
      'Creamy arborio rice with black truffle shavings, aged parmesan, and a drizzle of truffle oil. A rich, earthy masterpiece.',
    price: 42,
    image:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    badge: 'popular' as const,
  },
  {
    id: '2',
    name: 'Wagyu Tataki',
    description:
      'Lightly seared A5 wagyu with ponzu glaze, microgreens, and toasted sesame. Melt-in-your-mouth perfection.',
    price: 68,
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    badge: 'recommended' as const,
  },
  {
    id: '3',
    name: 'Lobster Thermidor',
    description:
      'Whole Maine lobster in a rich brandy cream sauce, gratinated with gruyère. The ultimate indulgence.',
    price: 78,
    image:
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
    badge: 'popular' as const,
  },
  {
    id: '4',
    name: 'Saffron Paella',
    description:
      'Traditional Valencian paella with saffron-infused rice, fresh seafood, and crispy socarrat bottom.',
    price: 55,
    image:
      'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Black Cod Miso',
    description:
      'Marinated 72 hours in white miso, then caramelized to perfection. Served with pickled ginger and edamame.',
    price: 58,
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    badge: 'new' as const,
  },
  {
    id: '6',
    name: 'Chocolate Soufflé',
    description:
      'Light, airy, and intensely chocolatey. Served with vanilla crème anglaise and gold leaf.',
    price: 28,
    image:
      'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400&h=300&fit=crop',
    badge: 'recommended' as const,
  },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay },
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
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

const slideUp = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.35, ease: 'easeIn' },
  },
};

// ─── 1. Particles ─────────────────────────────────────────────────────────────

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    []
  );

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

  const navLinks = ['Menu', 'AI Insights', 'Pricing'];

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
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  className="text-sm text-[#F5F0E8]/70 hover:text-[#C9A46C] transition-colors duration-300 cursor-pointer"
                >
                  {link}
                </a>
              ))}
            </div>
            <motion.button
              className="bg-[#C9A46C] text-[#0F0F0F] font-semibold px-5 py-2 rounded-full hover:bg-[#d4b07a] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Free
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden glass rounded-full p-2.5 flex items-center justify-center"
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
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-2xl font-playfair font-semibold text-[#F5F0E8] hover:text-[#C9A46C] transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
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
              Start Free
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── 4. HeroSection ───────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Warm glow spots */}
      <div className="warm-glow w-[400px] h-[400px] bg-[#C9A46C] -top-20 -left-40" />
      <div
        className="warm-glow w-[500px] h-[500px] bg-[#7A1C1C] -bottom-32 -right-32"
        style={{ opacity: 0.1 }}
      />
      <div className="warm-glow w-[300px] h-[300px] bg-[#C9A46C] top-1/3 right-1/4" />

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
            Powered by AI Waiter
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
            Your Menu That
          </motion.span>
          <motion.span
            className="block gold-text mt-1"
            variants={fadeUp}
            custom={0.5}
          >
            Sells For You
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-6 font-inter text-base sm:text-lg text-[#F5F0E8]/60 max-w-xl mx-auto leading-relaxed"
          variants={fadeUp}
          custom={0.65}
        >
          Not just a menu — an intelligent system that guides, recommends, and
          increases your restaurant revenue automatically.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
          variants={fadeUp}
          custom={0.8}
        >
          <motion.button
            className="bg-[#C9A46C] text-[#0F0F0F] font-semibold px-8 py-3.5 rounded-full flex items-center gap-2 cta-pulse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Try Live Menu
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="glass text-[#F5F0E8] font-medium px-8 py-3.5 rounded-full flex items-center gap-2 hover:border-[#C9A46C]/30 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play className="w-4 h-4" />
            Watch Demo
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
              A
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7A1C1C] to-[#C9A46C] border-2 border-[#0F0F0F] flex items-center justify-center text-[10px] font-bold text-white">
              M
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A46C] to-[#3a2a1a] border-2 border-[#0F0F0F] flex items-center justify-center text-[10px] font-bold text-white">
              R
            </div>
          </div>
          <span className="text-sm text-[#F5F0E8]/40 font-inter">
            Trusted by 2,400+ restaurants
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
            Scroll to explore
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

function DishBadge({ badge }: { badge?: string }) {
  if (!badge) return null;

  const styles: Record<string, string> = {
    popular: 'bg-[#7A1C1C]/90 text-white',
    recommended: 'bg-[#C9A46C]/90 text-[#0F0F0F]',
    new: 'bg-white/10 text-[#F5F0E8]',
  };

  const labels: Record<string, string> = {
    popular: '🔥 Popular',
    recommended: '✨ AI Pick',
    new: 'New',
  };

  return (
    <span
      className={`absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full ${styles[badge] || styles.new}`}
    >
      {labels[badge] || 'New'}
    </span>
  );
}

// ─── 5. MenuPreview ───────────────────────────────────────────────────────────

function MenuPreview() {
  const { activeDish, setActiveDish, addToCart, setVoiceOpen } =
    useServioStore();

  return (
    <section id="menu" className="py-20 relative z-10">
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
          Live Preview
        </motion.span>
        <motion.h2
          className="font-playfair text-3xl sm:text-4xl font-bold text-[#F5F0E8] mt-3"
          variants={fadeUp}
          custom={0.1}
        >
          AI-Curated Experience
        </motion.h2>
        <motion.p
          className="font-inter text-base text-[#F5F0E8]/50 mt-3 max-w-lg mx-auto"
          variants={fadeUp}
          custom={0.2}
        >
          Each dish is enhanced by AI to maximize appeal and order value
        </motion.p>
      </motion.div>

      {/* Horizontal scroll container */}
      <div className="flex gap-5 overflow-x-auto no-scrollbar px-6 pb-4 scroll-smooth snap-x snap-mandatory">
        {MENU_ITEMS.map((dish, i) => {
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
                  <DishBadge badge={dish.badge} />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-playfair text-lg font-semibold text-[#F5F0E8]">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-[#F5F0E8]/50 line-clamp-2 mt-1 font-inter leading-relaxed">
                    {dish.description}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[#C9A46C] font-bold text-xl font-playfair">
                      ${dish.price}
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
                      Talk to AI
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
                      className="w-full bg-[#C9A46C] text-[#0F0F0F] font-semibold py-3 rounded-xl text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(dish)}
                    >
                      Add to Order — ${dish.price}
                    </motion.button>
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 glass text-[#F5F0E8] py-2.5 rounded-xl text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveDish(dish)}
                      >
                        Show Alternatives
                      </motion.button>
                      <motion.button
                        className="flex-1 glass text-[#F5F0E8] py-2.5 rounded-xl text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          addToCart(dish);
                        }}
                      >
                        Upgrade to Combo
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-6 md:hidden">
        <div className="flex items-center gap-2 text-[#F5F0E8]/20 text-xs font-inter">
          <ChevronRight className="w-4 h-4 rotate-90" />
          Swipe to browse
          <ChevronRight className="w-4 h-4 -rotate-90" />
        </div>
      </div>
    </section>
  );
}

// ─── 6. VoiceAIOverlay ────────────────────────────────────────────────────────

function VoiceAIOverlay() {
  const { voiceOpen, setVoiceOpen, aiState, activeDish, addToCart } =
    useServioStore();

  const getStatusText = () => {
    switch (aiState) {
      case 'listening':
        return 'Listening...';
      case 'thinking':
        return 'Thinking...';
      case 'speaking':
        return 'Speaking...';
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
            className="absolute top-6 right-6 glass rounded-full p-3 flex items-center justify-center cursor-pointer"
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
                  <p className="text-[#F5F0E8]/80 font-inter text-sm leading-relaxed">
                    {activeDish
                      ? `This ${activeDish.name} is rich and comforting, with a perfect balance of flavor. I recommend adding fresh bread on the side for a complete experience.`
                      : 'How can I help you today? Ask me about any dish or let me recommend something special.'}
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
                      className="bg-[#C9A46C] text-[#0F0F0F] rounded-full px-6 py-3 font-medium text-sm flex items-center gap-2"
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
                      Add to Order
                    </motion.button>
                    <motion.button
                      className="glass rounded-full px-6 py-3 text-[#F5F0E8] text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Show Alternatives
                    </motion.button>
                    <motion.button
                      className="glass rounded-full px-6 py-3 text-[#F5F0E8] text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Upgrade to Combo
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    className="bg-[#C9A46C] text-[#0F0F0F] rounded-full px-6 py-3 font-medium text-sm flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Recommend Something
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

// ─── 7. SmartCart ─────────────────────────────────────────────────────────────

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
  } = useServioStore();

  const total = cartTotal();
  const count = cartCount();

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
              Your Order
              {count > 0 && (
                <span className="text-sm font-inter font-normal text-[#F5F0E8]/40 ml-2">
                  {count} {count === 1 ? 'item' : 'items'}
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
              <p className="text-[#F5F0E8]/30 font-inter text-sm">
                Your cart is empty
              </p>
              <p className="text-[#F5F0E8]/15 font-inter text-xs mt-1">
                Add dishes from the menu to get started
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
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
                          ${item.price * quantity}
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
                          className="ml-1 cursor-pointer"
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

              {/* AI suggestion */}
              {total < 50 && (
                <motion.div
                  className="mx-6 mt-4 p-4 glass rounded-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#C9A46C]" />
                      <span className="text-sm text-[#F5F0E8]/50 font-inter">
                        Most customers add a drink with this 🍷
                      </span>
                    </div>
                    <motion.button
                      className="text-[#C9A46C] text-sm font-medium cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        addToCart({
                          id: 'drink',
                          name: 'House Wine',
                          description: 'Curated pairing from our sommelier',
                          price: 18,
                          image:
                            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
                        })
                      }
                    >
                      Add a Drink
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/5 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#F5F0E8]/50 font-inter">
                    Total
                  </span>
                  <span className="font-playfair text-2xl font-bold gold-text">
                    ${total}
                  </span>
                </div>
                <motion.button
                  className="w-full bg-[#C9A46C] text-[#0F0F0F] font-semibold py-3.5 rounded-full mt-3 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Place Order — ${total}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 8. DishDetailOverlay ─────────────────────────────────────────────────────

function DishDetailOverlay() {
  const { activeDish, setActiveDish, addToCart, setVoiceOpen, voiceOpen } =
    useServioStore();

  if (!activeDish || voiceOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60"
          onClick={() => setActiveDish(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Content */}
        <motion.div
          className="relative glass-strong rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 z-10"
          initial={{ y: 60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.95 }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 300,
          }}
        >
          {/* Image */}
          <div className="relative h-52 w-full rounded-2xl overflow-hidden">
            <img
              src={activeDish.image}
              alt={activeDish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <DishBadge badge={activeDish.badge} />
          </div>

          {/* Name */}
          <h3 className="font-playfair text-2xl font-bold text-[#F5F0E8] mt-4">
            {activeDish.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#F5F0E8]/50 mt-2 leading-relaxed font-inter">
            {activeDish.description}
          </p>

          {/* Price */}
          <p className="gold-text font-playfair text-3xl font-bold mt-4">
            ${activeDish.price}
          </p>

          {/* Conversion labels */}
          <div className="flex items-center gap-4 mt-3">
            {activeDish.badge === 'popular' && (
              <span className="flex items-center gap-1.5 text-[#C9A46C] text-xs font-inter">
                <Flame className="w-3.5 h-3.5" />
                Most Ordered Today
              </span>
            )}
            {activeDish.badge === 'new' && (
              <span className="flex items-center gap-1.5 text-red-400 text-xs font-inter">
                <Star className="w-3.5 h-3.5" />
                Limited Availability
              </span>
            )}
            {activeDish.badge === 'recommended' && (
              <span className="flex items-center gap-1.5 text-[#C9A46C] text-xs font-inter">
                <TrendingUp className="w-3.5 h-3.5" />
                AI Recommended
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <motion.button
              className="bg-[#C9A46C] text-[#0F0F0F] font-semibold py-3.5 rounded-full w-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                addToCart(activeDish);
                setActiveDish(null);
              }}
            >
              <Plus className="w-4 h-4" />
              Add to Order — ${activeDish.price}
            </motion.button>
            <motion.button
              className="glass flex items-center justify-center gap-2 py-3.5 rounded-full w-full text-[#F5F0E8] font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActiveDish(activeDish);
                setVoiceOpen(true);
              }}
            >
              <Mic className="w-4 h-4 text-[#C9A46C]" />
              Ask AI Waiter
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
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
      className="fixed bottom-6 right-6 z-40 glass-strong rounded-full p-4 flex items-center gap-3 cta-pulse cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setCartOpen(true)}
    >
      <ShoppingCart className="w-5 h-5 text-[#C9A46C]" />
      <span className="gold-text font-bold text-sm font-inter">
        ${cartTotal()}
      </span>
      {count > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 bg-[#7A1C1C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
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

// ─── 10. Main Export ──────────────────────────────────────────────────────────

export default function ServioLanding() {
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
        <MenuPreview />
      </main>

      <VoiceAIOverlay />
      <SmartCart />
      <CartFAB />
    </div>
  );
}