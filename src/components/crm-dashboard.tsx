'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Send,
  BarChart3,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Phone,
  Mail,
  Clock,
  Star,
  AlertTriangle,
  TrendingUp,
  Eye,
  MousePointerClick,
  ShoppingCart,
  MessageCircle,
  Calendar,
  Gift,
  RotateCcw,
  Award,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';
import {
  demoCustomers,
  demoCampaigns,
  campaignTemplates,
  segmentCustomers,
  generateCampaignMessage,
  getCRMAnalytics,
  getCustomerInsights,
  getChurnRiskCustomers,
  segmentLabels,
  type Customer,
  type Campaign,
  type TargetSegment,
  type CampaignTemplateKey,
  type CampaignOffer,
} from '@/lib/crm-engine';

// ========== Helpers ==========

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35 },
  }),
};

const segmentColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  repeat: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
  high_value: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low_value: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const segmentDotColors: Record<string, string> = {
  new: 'bg-blue-500',
  repeat: 'bg-emerald-500',
  inactive: 'bg-red-500',
  high_value: 'bg-yellow-500',
  low_value: 'bg-gray-500',
};

const statusBadge: Record<string, { label: string; cls: string }> = {
  draft: { label: 'مسودة', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  scheduled: { label: 'مجدوّلة', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  sent: { label: 'مرسلة', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'مكتملة', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getCustomerSegmentBadge(c: Customer): { label: string; cls: string } {
  if (c.tags.includes('high_value')) return { label: 'قيمة عالية', cls: segmentColors.high_value };
  if (c.tags.includes('inactive')) return { label: 'غير نشط', cls: segmentColors.inactive };
  if (c.tags.includes('new')) return { label: 'جديد', cls: segmentColors.new };
  if (c.tags.includes('repeat')) return { label: 'متكرر', cls: segmentColors.repeat };
  return { label: 'قيمة منخفضة', cls: segmentColors.low_value };
}

// ========== WhatsApp Preview ==========

function WhatsAppPreview({ message }: { message: string }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0b141a] shadow-xl max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#d4a853]/20 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-[#d4a853]" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">مطعم الذهبي</p>
          <p className="text-gray-400 text-xs">متصل الآن</p>
        </div>
      </div>
      {/* Chat area */}
      <div className="px-3 py-4 space-y-2 min-h-[120px] flex items-end justify-start">
        <div className="bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 max-w-[85%] shadow">
          <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
            {message || 'اكتب رسالتك هنا...'}
          </p>
          <p className="text-[#8696a0] text-[10px] text-left mt-1">11:30 ص</p>
        </div>
      </div>
      {/* Input bar */}
      <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-[#8696a0] text-xs">
          اكتب رسالة
        </div>
        <div className="w-8 h-8 rounded-full bg-[#d4a853] flex items-center justify-center">
          <Send className="w-3.5 h-3.5 text-[#0a0a0f]" />
        </div>
      </div>
    </div>
  );
}

// ========== KPI Card ==========

function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-[#d4a853]/10 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-[#d4a853]" />
        </div>
        <span className="text-gray-400 text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

// ========== TAB 1 – Customers ==========

function CustomersTab() {
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = segmentCustomers(demoCustomers, segmentFilter as TargetSegment);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.includes(q) ||
          c.phone.includes(q) ||
          c.favoriteDishes.some((d) => d.includes(q))
      );
    }
    return list;
  }, [search, segmentFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="ابحث بالاسم أو الجوال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 glass-card border-white/5 bg-transparent text-white placeholder:text-gray-500"
          />
        </div>
        <Select
          value={segmentFilter}
          onValueChange={setSegmentFilter}
        >
          <SelectTrigger className="w-full sm:w-[200px] glass-card border-white/5 bg-transparent text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#12121a] border-white/10">
            {Object.entries(segmentLabels).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-white">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customer count */}
      <p className="text-gray-500 text-sm">
        عرض <span className="text-[#d4a853] font-medium">{filtered.length}</span> عميل
      </p>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 text-right">العميل</TableHead>
              <TableHead className="text-gray-400 text-right">الجوال</TableHead>
              <TableHead className="text-gray-400 text-right">الطلبات</TableHead>
              <TableHead className="text-gray-400 text-right">المصروف</TableHead>
              <TableHead className="text-gray-400 text-right">آخر طلب</TableHead>
              <TableHead className="text-gray-400 text-right">الشريحة</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c, i) => {
              const seg = getCustomerSegmentBadge(c);
              const isExpanded = expandedId === c.id;
              return (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
                  <TableCell className="text-white font-medium text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#d4a853]/15 flex items-center justify-center text-[#d4a853] text-xs font-bold">
                        {c.name.charAt(0)}
                      </div>
                      {c.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-right font-mono text-sm">{c.phone}</TableCell>
                  <TableCell className="text-white text-right">{c.totalOrders}</TableCell>
                  <TableCell className="text-white text-right">{c.totalSpent.toLocaleString('ar-SA')} ر.س</TableCell>
                  <TableCell className="text-gray-400 text-right text-sm">{formatDate(c.lastOrderDate)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={seg.cls}>{seg.label}</Badge>
                  </TableCell>
                  <TableCell>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>

        {/* Expanded detail */}
        <AnimatePresence>
          {expandedId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <CustomerDetail customerId={expandedId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CustomerDetail({ customerId }: { customerId: string }) {
  const insight = getCustomerInsights(customerId);
  if (!insight) return null;
  const { customer } = insight;

  return (
    <div className="border-t border-white/5 p-4 bg-white/[0.01] space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">متوسط قيمة الطلب</p>
          <p className="text-white font-bold">{insight.avgOrderValue} ر.س</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">أيام منذ آخر طلب</p>
          <p className={`font-bold ${insight.daysSinceLastOrder > 30 ? 'text-red-400' : 'text-white'}`}>
            {insight.daysSinceLastOrder} يوم
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-xs">مستوى خطر الفقدان</p>
          <Badge
            variant="outline"
            className={
              insight.churnRiskLevel === 'مرتفع'
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : insight.churnRiskLevel === 'متوسط'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }
          >
            {insight.churnRiskLevel}
          </Badge>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-xs mb-2">الأطباق المفضّلة</p>
        <div className="flex flex-wrap gap-2">
          {customer.favoriteDishes.map((dish) => (
            <Badge key={dish} variant="outline" className="bg-[#d4a853]/10 text-[#d4a853] border-[#d4a853]/20">
              {dish}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#d4a853]/5 border border-[#d4a853]/10">
        <Sparkles className="w-4 h-4 text-[#d4a853] mt-0.5 shrink-0" />
        <p className="text-gray-300 text-sm">{insight.suggestedAction}</p>
      </div>
    </div>
  );
}

// ========== TAB 2 – Campaigns ==========

function CampaignsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Campaign form state
  const [campName, setCampName] = useState('');
  const [campType, setCampType] = useState<'whatsapp' | 'push' | 'email'>('whatsapp');
  const [campSegment, setCampSegment] = useState<TargetSegment>('all');
  const [campTemplate, setCampTemplate] = useState<CampaignTemplateKey>('weekly_specials');
  const [campMessage, setCampMessage] = useState('');
  const [offerType, setOfferType] = useState<CampaignOffer['type']>('percentage');
  const [offerValue, setOfferValue] = useState('');
  const [offerMinOrder, setOfferMinOrder] = useState('');

  const previewMessage = useMemo(() => {
    if (!campMessage.trim()) return '';
    return campMessage;
  }, [campMessage]);

  function handleTemplateSelect(key: CampaignTemplateKey) {
    setCampTemplate(key);
    const tpl = campaignTemplates[key];
    const seg = tpl.defaultSegment;
    setCampSegment(seg);
    setCampMessage(tpl.defaultMessage);
  }

  function handleCreate() {
    setDialogOpen(false);
    // Reset
    setCampName('');
    setCampMessage('');
    setOfferValue('');
    setOfferMinOrder('');
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          <span className="text-[#d4a853] font-medium">{demoCampaigns.length}</span> حملة
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gold-gradient gap-2 text-[#0a0a0f] font-bold rounded-lg">
              <Plus className="w-4 h-4" />
              إنشاء حملة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0e0e16] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-right">إنشاء حملة جديدة</DialogTitle>
              <DialogDescription className="text-gray-400 text-right">
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
                      onClick={() => handleTemplateSelect(tpl.key)}
                      className={`p-3 rounded-lg border text-right transition-all ${
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

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-[#d4a853] text-[#0a0a0f] font-bold hover:bg-[#e8c47c] rounded-lg"
              >
                <Send className="w-4 h-4 ml-1" />
                إرسال الحملة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoCampaigns.map((camp, i) => {
          const st = statusBadge[camp.status];
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

// ========== TAB 3 – Analytics ==========

const pieChartConfig: ChartConfig = {
  new: { label: 'جدد', color: '#3b82f6' },
  repeat: { label: 'متكررين', color: '#10b981' },
  inactive: { label: 'غير نشطين', color: '#ef4444' },
  high_value: { label: 'قيمة عالية', color: '#d4a853' },
};

const barChartConfig: ChartConfig = {
  revenue: { label: 'الإيرادات (ر.س)', color: '#d4a853' },
};

function AnalyticsTab() {
  const analytics = useMemo(() => getCRMAnalytics(), []);

  // Pie data
  const pieData = [
    { name: 'new', value: demoCustomers.filter((c) => c.tags.includes('new')).length },
    { name: 'repeat', value: demoCustomers.filter((c) => c.tags.includes('repeat')).length },
    { name: 'inactive', value: demoCustomers.filter((c) => c.tags.includes('inactive')).length },
    { name: 'high_value', value: demoCustomers.filter((c) => c.tags.includes('high_value')).length },
  ];

  // Bar data – revenue by segment
  const barData = [
    {
      segment: 'جدد',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('new'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
    {
      segment: 'متكررين',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('repeat') && !c.tags.includes('high_value'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
    {
      segment: 'غير نشطين',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('inactive'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
    {
      segment: 'قيمة عالية',
      revenue: demoCustomers
        .filter((c) => c.tags.includes('high_value'))
        .reduce((s, c) => s + c.totalSpent, 0),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          icon={Users}
          label="إجمالي العملاء"
          value={analytics.totalCustomers}
          sub={`${analytics.newCustomersThisMonth} عميل جديد هذا الشهر`}
          delay={0}
        />
        <KPICard
          icon={UserCheck}
          label="معدل الاحتفاظ"
          value={`${analytics.retentionRate}%`}
          sub="خلال آخر 30 يوم"
          delay={1}
        />
        <KPICard
          icon={TrendingUp}
          label="متوسط قيمة العميل"
          value={`${analytics.customerLifetimeValue} ر.س`}
          sub="عمر العميل الافتراضي"
          delay={2}
        />
        <KPICard
          icon={ShoppingCart}
          label="متوسط الطلبات/عميل"
          value={analytics.avgOrdersPerCustomer}
          sub={`${analytics.churnRisk.length} عميل بخطر الفقدان`}
          delay={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie – Customer Distribution */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="glass-card p-4"
        >
          <h3 className="text-white font-semibold mb-4 text-sm">توزيع العملاء حسب الشريحة</h3>
          <ChartContainer config={pieChartConfig} className="mx-auto h-[250px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={pieChartConfig[entry.name as keyof typeof pieChartConfig]?.color}
                    className="stroke-transparent"
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </motion.div>

        {/* Bar – Revenue by segment */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="glass-card p-4"
        >
          <h3 className="text-white font-semibold mb-4 text-sm">الإيرادات حسب الشريحة</h3>
          <ChartContainer config={barChartConfig} className="h-[250px] w-full">
            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="segment"
                width={80}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} fill="#d4a853" />
            </BarChart>
          </ChartContainer>
        </motion.div>
      </div>

      {/* Campaign Performance Table */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white font-semibold text-sm">أداء الحملات</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 text-right">الحملة</TableHead>
              <TableHead className="text-gray-400 text-right">مُرسل</TableHead>
              <TableHead className="text-gray-400 text-right">تم التوصيل</TableHead>
              <TableHead className="text-gray-400 text-right">مقروء</TableHead>
              <TableHead className="text-gray-400 text-right">نقر</TableHead>
              <TableHead className="text-gray-400 text-right">تحويل</TableHead>
              <TableHead className="text-gray-400 text-right">العائد</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.campaignROI.map((row, i) => (
              <motion.tr
                key={row.campaignName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="text-white text-right font-medium">{row.campaignName}</TableCell>
                <TableCell className="text-gray-300 text-right">{row.sent}</TableCell>
                <TableCell className="text-gray-300 text-right">
                  {Math.round(row.sent * 0.95)}
                </TableCell>
                <TableCell className="text-gray-300 text-right">
                  {Math.round(row.sent * 0.72)}
                </TableCell>
                <TableCell className="text-gray-300 text-right">
                  {Math.round(row.sent * 0.43)}
                </TableCell>
                <TableCell className="text-[#d4a853] text-right font-bold">{row.converted}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      row.roi > 200
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : row.roi > 100
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {row.roi}%
                  </Badge>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

// ========== Main Dashboard ==========

export default function CRMDashboard() {
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
              {getChurnRiskCustomers().length} عملاء لم يطلبوا خلال آخر 30 يوم. ننصح بإرسال حملة إعادة تنشيط.
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 w-full sm:w-auto">
            <TabsTrigger value="customers" className="gap-2 data-[state=active]:bg-[#d4a853]/15 data-[state=active]:text-[#d4a853] text-gray-400">
              <Users className="w-4 h-4" />
              العملاء
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2 data-[state=active]:bg-[#d4a853]/15 data-[state=active]:text-[#d4a853] text-gray-400">
              <Send className="w-4 h-4" />
              الحملات
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-[#d4a853]/15 data-[state=active]:text-[#d4a853] text-gray-400">
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