import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

import { demoUser } from "../services/auth.mock";
import { phoneSchema, emailSchema, useLogin } from "..";

import type { LoginStep } from "./useLoginPage";

interface Params {
  phone: string;
  email: string;
  otp: string[];

  setStep: (step: LoginStep) => void;
  setError: (error: string) => void;
  setResendTimer: (timer: number) => void;
}

export function useLoginActions({
  phone,
  email,
  otp,
  setStep,
  setError,
  setResendTimer,
}: Params) {
  const router = useRouter();
  const { setUser } = useStore();

  const {
    loginWithPhone,
    verifyOtp,
    sendMagicLink,
  } = useLogin();

  const startLoading = () => {
    setError("");
    setStep("loading");
  };

  const showError = (
    message: string,
    step: LoginStep
  ) => {
    setError(message);
    setStep(step);
  };

  const sendOtp = async () => {
    const result = phoneSchema.safeParse({ phone });

    if (!result.success) {
      showError("يرجى إدخال رقم جوال صحيح", "phone");
      return;
    }

    startLoading();

    try {
      await loginWithPhone(phone);

      setResendTimer(60);
      setStep("otp");
    } catch {
      showError(
        "تعذر إرسال رمز التحقق، حاول مرة أخرى.",
        "phone"
      );
    }
  };

  const verify = async () => {
    startLoading();

    try {
      const user = await verifyOtp(
        `+966${phone}`,
        otp.join("")
      );

      setUser(user);

      router.push("/onboarding");
    } catch {
      showError(
        "رمز التحقق غير صحيح أو انتهت صلاحيته.",
        "otp"
      );
    }
  };

  const sendEmail = async () => {
    const result = emailSchema.safeParse({
      email,
    });

    if (!result.success) {
      showError(
        "يرجى إدخال بريد إلكتروني صحيح",
        "email"
      );
      return;
    }

    startLoading();

    try {
      await sendMagicLink(email);

      setStep("email-success");
    } catch {
      showError(
        "حدث خطأ أثناء إرسال رابط تسجيل الدخول",
        "email"
      );
    }
  };

  const loginAsDemo = () => {
    setUser(demoUser);

    router.push("/onboarding");
  };

  return {
    sendOtp,
    verify,
    sendEmail,
    loginAsDemo,
  };
}