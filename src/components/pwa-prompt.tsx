'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, WifiOff, RefreshCw, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ───────────────── PWA Install Banner ───────────────── */

let deferredPrompt: unknown = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    // Show banner after 5 seconds if the prompt is available
    const timer = setTimeout(() => {
      if (deferredPrompt) {
        setShowBanner(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    const prompt = deferredPrompt as { prompt: () => Promise<void> };
    await prompt.prompt();
    deferredPrompt = null;
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-[#d4a853]/30 bg-[#12121a]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/60"
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 left-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl gold-gradient">
            <Smartphone className="size-6 text-[#0a0a0f]" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground mb-1">
              ثبّت MenuAI على جهازك
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              أضف التطبيق للشاشة الرئيسية لسرعة فائقة والعمل بدون إنترنت
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleInstall}
            className="flex-1 gold-gradient text-sm font-semibold hover:opacity-90 h-10"
          >
            <Download className="size-4 ml-1.5" />
            تثبيت التطبيق
          </Button>
          <Button
            variant="ghost"
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            لاحقاً
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ───────────────── Offline Indicator ───────────────── */

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-600/95 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2"
        >
          <WifiOff className="size-4 text-white" />
          <span className="text-sm font-medium text-white">
            أنت غير متصل — القائمة محفوظة محلياً
          </span>
          <button
            onClick={() => window.location.reload()}
            className="mr-2 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="size-3" />
            إعادة المحاولة
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}