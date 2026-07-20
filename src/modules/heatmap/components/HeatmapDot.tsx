'use client';

import { motion } from 'framer-motion';
import { heatColor } from '../utils';

interface HeatmapDotProps {
  x: number;
  y: number;
  intensity: number;
  size: number;
}

export function HeatmapDot({ x, y, intensity, size }: HeatmapDotProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${heatColor(intensity)}cc 0%, ${heatColor(intensity)}44 50%, transparent 100%)`,
        filter: `blur(${Math.max(2, size * 0.15)}px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
}
