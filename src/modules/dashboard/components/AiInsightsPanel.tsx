'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InsightCard } from './InsightCard';
import type { AIInsight } from '../types';

interface AiInsightsPanelProps {
  insights: AIInsight[];
}

/**
 * AI insights card — scrollable list of AI insight rows.
 */
export function AiInsightsPanel({ insights }: AiInsightsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65, duration: 0.5 }}
    >
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#d4a853]" />
            <CardTitle className="text-lg font-bold text-[#f0ece4]">
              💡 رؤى الذكاء الاصطناعي
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} index={i} />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
