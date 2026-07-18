'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import type { ChatMessage, Dish } from '@/lib/types';
// Local fallback kept for offline mode
import { getAIResponse } from '@/lib/ai-responses';
import { trackSuggestion } from '@/lib/ai-revenue-engine';
import { getGreeting } from '@/lib/voice-personality';

export default function AIChat() {
  const {
    isChatOpen,
    setChatOpen,
    chatMessages,
    addChatMessage,
    selectedDish,
    setSelectedDish,
    categories,
    cart,
    addToCart,
    personalityMode,
    addAISuggestion,
  } = useStore();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const micTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build a map of all dish names → dish objects for clickable mentions
  const dishNameEntries = useMemo(() => {
    const entries: [string, Dish][] = [];
    for (const cat of categories) {
      for (const dish of cat.dishes) {
        entries.push([dish.name, dish]);
      }
    }
    return entries;
  }, [categories]);

  // Add welcome message on first open (uses current personality greeting)
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      addChatMessage({
        role: 'assistant',
        content: getGreeting(personalityMode),
      });
    }
  }, [isChatOpen, chatMessages.length, addChatMessage, personalityMode]);

  // Focus input when panel opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Render AI message content with clickable dish names
  const renderAIContent = (content: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const [name, dish] of dishNameEntries) {
      const idx = content.indexOf(name, lastIndex);
      if (idx !== -1) {
        // Push text before the dish name
        if (idx > lastIndex) {
          parts.push(
            <span key={`text-${lastIndex}`}>{content.slice(lastIndex, idx)}</span>
          );
        }
        // Push clickable dish name
        parts.push(
          <button
            key={`dish-${dish.id}`}
            onClick={() => {
              setSelectedDish(dish);
              setChatOpen(false);
            }}
            className="text-[#d4a853] underline underline-offset-2 hover:text-[#e8c47c] transition-colors font-medium"
          >
            {name}
          </button>
        );
        lastIndex = idx + name.length;
      }
    }

    // Push remaining text
    if (lastIndex < content.length) {
      parts.push(<span key={`text-${lastIndex}`}>{content.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : content;
  };

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || isTyping) return;

    setInput('');
    addChatMessage({ role: 'user', content: text });
    setIsTyping(true);

    try {
      // Call real AI API
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          dishContext: selectedDish ? {
            name: selectedDish.name,
            description: selectedDish.description,
            price: selectedDish.price,
          } : undefined,
          cartItems: cart.map(item => ({
            name: item.dish.name,
            totalPrice: item.totalPrice,
          })),
          history: chatMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsTyping(false);
        addChatMessage({ role: 'assistant', content: data.response });

        // AI Revenue Engine: track dish mentions in AI response
        trackAIResponse(data.response);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback to local AI responses if API fails
      await new Promise((resolve) => setTimeout(resolve, 800));
      const response = getAIResponse(text, selectedDish, cart);
      setIsTyping(false);
      addChatMessage({ role: 'assistant', content: response });

      // Track even fallback responses
      trackAIResponse(response);
    }

    // Clear selected dish after AI responds
    if (selectedDish) {
      setSelectedDish(null);
    }
  };

  // Track dish names mentioned in AI responses for revenue engine
  const trackAIResponse = (response: string) => {
    const allDishes = categories.flatMap(c => c.dishes);
    for (const dish of allDishes) {
      if (response.includes(dish.name)) {
        // Found a dish mention — track as AI suggestion
        const suggestionId = crypto.randomUUID();
        addAISuggestion({
          sessionId: `session_${Date.now()}`,
          dishId: dish.id,
          dishName: dish.name,
          context: 'chat',
          message: response.slice(0, 200),
        });
        // Also persist to offline storage
        trackSuggestion(dish.id, dish.name, 'chat', response.slice(0, 200));
        break; // Track first mention only
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      if (micTimeoutRef.current) {
        clearTimeout(micTimeoutRef.current);
        micTimeoutRef.current = null;
      }
    } else {
      // Start listening
      setIsListening(true);
      micTimeoutRef.current = setTimeout(() => {
        setIsListening(false);
        handleSend('ماذا تنصحني؟');
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setChatOpen(false)}
          />

          {/* Panel — slides in from the left (RTL start side) */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 start-0 bottom-0 z-50 w-full md:w-[380px] bg-[#12121a] border-e-2 border-[#d4a853]/40 rounded-e-2xl shadow-2xl shadow-black/60 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#0a0a0f]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    ليو - النادل الذكي
                  </h2>
                  <span className="text-xs text-[#d4a853]">متصل الآن</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {chatMessages.map((msg: ChatMessage) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                      msg.role === 'user'
                        ? 'gold-gradient'
                        : 'bg-white/10 border border-white/10'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-[#0a0a0f]" />
                    ) : (
                      <Bot className="w-4 h-4 text-[#d4a853]" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'gold-gradient text-[#0a0a0f] rounded-ee-sm'
                        : 'glass-card text-foreground rounded-es-sm'
                    }`}
                  >
                    {msg.role === 'assistant'
                      ? renderAIContent(msg.content)
                      : msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-[#d4a853]" />
                  </div>
                  <div className="glass-card px-4 py-3 rounded-2xl rounded-es-sm flex items-center gap-1.5">
                    <div className="voice-wave-bar" />
                    <div className="voice-wave-bar" />
                    <div className="voice-wave-bar" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-white/[0.08] bg-[#0e0e16]/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب رسالتك..."
                  dir="rtl"
                  className="flex-1 h-11 px-4 bg-white/[0.06] border border-white/[0.08] rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#d4a853]/50 focus:border-[#d4a853]/50 transition-all"
                />

                {/* Mic Button */}
                <div className="relative">
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-60" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMic}
                    className={`w-11 h-11 rounded-full flex-shrink-0 transition-colors ${
                      isListening
                        ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Send Button */}
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-11 h-11 rounded-full flex-shrink-0 gold-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-0"
                >
                  <Send className="w-5 h-5 text-[#0a0a0f] rotate-180" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}