"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export type LoginStep =
  | "method"
  | "phone"
  | "otp"
  | "email"
  | "email-success"
  | "loading"
  | "error";

export function useLoginPage() {
  const [step, setStep] = useState<LoginStep>("method");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
     if (resendTimer <= 0) return;

     const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
     }, 1000);

     return () => clearInterval(timer);
    }, [resendTimer]);


    const handleResend = () => {
     if (resendTimer > 0) return;
     setResendTimer(60);
      // سيتم استبدال هذا لاحقًا باستدعاء API
    };


    const handleOtpChange = useCallback(
        (index: number, digit: string) => {
            const next = [...otp];
            next[index] = digit;

            setOtp(next);
            setError("");

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

  return {
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

    showPassword,
    setShowPassword,

    error,
    setError,

    otpRefs,

    handleResend,

    handleOtpChange,

    handleOtpBackspace,

  };
}