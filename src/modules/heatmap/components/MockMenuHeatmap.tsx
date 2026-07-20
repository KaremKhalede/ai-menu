'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeatmapDot } from './HeatmapDot';
import { heatColor } from '../utils';
import type { HeatmapSummaryData } from '../types';

interface MockMenuHeatmapProps {
  data: HeatmapSummaryData;
}

export function MockMenuHeatmap({ data }: MockMenuHeatmapProps) {
  // Generate mock heatmap dots based on hotspot data
  const dots = useMemo(() => {
    const result: { x: number; y: number; intensity: number; size: number }[] = [];

    // Top-right hotspot (highest)
    for (let i = 0; i < 12; i++) {
      result.push({
        x: 55 + Math.random() * 40,
        y: 5 + Math.random() * 40,
        intensity: 0.6 + Math.random() * 0.4,
        size: 30 + Math.random() * 50,
      });
    }

    // Bottom-right hotspot
    for (let i = 0; i < 10; i++) {
      result.push({
        x: 55 + Math.random() * 40,
        y: 50 + Math.random() * 45,
        intensity: 0.4 + Math.random() * 0.35,
        size: 25 + Math.random() * 40,
      });
    }

    // Top-left hotspot
    for (let i = 0; i < 8; i++) {
      result.push({
        x: 5 + Math.random() * 40,
        y: 5 + Math.random() * 40,
        intensity: 0.3 + Math.random() * 0.3,
        size: 20 + Math.random() * 35,
      });
    }

    // Bottom-left hotspot
    for (let i = 0; i < 6; i++) {
      result.push({
        x: 5 + Math.random() * 40,
        y: 50 + Math.random() * 45,
        intensity: 0.15 + Math.random() * 0.25,
        size: 18 + Math.random() * 30,
      });
    }

    return result;
  }, []);

  // Mock dish positions in the grid layout
  const mockDishes = useMemo(
    () => [
      { name: 'كبسة لحم', x: 60, y: 10, intensity: 1.0 },
      { name: 'مندي دجاج', x: 75, y: 10, intensity: 0.85 },
      { name: 'مشاوي مشكّلة', x: 60, y: 35, intensity: 0.72 },
      { name: 'فتة حمص', x: 75, y: 35, intensity: 0.6 },
      { name: 'كنافة نابلسية', x: 60, y: 60, intensity: 0.55 },
      { name: 'مقلوبة', x: 75, y: 60, intensity: 0.48 },
      { name: 'شاورما عربي', x: 15, y: 10, intensity: 0.45 },
      { name: 'تبولة لبنانية', x: 30, y: 10, intensity: 0.35 },
      { name: 'حلاوة طحينية', x: 15, y: 35, intensity: 0.3 },
      { name: 'فلافل مقلية', x: 30, y: 35, intensity: 0.28 },
    ],
    []
  );

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0f]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)',
          backgroundSize: '20% 20%',
        }}
      />

      {/* Heatmap overlay dots */}
      {dots.map((dot, i) => (
        <HeatmapDot key={i} x={dot.x} y={dot.y} intensity={dot.intensity} size={dot.size} />
      ))}

      {/* Mock dish cards */}
      {mockDishes.map((dish, i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg px-2 py-1.5 text-[10px] font-medium border border-white/[0.08] backdrop-blur-sm"
          style={{
            left: `${dish.x}%`,
            top: `${dish.y}%`,
            width: '22%',
            background: `rgba(18,18,26,${0.5 + dish.intensity * 0.3})`,
            borderColor: `${heatColor(dish.intensity)}44`,
            color: heatColor(dish.intensity),
            transform: 'translate(-50%, 0)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
        >
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: heatColor(dish.intensity) }}
            />
            <span className="truncate">{dish.name}</span>
          </div>
        </motion.div>
      ))}

      {/* Corner labels */}
      <div className="absolute top-2 right-2 text-[10px] text-[#8a8578]/60 font-medium">أعلى اليمين</div>
      <div className="absolute top-2 left-2 text-[10px] text-[#8a8578]/60 font-medium">أعلى اليسار</div>
      <div className="absolute bottom-2 right-2 text-[10px] text-[#8a8578]/60 font-medium">أسفل اليمين</div>
      <div className="absolute bottom-2 left-2 text-[10px] text-[#8a8578]/60 font-medium">أسفل اليسار</div>
    </div>
  );
}
