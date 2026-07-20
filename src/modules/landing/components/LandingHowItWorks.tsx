'use client';

import { motion } from 'framer-motion';
import { steps, fadeUp, stagger } from '../constants';

export function LandingHowItWorks() {
  return (
    <section className="px-4 py-20 md:py-28 text-right" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            كيف يعمل <span className="gold-gradient-text">النظام؟</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="flex flex-col gap-10 md:flex-row md:gap-0"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              className="flex flex-1 flex-col items-center text-center relative"
            >
              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 start-1/2 w-full h-px bg-gradient-to-l from-[#d4a853]/30 to-transparent -z-0" />
              )}

              {/* Step number circle */}
              <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-full gold-gradient text-lg font-bold text-background">
                {s.num}
              </div>

              {/* Icon */}
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#d4a853]/10">
                <s.icon className="size-5 text-[#d4a853]" />
              </div>

              <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
              <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
