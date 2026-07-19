"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cardVariant,
  fadeUp,
  bounceIn,
} from "@/modules/auth/utils/animations";

interface EmailScreenProps {
  email: string;
  error: string;

  onBack: () => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}

export function EmailScreen({
  email,
  error,
  onBack,
  onEmailChange,
  onSubmit,
}: EmailScreenProps) {
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
        <Mail className="size-8 text-[#d4a853]" />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <h2 className="text-xl font-bold">تسجيل الدخول بالبريد الإلكتروني</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          سنرسل لك رابط تسجيل دخول آمن.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="example@email.com"
          className="h-12 w-full rounded-xl border border-border bg-background px-4 text-center outline-none transition-all focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/20"
        />
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
        className="mt-8"
      >
        <Button
          onClick={onSubmit}
          className="h-12 w-full rounded-xl bg-[#d4a853] font-semibold text-black hover:bg-[#e8c47c]"
        >
          إرسال رابط تسجيل الدخول
        </Button>
      </motion.div>
    </motion.div>
    );
}