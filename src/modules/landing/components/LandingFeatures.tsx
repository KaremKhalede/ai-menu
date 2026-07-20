'use client';

import { motion } from 'framer-motion';
import { features, fadeUp, stagger } from '../constants';

export function LandingFeatures() {
  return (
    <section id="features" className="px-4 py-20 md:py-28 text-right" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            مميزات <span className="gold-gradient-text">خرافية</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            أدوات ذكية مصممة خصيصاً لتعزيز تجربة عملائك وزيادة مبيعاتك
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="glass-card group p-6 transition-colors hover:border-[#d4a853]/25 text-right"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#d4a853]/10 transition-colors group-hover:bg-[#d4a853]/20">
                <f.icon className="size-6 text-[#d4a853]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
