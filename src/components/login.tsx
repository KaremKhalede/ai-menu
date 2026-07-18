'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Mail,
  Phone,
  ArrowLeft,
  Shield,
  Zap,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Sparkles,
  ChefHat,
  Coffee,
  UtensilsCrossed,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type LoginStep =
  | 'method'
  | 'phone'
  | 'otp'
  | 'email'
  | 'email-success'
  | 'loading'
  | 'error';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const bounceIn = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 15, delay: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Background decorations                                             */
/* ------------------------------------------------------------------ */

function LoginBackground() {
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden>
      <div className="absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-[#d4a853]/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#d4a853]/8 blur-[100px]" />
      <div className="absolute top-1/2 left-16 h-48 w-48 rounded-full bg-[#d4a853]/5 blur-[80px]" />
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #d4a853 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OTP Input Box                                                      */
/* ------------------------------------------------------------------ */

function OtpBox({
  index,
  value,
  onChange,
  onBackspace,
  onFocus,
  autoFocus,
}: {
  index: number;
  value: string;
  onChange: (i: number, v: string) => void;
  onBackspace: (i: number) => void;
  onFocus?: () => void;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <motion.input
      ref={ref}
      key={index}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      autoFocus={autoFocus}
      variants={fadeUp}
      custom={index}
      className="h-14 w-12 rounded-xl border border-border bg-background/60 text-center text-2xl font-bold text-foreground outline-none transition-all focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/30 sm:h-16 sm:w-14 sm:text-3xl"
      onChange={(e) => {
        const digit = e.target.value.replace(/\D/g, '');
        if (digit) {
          onChange(index, digit);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' && !value) {
          onBackspace(index);
        }
      }}
      onFocus={onFocus}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Login() {
  const { setUser } = useStore();
  const router = useRouter();

  const [step, setStep] = useState<LoginStep>('method');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ---------- Actions ---------- */
  const handleVerifyOtp = () => {
    setStep('loading');
    setTimeout(() => {
      setUser({
        id: crypto.randomUUID(),
        name: '',
        phone: `+966${phone}`,
        email: '',
        role: 'owner',
      });
      router.push('/onboarding');
    }, 1500);
  };

  const handleSendOtp = () => {
    if (phone.length < 9) return;
    setStep('loading');
    setTimeout(() => {
      setStep('otp');
      setResendTimer(60);
    }, 1200);
  };

  /* ---------- Resend timer ---------- */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  /* ---------- Auto‑submit OTP ---------- */
  useEffect(() => {
    if (otp.every((d) => d !== '') && step === 'otp') {
      const id = requestAnimationFrame(() => handleVerifyOtp());
      return () => cancelAnimationFrame(id);
    }
  }, [otp, step, handleVerifyOtp]);

  /* ---------- OTP handlers ---------- */
  const handleOtpChange = useCallback(
    (index: number, digit: string) => {
      const next = [...otp];
      next[index] = digit;
      setOtp(next);
      setError('');

      // Focus next box
      if (index < 5 && digit) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleOtpBackspace = useCallback(
    (index: number) => {
      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [],
  );

  /* ---------- More actions ---------- */
  const handleSendMagicLink = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    setStep('loading');
    setTimeout(() => {
      setStep('email-success');
    }, 1500);
  };

  const handleDemoLogin = () => {
    setUser({
      id: 'demo',
      name: 'أحمد المطعمي',
      phone: '+966501234567',
      email: 'demo@menuai.sa',
      role: 'owner',
    });
    router.push('/onboarding');
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    // Simulate resend
  };

  /* ---------- Render ---------- */
  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* ==================== STATE: METHOD SELECTION ==================== */}
          {step === 'method' && (
            <motion.div
              key="method"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card p-6 sm:p-8"
            >
              {/* Logo */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-2 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <ChefHat className="size-7 text-[#d4a853]" />
                  <span className="text-3xl font-black gold-gradient-text select-none">
                    MenuAI
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ابدأ في بناء منيو ذكي خلال 30 ثانية
                </p>
              </motion.div>

              {/* Method buttons */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-8 flex flex-col gap-4"
              >
                {/* WhatsApp */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('phone')}
                  className="group relative flex items-center gap-4 rounded-xl gold-gradient p-5 text-right transition-shadow hover:shadow-lg hover:shadow-[#d4a853]/20"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-black/20">
                    <MessageCircle className="size-6 text-[#0a0a0f]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#0a0a0f]">
                        تسجيل عبر واتساب
                      </span>
                      <span className="rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-semibold text-[#0a0a0f]">
                        موصى به
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#0a0a0f]/60">
                      الأسرع — رمز تحقق خلال ثوانٍ
                    </p>
                  </div>
                  <Zap className="size-5 text-[#0a0a0f]/50 transition-transform group-hover:-translate-x-1" />
                </motion.button>

                {/* Email */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('email')}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background/40 p-5 text-right transition-colors hover:border-[#d4a853]/30 hover:bg-[#d4a853]/5"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#d4a853]/10">
                    <Mail className="size-6 text-[#d4a853]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-bold text-foreground">
                      تسجيل عبر الإيميل
                    </span>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      رابط تسجيل دخول مباشر
                    </p>
                  </div>
                </motion.button>
              </motion.div>

              {/* Bottom notes */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-6 space-y-3 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  لا تحتاج بطاقة بنكية — ابدأ مجاناً
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
                  <Shield className="size-3.5" />
                  <span>حماية متقدمة بتشفير 256-bit</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ==================== STATE: PHONE INPUT ==================== */}
          {(step === 'phone' || step === 'error') && (
            <motion.div
              key="phone"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card p-6 sm:p-8"
            >
              {/* Back button */}
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                onClick={() => {
                  setStep('method');
                  setError('');
                }}
                className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                <span>رجوع</span>
              </motion.button>

              {/* Icon + title */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#d4a853]/10">
                  <Phone className="size-7 text-[#d4a853]" />
                </div>
                <h2 className="text-xl font-bold">أدخل رقم الجوال</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  سنرسل لك رمز تحقق عبر واتساب
                </p>
              </motion.div>

              {/* Phone input */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6">
                <div className="flex items-center gap-0 rounded-lg border border-border bg-background/60 focus-within:border-[#d4a853] focus-within:ring-2 focus-within:ring-[#d4a853]/20 transition-all">
                  {/* Saudi prefix */}
                  <div className="flex items-center gap-1.5 border-l border-border bg-muted/30 px-4 py-2.5">
                    <Coffee className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">+966</span>
                  </div>
                  {/* Number input */}
                  <input
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    placeholder="5XXXXXXXX"
                    value={phone}
                    maxLength={9}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                      setPhone(digits);
                      setError('');
                    }}
                    className={`flex-1 bg-transparent px-4 py-2.5 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground/50 ${
                      error ? 'text-destructive' : ''
                    }`}
                    autoFocus
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6">
                <Button
                  onClick={handleSendOtp}
                  disabled={phone.length < 9}
                  className="w-full gold-gradient text-base font-semibold hover:opacity-90"
                  size="lg"
                >
                  إرسال رمز التحقق
                </Button>
              </motion.div>

              {/* Terms */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-4 text-center text-[11px] text-muted-foreground/60"
              >
                بتسجيلك أنت توافق على شروط الاستخدام وسياسة الخصوصية
              </motion.p>
            </motion.div>
          )}

          {/* ==================== STATE: OTP VERIFICATION ==================== */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card p-6 sm:p-8"
            >
              {/* Back button */}
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                onClick={() => {
                  setStep('phone');
                  setOtp(Array(6).fill(''));
                  setError('');
                }}
                className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                <span>رجوع</span>
              </motion.button>

              {/* Animated icon */}
              <motion.div
                variants={bounceIn}
                initial="hidden"
                animate="visible"
                className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#d4a853]/10"
              >
                <Shield className="size-8 text-[#d4a853]" />
              </motion.div>

              {/* Title */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
                <h2 className="text-xl font-bold">أدخل رمز التحقق</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  تم إرسال رمز من 6 أرقام إلى +966{phone}
                </p>
              </motion.div>

              {/* OTP boxes */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-8 flex items-center justify-center gap-2 sm:gap-3"
              >
                {otp.map((digit, i) => (
                  <OtpBox
                    key={i}
                    index={i}
                    value={digit}
                    onChange={handleOtpChange}
                    onBackspace={handleOtpBackspace}
                    autoFocus={i === 0}
                  />
                ))}
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-xs text-destructive"
                >
                  {error}
                </motion.p>
              )}

              {/* Resend */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-6 text-center"
              >
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    إعادة الإرسال خلال{' '}
                    <span className="font-semibold text-[#d4a853]">
                      {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm font-semibold text-[#d4a853] transition-colors hover:text-[#e8c47c]"
                  >
                    إعادة إرسال الرمز
                  </button>
                )}
              </motion.div>

              {/* Change number */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-3 text-center"
              >
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp(Array(6).fill(''));
                  }}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  تغيير رقم الجوال
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ==================== STATE: EMAIL INPUT ==================== */}
          {step === 'email' && (
            <motion.div
              key="email"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card p-6 sm:p-8"
            >
              {/* Back button */}
              <motion.button
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                onClick={() => {
                  setStep('method');
                  setError('');
                }}
                className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                <span>رجوع</span>
              </motion.button>

              {/* Icon + title */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#d4a853]/10">
                  <Mail className="size-7 text-[#d4a853]" />
                </div>
                <h2 className="text-xl font-bold">أدخل بريدك الإلكتروني</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  سنرسل لك رابط تسجيل الدخول مباشرة
                </p>
              </motion.div>

              {/* Email input */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6">
                <div
                  className={`flex items-center rounded-lg border transition-all ${
                    error
                      ? 'border-destructive ring-2 ring-destructive/20'
                      : 'border-border focus-within:border-[#d4a853] focus-within:ring-2 focus-within:ring-[#d4a853]/20'
                  } bg-background/60`}
                >
                  <Mail className="mr-4 size-5 text-muted-foreground" />
                  <input
                    type="email"
                    dir="ltr"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-transparent py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/50"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMagicLink()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6">
                <Button
                  onClick={handleSendMagicLink}
                  disabled={!email}
                  className="w-full gold-gradient text-base font-semibold hover:opacity-90"
                  size="lg"
                >
                  إرسال رابط تسجيل الدخول
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ==================== STATE: EMAIL SUCCESS ==================== */}
          {step === 'email-success' && (
            <motion.div
              key="email-success"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card p-6 sm:p-8 text-center"
            >
              <motion.div
                variants={bounceIn}
                initial="hidden"
                animate="visible"
                className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#d4a853]/10"
              >
                <CheckCircle2 className="size-10 text-[#d4a853]" />
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <h2 className="text-xl font-bold">تم إرسال رابط تسجيل الدخول!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  تحقق من بريدك الإلكتروني
                </p>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-8">
                <Button
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
                >
                  <Sparkles className="size-4" />
                  للعرض التجريبي، اضغط هنا
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-4">
                <button
                  onClick={() => setStep('email')}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  تغيير البريد الإلكتروني
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ==================== STATE: LOADING ==================== */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card flex flex-col items-center justify-center p-10 sm:p-14"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="size-12 text-[#d4a853]" />
              </motion.div>
              <p className="mt-5 text-base font-semibold text-foreground">جارٍ التحقق...</p>
              <p className="mt-1 text-sm text-muted-foreground">يرجى الانتظار لحظة</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}