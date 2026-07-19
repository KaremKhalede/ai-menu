"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useOtp() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOtpChange = useCallback(
    (
      index: number,
      digit: string,
      clearError?: () => void
    ) => {
      const next = [...otp];
      next[index] = digit;

      setOtp(next);

      clearError?.();

      if (index < 5 && digit) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpBackspace = useCallback((index: number) => {
    if (index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, []);

  const handleResend = () => {
    if (resendTimer > 0) return;

    setResendTimer(60);
  };

  return {
    otp,
    setOtp,

    resendTimer,
    setResendTimer,

    otpRefs,

    handleOtpChange,
    handleOtpBackspace,
    handleResend,
  };
}