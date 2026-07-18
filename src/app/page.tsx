'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from '@/components/landing';
import SmartMenu from '@/components/smart-menu';
import DishDetail from '@/components/dish-detail';
import AIChat from '@/components/ai-chat';
import SmartCart from '@/components/smart-cart';
import Dashboard from '@/components/dashboard';
import MenuEditor from '@/components/menu-editor';
import Checkout from '@/components/checkout';

export default function Home() {
  const { view, setCategories, showCheckout, cart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fetch menu data on mount
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch {
        // If API fails, we use empty state
      } finally {
        setLoaded(true);
      }
    }
    fetchMenu();
  }, [setCategories]);

  // Close cart when view changes
  useEffect(() => {
    setCartOpen(false);
  }, [view]);

  return (
    <div className="min-h-screen bg-background">
      {/* Loading screen */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="gold-gradient-text text-4xl font-black mb-4">
              MenuAI
            </div>
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="voice-wave-bar"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Main content */}
      {loaded && (
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'landing' && <Landing />}
            {view === 'menu' && (
              <SmartMenu
                onCartOpen={() => setCartOpen(true)}
              />
            )}
            {view === 'dashboard' && <Dashboard />}
            {view === 'menu-editor' && <MenuEditor />}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Dish Detail Sheet */}
      {view === 'menu' && <DishDetail />}

      {/* AI Chat Panel */}
      {view === 'menu' && <AIChat />}

      {/* Smart Cart Panel */}
      {view === 'menu' && (
        <SmartCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      )}

      {/* Checkout Modal */}
      {view === 'menu' && <Checkout />}

      {/* Mobile cart FAB - shows when cart has items and on menu view */}
      {view === 'menu' && cart.length > 0 && !cartOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full gold-gradient px-5 py-3 font-bold text-sm shadow-lg md:bottom-6 md:right-6 md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <span>
            {cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(0)} ر.س
          </span>
          <span className="flex size-5 items-center justify-center rounded-full bg-black/20 text-[10px]">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </motion.button>
      )}
    </div>
  );
}