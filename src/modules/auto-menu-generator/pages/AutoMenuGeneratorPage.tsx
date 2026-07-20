'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAutoMenuGenerator } from '../hooks/useAutoMenuGenerator';
import { StepInputForm } from '../components/StepInputForm';
import { StepPreview } from '../components/StepPreview';
import { StepSuccess } from '../components/StepSuccess';
import { scaleIn } from '../constants';

/**
 * Auto Menu Generator Page.
 *
 * This orchestrator is extremely thin and focused (under 50 lines):
 *  - Manages the multi-step configuration wizard steps: input, preview, and success screens.
 *  - Keeps components separate, stateless, and fully controlled.
 */
export default function AutoMenuGeneratorPage() {
  const form = useAutoMenuGenerator();

  return (
    <div dir="rtl">
      <AnimatePresence mode="wait">
        {form.step === 'input' && (
          <motion.div key="input" variants={scaleIn} initial="hidden" animate="visible" exit="exit">
            <StepInputForm form={form} />
          </motion.div>
        )}
        {form.step === 'preview' && (
          <motion.div key="preview" variants={scaleIn} initial="hidden" animate="visible" exit="exit">
            <StepPreview form={form} />
          </motion.div>
        )}
        {form.step === 'success' && (
          <motion.div key="success" variants={scaleIn} initial="hidden" animate="visible" exit="exit">
            <StepSuccess form={form} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
