'use client';

import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { getInsightBorder } from '../utils/severity';
import type { AIInsight } from '../types';

interface InsightCardProps {
  insight: AIInsight;
  index: number;
}

/**
 * A single AI insight card row used inside the AiInsightsPanel.
 */
export function InsightCard({ insight, index }: InsightCardProps) {
  const iconClass = 'h-5 w-5 shrink-0';

  const Icon =
    insight.type === 'success'
      ? () => <CheckCircle className={`${iconClass} text-emerald-400`} />
      : insight.type === 'warning'
      ? () => <AlertTriangle className={`${iconClass} text-amber-400`} />
      : () => <Info className={`${iconClass} text-orange-400`} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.06, duration: 0.4 }}
      className={`p-3 rounded-xl border ${getInsightBorder(insight.type)} bg-white/[0.02]`}
    >
      <div className="flex gap-2.5">
        <div className="mt-0.5">
          <Icon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f0ece4] mb-1">{insight.title}</p>
          <p className="text-xs text-[#8a8578] leading-relaxed">{insight.description}</p>
          {insight.action && (
            <button className="mt-2 text-xs font-medium text-[#d4a853] border border-[#d4a853]/30 rounded-lg px-3 py-1.5 hover:bg-[#d4a853]/10 transition-colors">
              {insight.action}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
