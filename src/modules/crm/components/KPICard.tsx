'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '../constants';

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  delay: number;
}

export function KPICard({ icon: Icon, label, value, sub, delay }: KPICardProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-[#d4a853]/10 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-[#d4a853]" />
        </div>
        <span className="text-gray-400 text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}
