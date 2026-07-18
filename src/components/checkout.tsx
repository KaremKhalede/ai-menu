'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  PartyPopper,
  ArrowRight,
  MapPin,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

/* ───────────── Confetti Particles ───────────── */

function ConfettiParticles() {
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
        color: ['#d4a853', '#e8c47c', '#f0dca0', '#c9956b'][
          Math.floor(Math.random() * 4)
        ],
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

/* ═══════════════════════════════════════════════════════════════
   Checkout Component
   ═══════════════════════════════════════════════════════════════ */

export default function Checkout() {
  const {
    cart,
    cartTotal,
    clearCart,
    showCheckout,
    setShowCheckout,
    orderPlaced,
    setOrderPlaced,
    setView,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber] = useState(() => `#${Math.floor(1000 + Math.random() * 9000)}`);

  if (!showCheckout) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 1500);
  };

  const handleBackToMenu = () => {
    clearCart();
    setShowCheckout(false);
    setOrderPlaced(true);
    setView('menu');
    setStep(1);
    // Reset orderPlaced after 2s
    setTimeout(() => {
      setOrderPlaced(false);
    }, 2000);
  };

  const handleClose = () => {
    setShowCheckout(false);
    setStep(1);
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

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
        {/* ──────── Modal ──────── */}
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
                  {/* ═══════════ Step 1: Order Summary ═══════════ */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                        <h2 className="text-lg font-bold text-[#f0ece4]">
                          إتمام الطلب
                        </h2>
                        <button
                          onClick={handleClose}
                          className="h-8 w-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                        >
                          <X className="h-4 w-4 text-[#8a8578]" />
                        </button>
                      </div>

                      {/* Items */}
                      <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
                        {cart.map((item) => (
                          <div
                            key={item.dish.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-sm text-[#d4a853] font-semibold bg-[#d4a853]/10 px-2 py-0.5 rounded-md shrink-0">
                                ×{item.quantity}
                              </span>
                              <span className="text-sm text-[#f0ece4] truncate">
                                {item.dish.name}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-[#f0ece4] shrink-0 mr-3">
                              {formatPrice(item.totalPrice)} ر.س
                            </span>
                          </div>
                        ))}
                        {cart.length === 0 && (
                          <p className="text-center text-sm text-[#8a8578] py-6">
                            السلة فارغة
                          </p>
                        )}
                      </div>

                      {/* Separator */}
                      <div className="mx-5 border-t border-white/[0.06]" />

                      {/* Total */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                          <span className="text-sm text-[#8a8578]">المجموع الكلي</span>
                          <span className="text-2xl font-bold gold-gradient-text">
                            {formatPrice(cartTotal)} ر.س
                          </span>
                        </div>
                        <Button
                          className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-bold text-base py-6"
                          disabled={cart.length === 0}
                          onClick={() => setStep(2)}
                        >
                          متابعة الدفع
                          <ArrowRight className="h-4 w-4 mr-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* ═══════════ Step 2: Payment ═══════════ */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                        <h2 className="text-lg font-bold text-[#f0ece4]">
                          تفاصيل الدفع
                        </h2>
                        <button
                          onClick={handleClose}
                          className="h-8 w-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                        >
                          <X className="h-4 w-4 text-[#8a8578]" />
                        </button>
                      </div>

                      <div className="p-5 space-y-5">
                        {/* Customer Name */}
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8a8578] flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            اسم الزبون (اختياري)
                          </Label>
                          <Input
                            placeholder="أدخل الاسم"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="bg-white/[0.04] border-white/[0.08] text-[#f0ece4] placeholder:text-[#8a8578]/60 focus:border-[#d4a853]/50"
                          />
                        </div>

                        {/* Table Number */}
                        <div className="space-y-2">
                          <Label className="text-sm text-[#8a8578] flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            رقم الطاولة (اختياري)
                          </Label>
                          <Input
                            placeholder="مثال: 5"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            type="number"
                            className="bg-white/[0.04] border-white/[0.08] text-[#f0ece4] placeholder:text-[#8a8578]/60 focus:border-[#d4a853]/50"
                          />
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-3">
                          <Label className="text-sm text-[#8a8578]">طريقة الدفع</Label>
                          <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="space-y-2"
                          >
                            {[
                              {
                                value: 'card',
                                label: 'بطاقة',
                                icon: CreditCard,
                                emoji: '💳',
                              },
                              {
                                value: 'apple',
                                label: 'Apple Pay / مدى',
                                icon: Smartphone,
                                emoji: '📱',
                              },
                              {
                                value: 'cash',
                                label: 'كاش',
                                icon: Banknote,
                                emoji: '💵',
                              },
                            ].map((method) => (
                              <label
                                key={method.value}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                  paymentMethod === method.value
                                    ? 'border-[#d4a853]/50 bg-[#d4a853]/5'
                                    : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                                }`}
                              >
                                <RadioGroupItem
                                  value={method.value}
                                  className="border-[#d4a853]/50 text-[#d4a853]"
                                />
                                <span className="text-lg">{method.emoji}</span>
                                <span className="text-sm text-[#f0ece4] font-medium">
                                  {method.label}
                                </span>
                              </label>
                            ))}
                          </RadioGroup>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
                          <span className="text-sm text-[#8a8578]">المجموع</span>
                          <span className="text-xl font-bold gold-gradient-text">
                            {formatPrice(cartTotal)} ر.س
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 pt-1">
                          <Button
                            className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-bold text-base py-6 disabled:opacity-60"
                            disabled={isProcessing}
                            onClick={handleConfirm}
                          >
                            {isProcessing ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                                className="h-5 w-5 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full"
                              />
                            ) : (
                              <>
                                تأكيد الطلب
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                              </>
                            )}
                          </Button>
                          <button
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-[#8a8578] hover:text-[#f0ece4] transition-colors py-2"
                          >
                            رجوع
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ═══════════ Step 3: Success ═══════════ */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="relative"
                    >
                      <ConfettiParticles />

                      <div className="p-8 flex flex-col items-center text-center relative z-10">
                        {/* Success Icon */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.15,
                            duration: 0.5,
                            type: 'spring',
                            stiffness: 150,
                          }}
                          className="mb-6"
                        >
                          <div className="h-20 w-20 rounded-full bg-[#d4a853]/15 flex items-center justify-center">
                            <CheckCircle2 className="h-12 w-12 text-[#d4a853]" />
                          </div>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.4 }}
                          className="text-2xl font-bold text-[#f0ece4] mb-2"
                        >
                          تم الطلب بنجاح!
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45, duration: 0.4 }}
                          className="text-sm text-[#8a8578] mb-6 max-w-xs leading-relaxed"
                        >
                          سيتم تحضير طلبك خلال 10-15 دقيقة
                        </motion.p>

                        {/* Order Number */}
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.55, duration: 0.4 }}
                          className="glass-card px-6 py-3 mb-8 border-[#d4a853]/20"
                        >
                          <p className="text-xs text-[#8a8578] mb-0.5">رقم الطلب</p>
                          <p className="text-2xl font-bold gold-gradient-text">
                            {orderNumber}
                          </p>
                        </motion.div>

                        {/* Back to Menu */}
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65, duration: 0.4 }}
                          className="w-full"
                        >
                          <Button
                            className="w-full gold-gradient text-[#0a0a0f] hover:opacity-90 font-bold text-base py-6"
                            onClick={handleBackToMenu}
                          >
                            العودة للقائمة
                            <ArrowRight className="h-4 w-4 mr-2" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}