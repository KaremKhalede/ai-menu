'use client';

import { motion } from 'framer-motion';
import { Gift, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { demoCampaigns } from '@/lib/crm-engine';
import { useCampaignForm } from '../hooks/useCampaignForm';
import { CreateCampaignDialog } from './CreateCampaignDialog';
import { statusBadge, fadeUp } from '../constants';
import { formatDate } from '../utils';

export function CampaignsTab() {
  const form = useCampaignForm();

  return (
    <div className="space-y-4 text-right animate-in fade-in duration-200" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          <span className="text-[#d4a853] font-medium">{demoCampaigns.length}</span> حملة
        </p>
        <CreateCampaignDialog
          open={form.dialogOpen}
          onOpenChange={form.setDialogOpen}
          campName={form.campName}
          setCampName={form.setCampName}
          campType={form.campType}
          setCampType={form.setCampType}
          campSegment={form.campSegment}
          setCampSegment={form.setCampSegment}
          campTemplate={form.campTemplate}
          campMessage={form.campMessage}
          setCampMessage={form.setCampMessage}
          offerType={form.offerType}
          setOfferType={form.setOfferType}
          offerValue={form.offerValue}
          setOfferValue={form.setOfferValue}
          offerMinOrder={form.offerMinOrder}
          setOfferMinOrder={form.setOfferMinOrder}
          previewMessage={form.previewMessage}
          onTemplateSelect={form.handleTemplateSelect}
          onCreate={form.handleCreate}
        />
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoCampaigns.map((camp, i) => {
          const st = statusBadge[camp.status] || { label: camp.status, cls: '' };
          const convRate = camp.stats.sent > 0
            ? Math.round((camp.stats.converted / camp.stats.sent) * 100)
            : 0;
          const readRate = camp.stats.sent > 0
            ? Math.round((camp.stats.read / camp.stats.sent) * 100)
            : 0;

          return (
            <motion.div
              key={camp.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              className="glass-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold text-sm">{camp.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={
                        camp.type === 'whatsapp'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : camp.type === 'push'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }
                    >
                      {camp.type === 'whatsapp' ? 'واتساب' : camp.type === 'push' ? 'إشعارات' : 'بريد'}
                    </Badge>
                    <Badge variant="outline" className={st.cls}>{st.label}</Badge>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[#d4a853] font-bold text-lg">{convRate}%</p>
                  <p className="text-gray-500 text-[10px]">معدل التحويل</p>
                </div>
              </div>

              {/* Offer pill */}
              {camp.offer && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Gift className="w-3 h-3 text-[#d4a853]" />
                  {camp.offer.type === 'percentage' && `خصم ${camp.offer.value}%`}
                  {camp.offer.type === 'fixed' && `خصم ${camp.offer.value} ر.س`}
                  {camp.offer.type === 'bogo' && 'اشترِ واحد واحصل على واحد مجاناً'}
                  {camp.offer.type === 'free_delivery' && 'توصيل مجاني'}
                  {camp.offer.minOrder && ` (الحد الأدنى ${camp.offer.minOrder} ر.س)`}
                </div>
              )}

              {/* Stats row */}
              {camp.stats.sent > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-white text-sm font-bold">{camp.stats.sent}</p>
                      <p className="text-gray-500 text-[10px]">مُرسل</p>
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{readRate}%</p>
                      <p className="text-gray-500 text-[10px]">مقروء</p>
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{camp.stats.clicked}</p>
                      <p className="text-gray-500 text-[10px]">نقر</p>
                    </div>
                    <div>
                      <p className="text-[#d4a853] text-sm font-bold">{camp.stats.converted}</p>
                      <p className="text-gray-500 text-[10px]">تحويل</p>
                    </div>
                  </div>
                  {/* Funnel bar */}
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{ width: `${(camp.stats.delivered / camp.stats.sent) * 100}%` }}
                    />
                    <div
                      className="bg-purple-500 transition-all"
                      style={{ width: `${(camp.stats.read / camp.stats.sent) * 100}%` }}
                    />
                    <div
                      className="bg-[#d4a853] transition-all"
                      style={{ width: `${(camp.stats.converted / camp.stats.sent) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {camp.scheduledAt && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Calendar className="w-3 h-3" />
                  مجدوّلة: {formatDate(camp.scheduledAt)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
