import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";

/* ------------------------------------------------------------------ */
/*  OTP Input Box                                                      */
/* ------------------------------------------------------------------ */

export function OtpBox({
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
