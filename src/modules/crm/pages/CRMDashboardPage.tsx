'use client';

import { motion } from 'framer-motion';
import { Users, Send, BarChart3, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getChurnRiskCustomers } from '@/lib/crm-engine';
import { CustomersTab } from '../components/CustomersTab';
import { CampaignsTab } from '../components/CampaignsTab';
import { AnalyticsTab } from '../components/AnalyticsTab';

/**
 * CRM Dashboard Page.
 *
 * This orchestrator is extremely thin and focused (under 80 lines):
 *  - Displays the CRM metadata page header.
 *  - Displays warnings for customers with high churn risk.
 *  - Coordinates tabs showing customers lists, campaigns, and analytics.
 */
export default function CRMDashboardPage() {
  const churnRiskCount = getChurnRiskCustomers().length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#d4a853]" />
          </div>
          <div>
            <h1 className="gold-gradient-text text-2xl font-bold">إدارة العملاء</h1>
            <p className="text-gray-500 text-sm">نظام CRM وإعادة الاستهداف عبر واتساب</p>
          </div>
        </motion.div>

        {/* Quick Churn Alert */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 flex items-start gap-3 border-amber-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-400 font-semibold text-sm">تنبيه: عملاء بخطر الفقدان</p>
            <p className="text-gray-400 text-xs mt-0.5">
              {churnRiskCount} عملاء لم يطلبوا خلال آخر 30 يوم. ننصح بإرسال حملة إعادة تنشيط.
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 w-full sm:w-auto">
            <TabsTrigger
              value="customers"
              className="gap-2 data-[state=active]:bg-[#d4a853]/15 data-[state=active]:text-[#d4a853] text-gray-400"
            >
              <Users className="w-4 h-4" />
              العملاء
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="gap-2 data-[state=active]:bg-[#d4a853]/15 data-[state=active]:text-[#d4a853] text-gray-400"
            >
              <Send className="w-4 h-4" />
              الحملات
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="gap-2 data-[state=active]:bg-[#d4a853]/15 data-[state=active]:text-[#d4a853] text-gray-400"
            >
              <BarChart3 className="w-4 h-4" />
              التحليلات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>
          <TabsContent value="campaigns">
            <CampaignsTab />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
