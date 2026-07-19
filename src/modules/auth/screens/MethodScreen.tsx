"use client";

import { motion } from "framer-motion";
import {
  ChefHat,
  Mail,
  MessageCircle,
  Shield,
  Zap,
} from "lucide-react";

interface MethodScreenProps {
  onPhoneClick: () => void;
  onEmailClick: () => void;
}

export function MethodScreen({
  onPhoneClick,
  onEmailClick,
}: MethodScreenProps) {
  return (
    <motion.div
      key="method"
      initial="hidden"
      animate="visible"
      exit="exit"
      className="glass-card p-6 sm:p-8"
    >
      {/* Logo */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="mb-2 text-center"
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          <ChefHat className="size-7 text-[#d4a853]" />
          <span className="gold-gradient-text select-none text-3xl font-black">
            MenuAI
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          ابدأ في بناء منيو ذكي خلال 30 ثانية
        </p>
      </motion.div>

      {/* Method buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-col gap-4"
      >
        {/* WhatsApp */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPhoneClick}
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
          onClick={onEmailClick}
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
  );
}