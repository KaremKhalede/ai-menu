'use client';

import { Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  campaignTemplates,
  segmentLabels,
  type TargetSegment,
  type CampaignTemplateKey,
  type CampaignOffer,
} from '@/lib/crm-engine';
import { WhatsAppPreview } from './WhatsAppPreview';

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campName: string;
  setCampName: (val: string) => void;
  campType: 'whatsapp' | 'push' | 'email';
  setCampType: (val: 'whatsapp' | 'push' | 'email') => void;
  campSegment: TargetSegment;
  setCampSegment: (val: TargetSegment) => void;
  campTemplate: CampaignTemplateKey;
  campMessage: string;
  setCampMessage: (val: string) => void;
  offerType: CampaignOffer['type'];
  setOfferType: (val: CampaignOffer['type']) => void;
  offerValue: string;
  setOfferValue: (val: string) => void;
  offerMinOrder: string;
  setOfferMinOrder: (val: string) => void;
  previewMessage: string;
  onTemplateSelect: (key: CampaignTemplateKey) => void;
  onCreate: () => void;
}

export function CreateCampaignDialog({
  open,
  onOpenChange,
  campName,
  setCampName,
  campType,
  setCampType,
  campSegment,
  setCampSegment,
  campTemplate,
  campMessage,
  setCampMessage,
  offerType,
  setOfferType,
  offerValue,
  setOfferValue,
  offerMinOrder,
  setOfferMinOrder,
  previewMessage,
  onTemplateSelect,
  onCreate,
}: CreateCampaignDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gold-gradient gap-2 text-[#0a0a0f] font-bold rounded-lg h-10 cursor-pointer">
          <Plus className="w-4 h-4" />
          إنشاء حملة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0e0e16] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto text-right" dir="rtl">
        <DialogHeader className="border-b border-white/5 pb-3">
          <DialogTitle className="text-white text-right">إنشاء حملة جديدة</DialogTitle>
          <DialogDescription className="text-gray-400 text-right mt-1">
            صمّم حملتك التسويقية واختر الجمهور المستهدف
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-right">اسم الحملة</Label>
            <Input
              value={campName}
              onChange={(e) => setCampName(e.target.value)}
              placeholder="مثال: عروض نهاية الأسبوع"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Type + Segment row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-right">نوع الحملة</Label>
              <Select value={campType} onValueChange={(v) => setCampType(v as typeof campType)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-white/10">
                  <SelectItem value="whatsapp" className="text-white">واتساب</SelectItem>
                  <SelectItem value="push" className="text-white">إشعارات</SelectItem>
                  <SelectItem value="email" className="text-white">بريد إلكتروني</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-right">الجمهور المستهدف</Label>
              <Select value={campSegment} onValueChange={(v) => setCampSegment(v as TargetSegment)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-white/10">
                  {Object.entries(segmentLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-white">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-right">قالب الرسالة</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(campaignTemplates).map((tpl) => (
                <button
                  key={tpl.key}
                  type="button"
                  onClick={() => onTemplateSelect(tpl.key)}
                  className={`p-3 rounded-lg border text-right transition-all cursor-pointer ${
                    campTemplate === tpl.key
                      ? 'border-[#d4a853] bg-[#d4a853]/10'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                  }`}
                >
                  <p className="text-white text-xs font-medium mb-0.5">{tpl.name}</p>
                  <p className="text-gray-500 text-[10px]">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-right">نص الرسالة</Label>
            <Textarea
              value={campMessage}
              onChange={(e) => setCampMessage(e.target.value)}
              rows={5}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
              dir="rtl"
            />
          </div>

          {/* Offer */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-right">العرض (اختياري)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={offerType} onValueChange={(v) => setOfferType(v as CampaignOffer['type'])}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-white/10">
                  <SelectItem value="percentage" className="text-white">خصم نسبة %</SelectItem>
                  <SelectItem value="fixed" className="text-white">خصم مبلغ ثابت</SelectItem>
                  <SelectItem value="bogo" className="text-white">اشترِ واحصل على واحد مجاناً</SelectItem>
                  <SelectItem value="free_delivery" className="text-white">توصيل مجاني</SelectItem>
                </SelectContent>
              </Select>
              {offerType !== 'bogo' && offerType !== 'free_delivery' && (
                <Input
                  value={offerValue}
                  onChange={(e) => setOfferValue(e.target.value)}
                  placeholder={offerType === 'percentage' ? 'النسبة (مثلاً 20)' : 'المبلغ (مثلاً 15)'}
                  type="number"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              )}
              <Input
                value={offerMinOrder}
                onChange={(e) => setOfferMinOrder(e.target.value)}
                placeholder="الحد الأدنى للطلب (اختياري)"
                type="number"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-right">معاينة الرسالة</Label>
            <WhatsAppPreview message={previewMessage} />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0 border-t border-white/5 pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white"
          >
            إلغاء
          </Button>
          <Button
            onClick={onCreate}
            className="bg-[#d4a853] text-[#0a0a0f] font-bold hover:bg-[#e8c47c] rounded-lg"
          >
            <Send className="w-4 h-4 ml-1" />
            إرسال الحملة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
