'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Star,
  Sparkles,
  Crown,
  Building2,
  QrCode,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  ArrowLeft,
  Play,
  MessageCircle,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Zap,
  Users,
  Headphones,
  Rocket,
} from 'lucide-react';

/* ============================================================
   SECTION 6: Pricing
   ============================================================ */
export function Pricing() {
  const router = useRouter();
  const plans = [
    {
      name: 'مجاني',
      price: '٠',
      currency: 'ر.س',
      highlighted: false,
      badge: null,
      features: [
        { text: 'منيو رقمي أساسي', included: true },
        { text: 'كود QR', included: true },
        { text: '٥٠ طلب/شهر', included: true },
        { text: 'النادل الذكي', included: false },
        { text: 'التحليلات', included: false },
        { text: 'البيع الإضافي', included: false },
      ],
      cta: 'ابدأ مجاناً',
      ctaStyle: 'glass' as const,
    },
    {
      name: 'احترافي',
      price: '٩٩',
      currency: 'ر.س',
      highlighted: true,
      badge: 'الأكثر طلباً',
      features: [
        { text: 'منيو رقمي كامل', included: true },
        { text: 'كود QR', included: true },
        { text: 'طلبات غير محدودة', included: true },
        { text: 'النادل الذكي بالصوت', included: true },
        { text: 'تحليلات وتقارير', included: true },
        { text: 'بيع إضافي ذكي', included: true },
      ],
      cta: 'ابدأ فترة تجريبية',
      ctaStyle: 'gold' as const,
    },
    {
      name: 'مؤسسات',
      price: 'مخصص',
      currency: '',
      highlighted: false,
      badge: null,
      features: [
        { text: 'كل مميزات الاحترافي', included: true },
        { text: 'دمج مع أنظمة POS', included: true },
        { text: 'فروع متعددة', included: true },
        { text: 'واجهة برمجية (API)', included: true },
        { text: 'دعم مخصص ٢٤/٧', included: true },
        { text: 'تقارير مخصصة', included: true },
      ],
      cta: 'تواصل معنا',
      ctaStyle: 'glass' as const,
    },
  ];

  return (
    <section className="py-24 relative z-10">
      {/* Centered header */}
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-pill px-4 py-2 mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#C9A46C]" />
          <span className="text-sm text-[#F5F0E8]/70">أسعار مرنة</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F0E8] font-playfair"
        >
          أسعار بسيطة. عائد ضخم.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-[#F5F0E8]/50 text-lg max-w-xl mx-auto"
        >
          ابدأ مجاناً واطّور مع نمو مطعمك
        </motion.p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-14 px-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className={`glass rounded-2xl p-8 card-glow relative flex flex-col ${
              plan.highlighted
                ? 'border-2 border-[#C9A46C]/40 md:scale-105'
                : ''
            }`}
          >
            {/* Highlighted badge */}
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A46C] text-[#0F0F0F] text-xs font-bold px-4 py-1 rounded-full">
                {plan.badge}
              </div>
            )}

            {/* Warm glow behind highlighted card */}
            {plan.highlighted && (
              <div className="absolute -inset-4 -z-10 warm-glow rounded-3xl opacity-40" />
            )}

            {/* Plan name */}
            <div className="text-lg font-bold text-[#F5F0E8]">{plan.name}</div>

            {/* Price */}
            <div className="mt-4">
              <span className="text-4xl font-bold gold-text">{plan.price}</span>
              {plan.currency && (
                <span className="text-[#F5F0E8]/40 text-sm mr-1">{plan.currency}</span>
              )}
              <div className="text-[#F5F0E8]/40 text-sm">/شهرياً</div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/5 my-6" />

            {/* Features */}
            <div className="space-y-4 flex-1">
              {plan.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-[#C9A46C] flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-[#F5F0E8]/20 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      feature.included ? 'text-[#F5F0E8]/70' : 'text-[#F5F0E8]/30'
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <button
                onClick={() => router.push('/login')}
                className={
                  plan.ctaStyle === 'gold'
                    ? 'w-full bg-[#C9A46C] text-[#0F0F0F] font-bold rounded-full py-3 px-6 cta-pulse text-center cursor-pointer'
                    : 'w-full glass rounded-full py-3 px-6 text-center text-[#F5F0E8]/70 hover:text-[#C9A46C] transition-colors cursor-pointer'
                }
              >
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 7: AI Personalization Showcase
   ============================================================ */
export function AIPersonalization() {
  return (
    <section className="py-24 relative z-10">
      {/* Centered header */}
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-pill px-4 py-2 mb-6"
        >
          <Users className="w-4 h-4 text-[#C9A46C]" />
          <span className="text-sm text-[#F5F0E8]/70">تخصيص ذكي</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F0E8] font-playfair"
        >
          كل زبون يشوف منيو مختلف
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-[#F5F0E8]/50 text-lg max-w-xl mx-auto"
        >
          الذكاء الاصطناعي يكيف القائمة حسب كل زبون
        </motion.p>
      </div>

      {/* Split layout */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto mt-14 px-6">
        {/* Left card — Vegan User */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="lg:w-1/2 glass-strong rounded-2xl p-6 border-t-2 border-green-500/40"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-lg">
              🌿
            </div>
            <span className="text-green-400 font-bold">ملف الزبون: نباتي</span>
          </div>

          {/* Menu items */}
          <div>
            {[
              {
                name: 'سلطة أفوكادو وجرجير',
                tag: null,
                label: '✨ موصى به',
              },
              {
                name: 'حساء خضار طازج',
                tag: 'نباتي',
                label: null,
              },
              {
                name: 'عصير أخضر طاقة',
                tag: null,
                label: '✨ موصى به',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 py-3 border-b border-white/5 ${
                  i === 2 ? 'border-0' : ''
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  <span className="text-[#F5F0E8]/80 text-sm">{item.name}</span>
                  {item.tag && (
                    <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.label && (
                  <span className="text-[#C9A46C] text-xs flex-shrink-0">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right card — Regular User */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="lg:w-1/2 glass-strong rounded-2xl p-6 border-t-2 border-[#C9A46C]/40"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#C9A46C]/10 flex items-center justify-center text-lg">
              🍽️
            </div>
            <span className="text-[#C9A46C] font-bold">ملف الزبون: متنوع</span>
          </div>

          {/* Menu items */}
          <div>
            {[
              {
                name: 'توست فرنسي بالقرفة',
                label: '🔥 الأكثر طلباً',
              },
              {
                name: 'كابتشينو كراميل',
                label: '✨ موصى به',
              },
              {
                name: 'تيراميسو كلاسيكي',
                label: '🔥 الأكثر طلباً',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 py-3 border-b border-white/5 ${
                  i === 2 ? 'border-0' : ''
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-[#C9A46C] flex-shrink-0" />
                <span className="text-[#F5F0E8]/80 text-sm flex-1">{item.name}</span>
                <span className="text-[#C9A46C] text-xs flex-shrink-0">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 text-center text-sm text-[#F5F0E8]/40 px-6 max-w-2xl mx-auto"
      >
        الذكاء الاصطناعي يحلل سلوك كل زبون ويعدّل القائمة في الوقت الفعلي
      </motion.p>
    </section>
  );
}

/* ============================================================
   SECTION 8: Integration + Devices
   ============================================================ */
export function Integration() {
  const devices = [
    {
      icon: QrCode,
      title: 'كود QR',
      description: 'امسح واطلب فوراً',
    },
    {
      icon: Smartphone,
      title: 'جوال',
      description: 'تجربة مثالية على الموبايل',
    },
    {
      icon: Tablet,
      title: 'تابلت',
      description: 'شاشة كبيرة للطلب',
    },
    {
      icon: Monitor,
      title: 'شاشة العرض',
      description: 'قائمة رقمية على التلفزيون',
    },
  ];

  const integrations = ['POS متوافق', 'واي فاي', 'طباعة مباشرة', 'تقارير PDF'];

  return (
    <section className="py-24 relative z-10">
      {/* Centered header */}
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-pill px-4 py-2 mb-6"
        >
          <Globe className="w-4 h-4 text-[#C9A46C]" />
          <span className="text-sm text-[#F5F0E8]/70">تكامل كامل</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F0E8] font-playfair"
        >
          يعمل في كل مكان
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-[#F5F0E8]/50 text-lg max-w-xl mx-auto"
        >
          متوفر على جميع الأجهزة والمنصات
        </motion.p>
      </div>

      {/* Device cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto mt-14 px-6">
        {devices.map((device, index) => (
          <motion.div
            key={device.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="glass rounded-2xl p-6 text-center card-glow"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#C9A46C]/10 flex items-center justify-center mx-auto">
              <device.icon className="w-7 h-7 text-[#C9A46C]" />
            </div>
            <h3 className="font-bold mt-4 text-sm text-[#F5F0E8]">{device.title}</h3>
            <p className="text-xs text-[#F5F0E8]/40 mt-1">{device.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Integration badges */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-wrap justify-center gap-4 px-6"
      >
        {integrations.map((item) => (
          <span
            key={item}
            className="glass-pill px-4 py-2 text-xs text-[#F5F0E8]/50"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================================================
   SECTION 9: Final CTA
   ============================================================ */
export function FinalCTA() {
  const router = useRouter();
  return (
    <section className="py-28 relative z-10 overflow-hidden">
      {/* Ambient warm glow spots */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#C9A46C]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-[#7A1C1C]/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A46C]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center px-6 relative z-10">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-bold text-[#F5F0E8] leading-tight font-playfair"
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="block"
          >
            حوّل منيوك
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="block gold-text gold-shimmer"
          >
            لآلة بيع
          </motion.span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg text-[#F5F0E8]/50"
        >
          ابدأ في دقائق. شوف النتائج فوراً.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button onClick={() => router.push('/login')} className="bg-[#C9A46C] text-[#0F0F0F] font-bold px-10 py-4 rounded-full cta-pulse inline-flex items-center justify-center gap-2 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
            ابدأ مجاناً
          </button>
          <button onClick={() => router.push('/login')} className="glass rounded-full px-10 py-4 inline-flex items-center justify-center gap-2 text-[#F5F0E8]/70 hover:text-[#C9A46C] transition-colors cursor-pointer">
            <Play className="w-5 h-5" />
            احجز عرض توضيحي
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-sm text-[#F5F0E8]/30"
        >
          ⚡ بدون بطاقة ائتمان — إعداد في أقل من ٥ دقائق
        </motion.p>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
export function Footer() {
  const productLinks = ['المميزات', 'الأسعار', 'التكاملات', 'التحديثات'];
  const companyLinks = ['عن Servio', 'المدونة', 'الوظائف', 'تواصل معنا'];
  const supportLinks = ['مركز المساعدة', 'الأسئلة الشائعة', 'الشروط والأحكام', 'الخصوصية'];

  return (
    <footer className="border-t border-white/5 py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Right side — Logo + description */}
          <div className="md:text-right">
            <h3 className="text-xl font-bold gold-text font-playfair">Servio AI</h3>
            <p className="text-sm text-[#F5F0E8]/30 mt-2 max-w-xs">
              نظام المنيو الذكي الذي يزيد إيرادات مطعمك بالذكاء الاصطناعي
            </p>
          </div>

          {/* Center — Link columns */}
          <div className="flex flex-wrap gap-12 justify-center">
            {/* Product */}
            <div>
              <h4 className="font-bold text-[#F5F0E8] text-sm mb-4">المنتج</h4>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#F5F0E8]/30 hover:text-[#C9A46C] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-[#F5F0E8] text-sm mb-4">الشركة</h4>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#F5F0E8]/30 hover:text-[#C9A46C] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-[#F5F0E8] text-sm mb-4">الدعم</h4>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#F5F0E8]/30 hover:text-[#C9A46C] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Left side — Social + copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#F5F0E8]/30 hover:text-[#C9A46C] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#F5F0E8]/30 hover:text-[#C9A46C] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#F5F0E8]/30 hover:text-[#C9A46C] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-[#F5F0E8]/30 hover:text-[#C9A46C] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-[#F5F0E8]/20">
              © ٢٠٢٦ Servio AI. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}