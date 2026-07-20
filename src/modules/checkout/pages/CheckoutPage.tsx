'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

import { useCheckout } from '../hooks/useCheckout';
import { StepOrderSummary } from '../components/StepOrderSummary';
import { StepPaymentDetails } from '../components/StepPaymentDetails';
import { StepSuccessConfirm } from '../components/StepSuccessConfirm';

/**
 * Checkout Page / Overlay Modal.
 *
 * This orchestrator is extremely thin and focused (under 80 lines):
 *  - Handles data states and step routing using useCheckout hook.
 *  - Renders backdrops and centers the multi-step checkout dialog modal.
 */
export default function CheckoutPage() {
  const form = useCheckout();
  const { showCheckout, step, handleClose } = form;

  if (!showCheckout) return null;

  return (
    <AnimatePresence>
      {/* ──────── Backdrop ──────── */}
      <motion.div
        key="checkout-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        {/* ──────── Modal Wrapper ──────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center justify-center min-h-screen p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div dir="rtl" className="w-full max-w-md">
            <Card className="glass-card border-0 shadow-2xl shadow-black/50 overflow-hidden relative">
              <CardContent className="p-0 relative">
                <AnimatePresence mode="wait">
                  {step === 1 && <StepOrderSummary form={form} />}
                  {step === 2 && <StepPaymentDetails form={form} />}
                  {step === 3 && <StepSuccessConfirm form={form} />}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
