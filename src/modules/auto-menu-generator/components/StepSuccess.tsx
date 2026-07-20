'use client';

import { motion } from 'framer-motion';
import { Sparkles, Eye, Pencil, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scaleIn, successPop } from '../constants';
import type { UseAutoMenuGeneratorReturn } from '../hooks/useAutoMenuGenerator';

interface StepSuccessProps {
  form: UseAutoMenuGeneratorReturn;
}

export function StepSuccess({ form }: StepSuccessProps) {
  const { categories, totalDishes, setView } = form;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0ece4] flex items-center justify-center p-6 text-right" dir="rtl">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Success Icon */}
        <motion.div variants={successPop} className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="absolute -top-1 -right-1 w-8 h-8 rounded-full gold-gradient flex items-center justify-center"
            >
              <Sparkles className="h-4 w-4 text-[#0a0a0f]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">
            تم إنشاء القائمة <span className="gold-gradient-text">بنجاح!</span>
          </h2>
          <p className="text-[#8a8578] text-sm">
            تم توليد قائمة طعام كاملة لمطعمك باستخدام الذكاء الاصطناعي
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="glass-card p-4 space-y-1">
            <p className="text-3xl font-bold gold-gradient-text">{categories.length}</p>
            <p className="text-xs text-[#8a8578]">قسم</p>
          </div>
          <div className="glass-card p-4 space-y-1">
            <p className="text-3xl font-bold gold-gradient-text">{totalDishes}</p>
            <p className="text-xs text-[#8a8578]">طبق</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Button
            onClick={() => setView('menu')}
            className="w-full h-12 text-base font-bold gold-gradient hover:opacity-90 rounded-xl gap-2 cursor-pointer"
          >
            <Eye className="h-5 w-5" />
            معاينة المنيو
          </Button>
          <Button
            variant="outline"
            onClick={() => setView('menu-editor')}
            className="w-full h-12 text-base font-semibold rounded-xl gap-2 border-[#d4a853]/30 text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#d4a853] cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            تعديل متقدم
          </Button>
          <Button
            variant="ghost"
            onClick={() => setView('dashboard')}
            className="w-full text-[#8a8578] hover:text-[#f0ece4] cursor-pointer"
          >
            العودة للوحة التحكم
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
