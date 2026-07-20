'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { segmentLabels } from '@/lib/crm-engine';
import { useCustomers } from '../hooks/useCustomers';
import { CustomerDetail } from './CustomerDetail';
import { formatDate, getCustomerSegmentBadge } from '../utils';

export function CustomersTab() {
  const {
    search,
    setSearch,
    segmentFilter,
    setSegmentFilter,
    expandedId,
    setExpandedId,
    customers,
  } = useCustomers();

  return (
    <div className="space-y-4 text-right animate-in fade-in duration-200" dir="rtl">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="ابحث بالاسم أو الجوال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 glass-card border-white/5 bg-transparent text-white placeholder:text-gray-500 h-10"
          />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-full sm:w-[200px] glass-card border-white/5 bg-transparent text-white h-10">
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
        عرض <span className="text-[#d4a853] font-medium">{customers.length}</span> عميل
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
            {customers.map((c, i) => {
              const seg = getCustomerSegmentBadge(c);
              const isExpanded = expandedId === c.id;
              return (
                <TableRow
                  key={c.id}
                  className="border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
                  <TableCell className="text-white font-medium text-right">
                    <div className="flex items-center gap-2 justify-start">
                      <div className="w-7 h-7 rounded-full bg-[#d4a853]/15 flex items-center justify-center text-[#d4a853] text-xs font-bold shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="truncate">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-right font-mono text-sm">
                    {c.phone}
                  </TableCell>
                  <TableCell className="text-white text-right">{c.totalOrders}</TableCell>
                  <TableCell className="text-white text-right">
                    {c.totalSpent.toLocaleString('ar-SA')} ر.س
                  </TableCell>
                  <TableCell className="text-gray-400 text-right text-sm">
                    {formatDate(c.lastOrderDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={seg.cls}>
                      {seg.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </TableCell>
                </TableRow>
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
              className="overflow-hidden bg-white/[0.01]"
            >
              <CustomerDetail customerId={expandedId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
