// ─── محرّك إيرادات الذكاء الاصطناعي ──────────────────────────────────────────
// AI Revenue Engine — يتتبع تحويلات اقتراحات الذكاء الاصطناعي إلى مبيعات فعلية
// ويستخدم هذه البيانات لتحسين الاقتراحات المستقبلية

import type { AISuggestion, RevenueEvent } from './types';
import { trackAISuggestion as dbTrackSuggestion } from './offline-db';

// ─── الأنواع الداخلية ──────────────────────────────────────────────────────

export interface AISuggestionResult {
  suggestionId: string;
  converted: boolean;
  convertedAt?: Date;
  orderValue?: number;
}

export interface AIRevenueMetrics {
  totalSuggestions: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenueFromAI: number;
  avgOrderValueWithAI: number;
  avgOrderValueWithoutAI: number;
  aiLiftPercentage: number;
  topConvertingDishes: Array<{
    dishName: string;
    suggestions: number;
    conversions: number;
    revenue: number;
  }>;
  suggestionByContext: Record<string, { suggestions: number; conversions: number }>;
  hourlyPerformance: Array<{ hour: number; suggestions: number; conversions: number }>;
}

export interface SuggestionStrategy {
  bestContext: 'chat' | 'cart_upsell' | 'menu_featured';
  bestHourRange: string;
  bestDishCategories: string[];
  confidenceScore: number;
  reason: string;
}

type SuggestionContext = 'chat' | 'cart_upsell' | 'menu_featured';

// ─── الثوابت ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'menuai-ai-suggestions';
const EVENTS_KEY = 'menuai-revenue-events';
const SESSION_KEY = 'menuai-session-id';

// ─── أدوات مساعدة ──────────────────────────────────────────────────────────

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}

// ─── التخزين المحلي (بديل IndexedDB) ──────────────────────────────────────

function getLocalSuggestions(): AISuggestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).map((s: AISuggestion) => ({
      ...s,
      suggestedAt: new Date(s.suggestedAt),
      convertedAt: s.convertedAt ? new Date(s.convertedAt) : undefined,
    })) : [];
  } catch {
    return [];
  }
}

function saveLocalSuggestions(suggestions: AISuggestion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
  } catch {
    // فشل التخزين — تجاهل بصمت
  }
}

function getLocalEvents(): RevenueEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw).map((e: RevenueEvent) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    })) : [];
  } catch {
    return [];
  }
}

function saveLocalEvents(events: RevenueEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    // فشل التخزين — تجاهل بصمت
  }
}

// ─── جلب جميع الاقتراحات من جميع المصادر ─────────────────────────────────

async function getAllSuggestions(): Promise<AISuggestion[]> {
  const local = getLocalSuggestions();

  if (isIndexedDBAvailable()) {
    try {
      const db = await openAISuggestionsDB();
      const tx = db.transaction('ai-suggestions', 'readonly');
      const store = tx.objectStore('ai-suggestions');
      const dbResults = await new Promise<unknown[]>((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      
      db.close();

      const dbSuggestions = dbResults.map((r) => ({
        ...(r as Record<string, unknown>),
        suggestedAt: new Date((r as Record<string, unknown>).suggestedAt as string),
        convertedAt: (r as Record<string, unknown>).convertedAt ? new Date((r as Record<string, unknown>).convertedAt as string) : undefined,
      })) as AISuggestion[];

      // دمج بدون تكرار
      const map = new Map<string, AISuggestion>();
      for (const s of [...dbSuggestions, ...local]) {
        map.set(s.id, s);
      }
      return Array.from(map.values());
    } catch {
      return local;
    }
  }

  return local;
}

function openAISuggestionsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('menuai-offline', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('ai-suggestions')) {
        db.createObjectStore('ai-suggestions', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ─── الوظائف الرئيسية ─────────────────────────────────────────────────────

/**
 * تتبّع اقتراح جديد من الذكاء الاصطناعي
 * يحفظ في IndexedDB و localStorage ويُرسل للخادم
 */
export async function trackSuggestion(
  dishId: string,
  dishName: string,
  context: SuggestionContext,
  message: string,
): Promise<string> {
  const id = crypto.randomUUID();
  const sessionId = getSessionId();
  const now = new Date();

  const suggestion: AISuggestion = {
    id,
    sessionId,
    dishId,
    dishName,
    suggestedAt: now,
    context,
    message,
  };

  // حفظ في localStorage كبديل
  const existing = getLocalSuggestions();
  existing.push(suggestion);
  saveLocalSuggestions(existing);

  // حفظ في IndexedDB
  if (isIndexedDBAvailable()) {
    try {
      await dbTrackSuggestion({
        ...suggestion,
        suggestedAt: now.toISOString(),
        convertedAt: undefined,
      });
    } catch {
      // IndexedDB غير متاح — localStorage يكفي
    }
  }

  // إرسال للخادم
  try {
    await fetch('/api/analytics/ai-suggestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dishId,
        dishName,
        context,
        message,
        sessionId,
      }),
    });
  } catch {
    // غير متصل بالإنترنت — سيتم المزامنة لاحقاً
  }

  return id;
}

/**
 * تتبّع تحويل (شراء فعلي) لاقتراح الذكاء الاصطناعي
 */
export async function trackConversion(
  suggestionId: string,
  orderValue?: number,
): Promise<void> {
  const now = new Date();

  // تحديث في localStorage
  const suggestions = getLocalSuggestions();
  const idx = suggestions.findIndex((s) => s.id === suggestionId);
  if (idx >= 0) {
    suggestions[idx] = {
      ...suggestions[idx],
      converted: true,
      convertedAt: now,
      orderValue,
    };
    saveLocalSuggestions(suggestions);
  }

  // تحديث في IndexedDB
  if (isIndexedDBAvailable()) {
    try {
      const db = await openAISuggestionsDB();
      const tx = db.transaction('ai-suggestions', 'readwrite');
      const store = tx.objectStore('ai-suggestions');
      const existing = await new Promise<AISuggestion | undefined>((resolve, reject) => {
        const req = store.get(suggestionId);
        req.onsuccess = () => resolve(req.result as AISuggestion | undefined);
        req.onerror = () => reject(req.error);
      });
      if (existing) {
        store.put({
          ...existing,
          converted: true,
          convertedAt: now.toISOString(),
          orderValue,
        });
      }
      
      db.close();
    } catch {
      // تجاهل
    }
  }

  // إرسال للخادم
  try {
    await fetch('/api/analytics/ai-suggestion', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suggestionId,
        converted: true,
        orderValue,
      }),
    });
  } catch {
    // غير متصل — سيتم المزامنة لاحقاً
  }

  // حفظ حدث الإيرادات
  const event: RevenueEvent = {
    type: 'ai_conversion',
    value: orderValue,
    timestamp: now,
    metadata: { suggestionId },
  };
  const events = getLocalEvents();
  events.push(event);
  saveLocalEvents(events);
}

/**
 * تتبّع رفض أو تجاهل اقتراح الذكاء الاصطناعي
 */
export async function trackNoConversion(suggestionId: string): Promise<void> {
  // تحديث في localStorage
  const suggestions = getLocalSuggestions();
  const idx = suggestions.findIndex((s) => s.id === suggestionId);
  if (idx >= 0) {
    suggestions[idx] = {
      ...suggestions[idx],
      converted: false,
    };
    saveLocalSuggestions(suggestions);
  }

  // تحديث في IndexedDB
  if (isIndexedDBAvailable()) {
    try {
      const db = await openAISuggestionsDB();
      const tx = db.transaction('ai-suggestions', 'readwrite');
      const store = tx.objectStore('ai-suggestions');
      const existing = await new Promise<AISuggestion | undefined>((resolve, reject) => {
        const req = store.get(suggestionId);
        req.onsuccess = () => resolve(req.result as AISuggestion | undefined);
        req.onerror = () => reject(req.error);
      });
      if (existing) {
        store.put({
          ...existing,
          converted: false,
        });
      }
      
      db.close();
    } catch {
      // تجاهل
    }
  }

  // إرسال للخادم
  try {
    await fetch('/api/analytics/ai-suggestion', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suggestionId,
        converted: false,
      }),
    });
  } catch {
    // غير متصل
  }

  // حفظ حدث الرفض
  const event: RevenueEvent = {
    type: 'ai_dismiss',
    timestamp: new Date(),
    metadata: { suggestionId },
  };
  const events = getLocalEvents();
  events.push(event);
  saveLocalEvents(events);
}

/**
 * حساب جميع مؤشرات أداء إيرادات الذكاء الاصطناعي
 */
export async function getRevenueMetrics(): Promise<AIRevenueMetrics> {
  const suggestions = await getAllSuggestions();
  const events = getLocalEvents();

  const totalSuggestions = suggestions.length;
  const conversions = suggestions.filter((s) => s.converted === true);
  const totalConversions = conversions.length;
  const conversionRate = totalSuggestions > 0 ? totalConversions / totalSuggestions : 0;

  const totalRevenueFromAI = conversions.reduce((sum, s) => sum + (s.orderValue ?? 0), 0);

  const aiOrderValues = conversions.map((s) => s.orderValue ?? 0).filter((v) => v > 0);
  const avgOrderValueWithAI = aiOrderValues.length > 0
    ? aiOrderValues.reduce((a, b) => a + b, 0) / aiOrderValues.length
    : 0;

  // حساب متوسط قيمة الطلب بدون الذكاء الاصطناعي من أحداث الطلب
  const checkoutEvents = events.filter((e) => e.type === 'checkout');
  const nonAIOrderValues = checkoutEvents
    .filter((e) => !e.metadata?.aiSuggestionId)
    .map((e) => e.value ?? 0)
    .filter((v) => v > 0);
  const avgOrderValueWithoutAI = nonAIOrderValues.length > 0
    ? nonAIOrderValues.reduce((a, b) => a + b, 0) / nonAIOrderValues.length
    : avgOrderValueWithAI * 0.8; // تقدير افتراضي إذا لم تتوفر بيانات

  const aiLiftPercentage = avgOrderValueWithoutAI > 0
    ? ((avgOrderValueWithAI - avgOrderValueWithoutAI) / avgOrderValueWithoutAI) * 100
    : 0;

  // أفضل الأطباق تحويلاً
  const dishMap = new Map<string, { dishName: string; suggestions: number; conversions: number; revenue: number }>();
  for (const s of suggestions) {
    const key = s.dishId;
    if (!dishMap.has(key)) {
      dishMap.set(key, { dishName: s.dishName, suggestions: 0, conversions: 0, revenue: 0 });
    }
    const entry = dishMap.get(key)!;
    entry.suggestions++;
    if (s.converted) {
      entry.conversions++;
      entry.revenue += s.orderValue ?? 0;
    }
  }
  const topConvertingDishes = Array.from(dishMap.values())
    .sort((a, b) => b.revenue - a.revenue || b.conversions - a.conversions)
    .slice(0, 10);

  // الأداء حسب السياق
  const suggestionByContext: Record<string, { suggestions: number; conversions: number }> = {};
  const contexts: SuggestionContext[] = ['chat', 'cart_upsell', 'menu_featured'];
  for (const ctx of contexts) {
    const ctxSuggestions = suggestions.filter((s) => s.context === ctx);
    const ctxConversions = ctxSuggestions.filter((s) => s.converted);
    suggestionByContext[ctx] = {
      suggestions: ctxSuggestions.length,
      conversions: ctxConversions.length,
    };
  }

  // الأداء حسب الساعة
  const hourlyMap = new Map<number, { suggestions: number; conversions: number }>();
  for (let h = 0; h < 24; h++) {
    hourlyMap.set(h, { suggestions: 0, conversions: 0 });
  }
  for (const s of suggestions) {
    const hour = s.suggestedAt instanceof Date ? s.suggestedAt.getHours() : new Date(s.suggestedAt).getHours();
    const entry = hourlyMap.get(hour)!;
    entry.suggestions++;
    if (s.converted) entry.conversions++;
  }
  const hourlyPerformance = Array.from(hourlyMap.entries()).map(([hour, data]) => ({
    hour,
    ...data,
  }));

  return {
    totalSuggestions,
    totalConversions,
    conversionRate,
    totalRevenueFromAI,
    avgOrderValueWithAI,
    avgOrderValueWithoutAI,
    aiLiftPercentage,
    topConvertingDishes,
    suggestionByContext,
    hourlyPerformance,
  };
}

/**
 * تحليلات ذاتية لتحسين الاقتراحات — تعيد نصائح باللغة العربية
 */
export async function getSelfImprovementInsights(): Promise<string[]> {
  const suggestions = await getAllSuggestions();
  const insights: string[] = [];

  if (suggestions.length === 0) {
    return ['لا توجد بيانات كافية بعد. استمر في استخدام الاقتراحات لجمع البيانات وتحسين الأداء.'];
  }

  const totalConversions = suggestions.filter((s) => s.converted === true).length;
  const totalDismissals = suggestions.filter((s) => s.converted === false).length;
  const totalPending = suggestions.filter((s) => s.converted === undefined).length;
  const conversionRate = (totalConversions / suggestions.length) * 100;

  // تحليل معدل التحويل العام
  if (conversionRate < 10) {
    insights.push(
      `معدل التحويل منخفض (${conversionRate.toFixed(1)}%). يُنصح بتحسين صياغة الرسائل الإعلانية وجعلها أكثر جاذبية ووضوحاً.`,
    );
  } else if (conversionRate >= 30) {
    insights.push(
      `معدل التحويل ممتاز (${conversionRate.toFixed(1)}%)! استمر في نفس النهج واعتمده كاستراتيجية أساسية.`,
    );
  } else {
    insights.push(
      `معدل التحويل جيد (${conversionRate.toFixed(1)}%). يمكن تحسينه عبر تخصيص الاقتراحات حسب تفضيلات العميل السابقة.`,
    );
  }

  // تحليل الأداء حسب السياق
  const contextMap: Record<string, { total: number; converted: number }> = {};
  const contextNames: Record<string, string> = {
    chat: 'المحادثة الذكية',
    cart_upsell: 'البيع الإضافي في السلة',
    menu_featured: 'الأطباق المميزة في القائمة',
  };

  for (const s of suggestions) {
    if (!contextMap[s.context]) contextMap[s.context] = { total: 0, converted: 0 };
    contextMap[s.context].total++;
    if (s.converted) contextMap[s.context].converted++;
  }

  let bestContext = '';
  let bestContextRate = -1;
  for (const [ctx, data] of Object.entries(contextMap)) {
    if (data.total >= 2) {
      const rate = (data.converted / data.total) * 100;
      if (rate > bestContextRate) {
        bestContextRate = rate;
        bestContext = ctx;
      }
    }
  }

  if (bestContext) {
    insights.push(
      `أعلى معدل تحويل من خلال "${contextNames[bestContext]}" (${bestContextRate.toFixed(1)}%). ركّز على هذا القناة لزيادة المبيعات.`,
    );
  }

  // تحليل الأطباق الأكثر مبيعاً
  const dishConversions = new Map<string, { name: string; conversions: number; revenue: number }>();
  for (const s of suggestions) {
    if (s.converted) {
      const existing = dishConversions.get(s.dishId);
      const rev = s.orderValue ?? 0;
      if (existing) {
        existing.conversions++;
        existing.revenue += rev;
      } else {
        dishConversions.set(s.dishId, { name: s.dishName, conversions: 1, revenue: rev });
      }
    }
  }

  if (dishConversions.size > 0) {
    const topDish = Array.from(dishConversions.values()).sort((a, b) => b.revenue - a.revenue)[0];
    insights.push(
      `الطبق "${topDish.name}" يحقق أعلى إيرادات من اقتراحات الذكاء الاصطناعي (${topDish.revenue.toFixed(0)} ر.س). يُنصح بزيادة ترويجه.`,
    );
  }

  // تحليل الأطباق المرفوضة
  const dishDismissals = new Map<string, { name: string; dismissals: number; suggestions: number }>();
  for (const s of suggestions) {
    if (!dishDismissals.has(s.dishId)) {
      dishDismissals.set(s.dishId, { name: s.dishName, dismissals: 0, suggestions: 0 });
    }
    const entry = dishDismissals.get(s.dishId)!;
    entry.suggestions++;
    if (s.converted === false) entry.dismissals++;
  }

  const highDismissalDishes = Array.from(dishDismissals.values())
    .filter((d) => d.suggestions >= 3 && (d.dismissals / d.suggestions) > 0.7)
    .sort((a, b) => (b.dismissals / b.suggestions) - (a.dismissals / a.suggestions));

  if (highDismissalDishes.length > 0) {
    const names = highDismissalDishes.slice(0, 3).map((d) => `"${d.name}"`).join('، ');
    insights.push(
      `أطباق يتم رفضها بشكل متكرر: ${names}. يُنصح بتقليل اقتراحها أو تغيير طريقة عرضها.`,
    );
  }

  // تحليل التوقيت
  const hourlyConversions = new Map<number, { suggestions: number; conversions: number }>();
  for (const s of suggestions) {
    const hour = s.suggestedAt instanceof Date ? s.suggestedAt.getHours() : new Date(s.suggestedAt).getHours();
    if (!hourlyConversions.has(hour)) hourlyConversions.set(hour, { suggestions: 0, conversions: 0 });
    const entry = hourlyConversions.get(hour)!;
    entry.suggestions++;
    if (s.converted) entry.conversions++;
  }

  let bestHour = 0;
  let bestHourRate = -1;
  for (const [hour, data] of hourlyConversions) {
    if (data.suggestions >= 2) {
      const rate = data.conversions / data.suggestions;
      if (rate > bestHourRate) {
        bestHourRate = rate;
        bestHour = hour;
      }
    }
  }

  if (bestHourRate > 0) {
    insights.push(
      `أفضل وقت للاقتراحات هو الساعة ${bestHour}:00 بمعدل تحويل ${(bestHourRate * 100).toFixed(0)}%. جرّب تعزيز الاقتراحات حول هذا الوقت.`,
    );
  }

  // اقتراحات عامة
  if (totalPending > totalConversions) {
    insights.push(
      `يوجد ${totalPending} اقتراح لا يزال بانتظار قرار العميل. قد تحتاج لإضافة ميزة التذكير بالاقتراحات المنسية.`,
    );
  }

  if (insights.length === 0) {
    insights.push('البيانات الجارية جيدة. استمر في جمع المزيد من البيانات للحصول على تحليلات أدق.');
  }

  return insights;
}

/**
 * أفضل استراتيجية للاقتراحات بناءً على البيانات التاريخية
 */
export async function getOptimalSuggestionStrategy(): Promise<SuggestionStrategy> {
  const suggestions = await getAllSuggestions();

  // القيم الافتراضية إذا لم تتوفر بيانات كافية
  if (suggestions.length < 5) {
    return {
      bestContext: 'chat',
      bestHourRange: '١٨:٠٠ - ٢٢:٠٠',
      bestDishCategories: [],
      confidenceScore: Math.min(suggestions.length / 5, 1) * 20,
      reason: 'بيانات غير كافية لتحديد الاستراتيجية المثلى. يتم استخدام الإعدادات الافتراضية حتى يتم جمع ما لا يقل عن ٥ اقتراحات.',
    };
  }

  // أفضل سياق
  const contextStats: Record<string, { total: number; converted: number }> = {};
  for (const s of suggestions) {
    if (!contextStats[s.context]) contextStats[s.context] = { total: 0, converted: 0 };
    contextStats[s.context].total++;
    if (s.converted) contextStats[s.context].converted++;
  }

  let bestContext: SuggestionContext = 'chat';
  let bestContextRate = 0;
  for (const [ctx, data] of Object.entries(contextStats)) {
    if (data.total >= 2) {
      const rate = data.converted / data.total;
      if (rate > bestContextRate) {
        bestContextRate = rate;
        bestContext = ctx as SuggestionContext;
      }
    }
  }

  // أفضل نطاق زمني
  const hourlyStats = new Map<number, { total: number; converted: number }>();
  for (const s of suggestions) {
    const hour = s.suggestedAt instanceof Date ? s.suggestedAt.getHours() : new Date(s.suggestedAt).getHours();
    if (!hourlyStats.has(hour)) hourlyStats.set(hour, { total: 0, converted: 0 });
    const entry = hourlyStats.get(hour)!;
    entry.total++;
    if (s.converted) entry.converted++;
  }

  // إيجاد أفضل نافذة زمنية (نطاق ٣ ساعات)
  let bestWindowStart = 18;
  let bestWindowRate = 0;
  for (let start = 0; start < 24; start++) {
    let total = 0;
    let converted = 0;
    for (let offset = 0; offset < 3; offset++) {
      const h = (start + offset) % 24;
      const stat = hourlyStats.get(h);
      if (stat) {
        total += stat.total;
        converted += stat.converted;
      }
    }
    if (total >= 3) {
      const rate = converted / total;
      if (rate > bestWindowRate) {
        bestWindowRate = rate;
        bestWindowStart = start;
      }
    }
  }

  const endHour = (bestWindowStart + 2) % 24;
  const formatHour = (h: number) => h.toString().padStart(2, '0');
  const bestHourRange = `${formatHour(bestWindowStart)}:٠٠ - ${formatHour(endHour)}:٠٠`;

  // أفضل فئات أطباق (حسب التحويل)
  const dishRevenue = new Map<string, { name: string; revenue: number; conversions: number }>();
  for (const s of suggestions) {
    if (s.converted) {
      const existing = dishRevenue.get(s.dishId);
      if (existing) {
        existing.revenue += s.orderValue ?? 0;
        existing.conversions++;
      } else {
        dishRevenue.set(s.dishId, {
          name: s.dishName,
          revenue: s.orderValue ?? 0,
          conversions: 1,
        });
      }
    }
  }

  const bestDishCategories = Array.from(dishRevenue.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((d) => d.name);

  // حساب درجة الثقة (بناءً على حجم البيانات)
  const confidenceScore = Math.min(suggestions.length / 50, 1) * 100;

  const contextNames: Record<string, string> = {
    chat: 'المحادثة الذكية',
    cart_upsell: 'البيع الإضافي في السلة',
    menu_featured: 'الأطباق المميزة في القائمة',
  };

  return {
    bestContext,
    bestHourRange,
    bestDishCategories,
    confidenceScore: Math.round(confidenceScore),
    reason: `بناءً على تحليل ${suggestions.length} اقتراح، القناة الأفضل هي "${contextNames[bestContext]}" بمعدل تحويل ${(bestContextRate * 100).toFixed(0)}%، وأفضل نطاق زمني هو ${bestHourRange}.`,
  };
}

/**
 * جلب أحداث الإيرادات المحلية
 */
export function getRevenueEvents(): RevenueEvent[] {
  return getLocalEvents();
}

/**
 * إضافة حدث إيرادات يدوياً
 */
export function addRevenueEvent(event: RevenueEvent): void {
  const events = getLocalEvents();
  events.push(event);
  saveLocalEvents(events);
}