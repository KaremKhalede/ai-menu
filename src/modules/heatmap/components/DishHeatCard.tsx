'use client';

import { motion } from 'framer-motion';
import { heatColor } from '../utils';
import { fadeUp } from '../constants';
import type { DishStat } from '../types';

interface DishHeatCardProps {
  dish: DishStat;
  intensity: number;
  index: number;
  valueLabel: string;
}

export function DishHeatCard({ dish, intensity, index, valueLabel }: DishHeatCardProps) {
  const barColor = heatColor(intensity);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="relative overflow-hidden rounded-xl p-3 border transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${heatColor(intensity)}0d 0%, rgba(18,18,26,0.6) 100%)`,
        borderColor: `${heatColor(intensity)}33`,
      }}
    >
      {/* Glow effect for high-intensity items */}
      {intensity > 0.7 && (
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 20%, ${heatColor(intensity)} 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: `${barColor}22`,
              color: barColor,
            }}
          >
            {index + 1}
          </div>
          <span className="text-sm font-semibold text-[#f0ece4] truncate">{dish.dishName}</span>
        </div>
        <span
          className="text-sm font-bold shrink-0 mr-2"
          style={{ color: barColor }}
        >
          {valueLabel}
        </span>
      </div>

      <div className="relative z-10">
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${barColor}, ${heatColor(Math.min(1, intensity + 0.15))})` }}
            initial={{ width: 0 }}
            animate={{ width: `${dish.percentage * 5}%` }} // scale up for visual impact
            transition={{ duration: 0.8, delay: index * 0.06, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#8a8578]">{dish.percentage}%</span>
          <span className="text-[10px] text-[#8a8578]">من إجمالي التفاعلات</span>
        </div>
      </div>
    </motion.div>
  );
}
