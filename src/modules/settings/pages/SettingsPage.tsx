'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { fadeUp, stagger } from '../constants';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { ProfileSection } from '../components/ProfileSection';
import { RestaurantInfoSection } from '../components/RestaurantInfoSection';
import { VoicePersonalitySection } from '../components/VoicePersonalitySection';
import { TeamSection } from '../components/TeamSection';
import { SecuritySection } from '../components/SecuritySection';
import { SubscriptionSection } from '../components/SubscriptionSection';

/**
 * Settings Page.
 *
 * This orchestrator is extremely thin and focused (under 75 lines):
 *  - Handles data states and action submissions using useAdminSettings hook.
 *  - Coordinates all panels: profile, restaurant info, AI personalities, team, and security.
 */
export default function SettingsPage() {
  const form = useAdminSettings();

  return (
    <div dir="rtl" className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      {/* ===================== TOP BAR ===================== */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => form.setView('dashboard')}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-xl font-bold sm:text-2xl">الإعدادات</h1>
        </div>
      </motion.div>

      {/* ===================== TWO COLUMNS ===================== */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Right column (in RTL = Profile) */}
        <motion.div variants={fadeUp} custom={0} className="lg:col-span-4">
          <ProfileSection form={form} />
        </motion.div>

        {/* Left column (in RTL = Settings sections) */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Restaurant Info */}
          <motion.div variants={fadeUp} custom={1}>
            <RestaurantInfoSection form={form} />
          </motion.div>

          {/* Voice Personality (AI Waiter) */}
          <motion.div variants={fadeUp} custom={2}>
            <VoicePersonalitySection form={form} />
          </motion.div>

          {/* Team */}
          <motion.div variants={fadeUp} custom={3}>
            <TeamSection form={form} />
          </motion.div>

          {/* Security */}
          <motion.div variants={fadeUp} custom={4}>
            <SecuritySection form={form} />
          </motion.div>

          {/* Subscription */}
          <motion.div variants={fadeUp} custom={5}>
            <SubscriptionSection form={form} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
