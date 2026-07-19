'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { useStore } from '@/lib/store';
import { emailSchema, phoneSchema, useLogin } from '@/modules/auth';
import { demoUser } from '@/modules/auth/services/auth.mock';
import { useLoginPage } from '@/modules/auth/hooks/useLoginPage';

import { MethodScreen } from '@/modules/auth/screens/MethodScreen';
import { PhoneScreen } from '@/modules/auth/screens/PhoneScreen';
import { OtpScreen } from '@/modules/auth/screens/OtpScreen';
import { EmailScreen } from '@/modules/auth/screens/EmailScreen';
import { EmailSuccessScreen } from '@/modules/auth/screens/EmailSuccessScreen';

import { cardVariant } from '@/modules/auth/utils/animations';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();

  const {
    loginWithPhone,
    verifyOtp,
    sendMagicLink,
  } = useLogin();

  const {
    step,
    setStep,

    phone,
    setPhone,

    email,
    setEmail,

    otp,
    setOtp,

    resendTimer,
    setResendTimer,

    error,
    setError,

    handleResend,
    handleOtpChange,
    handleOtpBackspace,
  } = useLoginPage();

  const startLoading = () => {
    setError('');
    setStep('loading');
  };

  const showError = (
    message: string,
    targetStep: typeof step
  ) => {
    setError(message);
    setStep(targetStep);
  };

  const handleSendOtp = async () => {
    const result = phoneSchema.safeParse({ phone });

    if (!result.success) {
      showError('يرجى إدخال رقم جوال صحيح', 'phone');
      return;
    }

    startLoading();

    try {
      await loginWithPhone(phone);

      setResendTimer(60);
      setStep('otp');
    } catch {
      showError(
        'تعذر إرسال رمز التحقق، حاول مرة أخرى.',
        'phone'
      );
    }
  };

  const handleVerifyOtp = async () => {
    startLoading();

    try {
      const user = await verifyOtp(
        `+966${phone}`,
        otp.join('')
      );

      setUser(user);
      router.push('/onboarding');
    } catch {
      showError(
        'رمز التحقق غير صحيح أو انتهت صلاحيته.',
        'otp'
      );
    }
  };

  const handleSendMagicLink = async () => {
    const result = emailSchema.safeParse({
      email,
    });

    if (!result.success) {
      showError(
        'يرجى إدخال بريد إلكتروني صحيح',
        'email'
      );
      return;
    }

    startLoading();

    try {
      await sendMagicLink(email);
      setStep('email-success');
    } catch {
      showError(
        'حدث خطأ أثناء إرسال رابط تسجيل الدخول',
        'email'
      );
    }
  };

  const handleDemoLogin = () => {
    setUser(demoUser);
    router.push('/onboarding');
  };

  useEffect(() => {
    if (step !== 'otp') return;

    if (otp.every((d) => d !== '')) {
      handleVerifyOtp();
    }
  }, [otp, step]);

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
    >
      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 'method' && (
            <MethodScreen
              onPhoneClick={() => setStep('phone')}
              onEmailClick={() => setStep('email')}
            />
          )}

          {step === 'phone' && (
            <PhoneScreen
              phone={phone}
              error={error}
              onBack={() => {
                setStep('method');
                setPhone('');
                setError('');
              }}
              onPhoneChange={setPhone}
              onSubmit={handleSendOtp}
            />
          )}

          {step === 'otp' && (
            <OtpScreen
              phone={phone}
              otp={otp}
              error={error}
              resendTimer={resendTimer}
              onBack={() => {
                setStep('phone');
                setOtp(Array(6).fill(''));
                setError('');
              }}
              onOtpChange={handleOtpChange}
              onOtpBackspace={handleOtpBackspace}
              onResend={handleResend}
              onChangePhone={() => {
                setStep('phone');
                setOtp(Array(6).fill(''));
              }}
            />
          )}

          {step === 'email' && (
            <EmailScreen
              email={email}
              error={error}
              onBack={() => {
                setStep('method');
                setEmail('');
                setError('');
              }}
              onEmailChange={setEmail}
              onSubmit={handleSendMagicLink}
            />
          )}

          {step === 'email-success' && (
            <EmailSuccessScreen
              onDemoLogin={handleDemoLogin}
              onChangeEmail={() => {
                setEmail('');
                setStep('email');
              }}
            />
          )}

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
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Loader2 className="size-12 text-[#d4a853]" />
              </motion.div>

              <p className="mt-5 text-base font-semibold text-foreground">
                جارٍ التحقق...
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                يرجى الانتظار لحظة
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}