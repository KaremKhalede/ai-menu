"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { OtpBox } from "@/modules/auth/components/OtpBox";
import {
  cardVariant,
  fadeUp,
  bounceIn,
} from "@/modules/auth/utils/animations";

interface OtpScreenProps {
  phone: string;
  otp: string[];
  error: string;
  resendTimer: number;

  onBack: () => void;
  onOtpChange: (index: number, value: string) => void;
  onOtpBackspace: (index: number) => void;
  onResend: () => void;
  onChangePhone: () => void;
}

export function OtpScreen({
  phone,
  otp,
  error,
  resendTimer,
  onBack,
  onOtpChange,
  onOtpBackspace,
  onResend,
  onChangePhone,
}: OtpScreenProps) {
  return (   
     <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="glass-card p-6 sm:p-8"
    >
      <motion.button
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span>رجوع</span>
      </motion.button>

      <motion.div
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#d4a853]/10"
      >
        <Shield className="size-8 text-[#d4a853]" />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <h2 className="text-xl font-bold">أدخل رمز التحقق</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          تم إرسال رمز من 6 أرقام إلى +966{phone}
        </p>
      </motion.div>

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
            onChange={onOtpChange}
            onBackspace={onOtpBackspace}
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

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 text-center"
      >
        {resendTimer > 0 ? (
          <p className="text-sm text-muted-foreground">
            إعادة الإرسال خلال{" "}
            <span className="font-semibold text-[#d4a853]">
              {Math.floor(resendTimer / 60)}:
              {String(resendTimer % 60).padStart(2, "0")}
            </span>
          </p>
        ) : (
          <button
            onClick={onResend}
            className="text-sm font-semibold text-[#d4a853] transition-colors hover:text-[#e8c47c]"
          >
            إعادة إرسال الرمز
          </button>
        )}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-3 text-center"
      >
        <button
          onClick={onChangePhone}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          تغيير رقم الجوال
        </button>
      </motion.div>
    </motion.div>
    );
}