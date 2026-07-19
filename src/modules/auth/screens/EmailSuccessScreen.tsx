"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cardVariant,
  fadeUp,
  bounceIn,
} from "@/modules/auth/utils/animations";

interface EmailSuccessScreenProps {
  onDemoLogin: () => void;
  onChangeEmail: () => void;
}

export function EmailSuccessScreen({
  onDemoLogin,
  onChangeEmail,
}: EmailSuccessScreenProps) {
  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="glass-card p-6 text-center sm:p-8"
    >
      <motion.div
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#d4a853]/10"
      >
        <CheckCircle2 className="size-10 text-[#d4a853]" />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-bold">
          تم إرسال رابط تسجيل الدخول!
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          تحقق من بريدك الإلكتروني لإكمال تسجيل الدخول.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8"
      >
        <Button
          onClick={onDemoLogin}
          variant="outline"
          className="border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853]"
        >
          <Sparkles className="mr-2 size-4" />
          للعرض التجريبي، اضغط هنا
        </Button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-4"
      >
        <button
          onClick={onChangeEmail}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          تغيير البريد الإلكتروني
        </button>
      </motion.div>
    </motion.div>
  );
}