'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

export function ConfettiParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 12 + 6,
        rotate: Math.random() * 360,
        delay: Math.random() * 0.6,
        duration: Math.random() * 2 + 2,
        colors: ['#d4a853', '#e8c47c', '#f0dca0', '#c9956b'],
        color: ['#d4a853', '#e8c47c', '#f0dca0', '#c9956b'][Math.floor(Math.random() * 4)],
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.6],
            y: [0, -30, -15, -50],
            rotate: [p.rotate, p.rotate + 180],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        >
          <PartyPopper
            className="opacity-80"
            style={{
              width: p.size,
              height: p.size,
              color: p.color,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
