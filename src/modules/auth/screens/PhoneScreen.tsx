"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Coffee, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cardVariant,
  fadeUp,
  bounceIn,
} from "@/modules/auth/utils/animations";
interface PhoneScreenProps {
  phone: string;
  error: string;

  onBack: () => void;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
}

export function PhoneScreen({
  phone,
  error,
  onBack,
  onPhoneChange,
  onSubmit,
}: PhoneScreenProps) {
  return (
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
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span>رجوع</span>
      </motion.button>

      {/* Icon + title */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#d4a853]/10">
          <Phone className="size-7 text-[#d4a853]" />
        </div>

        <h2 className="text-xl font-bold">أدخل رقم الجوال</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          سنرسل لك رمز تحقق عبر واتساب
        </p>
      </motion.div>

      {/* Phone input */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6"
      >
        <div className="flex items-center gap-0 rounded-lg border border-border bg-background/60 transition-all focus-within:border-[#d4a853] focus-within:ring-2 focus-within:ring-[#d4a853]/20">
          <div className="flex items-center gap-1.5 border-l border-border bg-muted/30 px-4 py-2.5">
            <Coffee className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              +966
            </span>
          </div>

          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            placeholder="5XXXXXXXX"
            value={phone}
            maxLength={9}
            autoFocus
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
              onPhoneChange(digits);
            }}
            className={`flex-1 bg-transparent px-4 py-2.5 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground/50 ${
              error ? "text-destructive" : ""
            }`}
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
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6"
      >
        <Button
          onClick={onSubmit}
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
  );
}