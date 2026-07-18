// ─── MenuAI Heatmap Tracking Module ─────────────────────────────────────
// Client-side module that captures click, hover, scroll, and view events
// on the digital menu, batches them, and flushes to the server API.

import { trackHeatmapEvent } from './offline-db';

/* ───────────────── Types ───────────────── */

export interface HeatmapEvent {
  id: string;
  type: 'click' | 'hover' | 'scroll' | 'view' | 'add_to_cart' | 'detail_view';
  elementId?: string;
  elementLabel?: string;
  dishId?: string;
  dishName?: string;
  categoryId?: string;
  categoryName?: string;
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  scrollDepth: number;
  timestamp: Date;
  sessionId: string;
  /** Extra metadata — e.g. `duration` for view events */
  metadata?: Record<string, unknown>;
}

/* ───────────────── Constants ───────────────── */

const FLUSH_INTERVAL_MS = 30_000; // 30 seconds
const FLUSH_EVENT_THRESHOLD = 20;
const HOVER_DEBOUNCE_MS = 3_000; // max 1 hover per element per 3s
const API_ENDPOINT = '/api/analytics/heatmap';

/* ───────────────── Internal State ───────────────── */

let sessionId = '';
let buffer: HeatmapEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let isTracking = false;

// Bound handler references (so we can remove them later)
const handlers = {
  click: null as ((e: MouseEvent) => void) | null,
  scroll: null as (() => void) | null,
  hover: null as ((e: MouseEvent) => void) | null,
  beforeunload: null as (() => void) | null,
};

// Debounce map: elementId → last hover timestamp
const hoverDebounceMap = new Map<string, number>();

/* ───────────────── Helpers ───────────────── */

function generateId(): string {
  return crypto.randomUUID();
}

function generateSessionId(): string {
  return `hm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getCurrentScrollDepth(): number {
  if (typeof document === 'undefined') return 0;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));
}

/** Extract dish metadata from a clicked/hovered element or its ancestors */
function extractDishContext(target: HTMLElement): {
  dishId?: string;
  dishName?: string;
  categoryId?: string;
  categoryName?: string;
  elementLabel?: string;
} {
  const el = target.closest<HTMLElement>('[data-dish-id]') ?? target;
  return {
    dishId: el.dataset.dishId || undefined,
    dishName: el.dataset.dishName || el.getAttribute('aria-label') || undefined,
    categoryId: el.dataset.categoryId || undefined,
    categoryName: el.dataset.categoryName || undefined,
    elementLabel: el.dataset.heatmapLabel || el.textContent?.slice(0, 80) || undefined,
  };
}

/** Push an event into the in-memory buffer */
function pushEvent(event: Omit<HeatmapEvent, 'id' | 'sessionId' | 'timestamp'>): void {
  const fullEvent: HeatmapEvent = {
    ...event,
    id: generateId(),
    sessionId,
    timestamp: new Date(),
  };
  buffer.push(fullEvent);

  // Persist to IndexedDB as backup
  try {
    trackHeatmapEvent({ ...fullEvent, timestamp: fullEvent.timestamp.toISOString() });
  } catch {
    // IndexedDB may be unavailable (SSR, private mode, etc.)
  }

  // Auto-flush when threshold reached
  if (buffer.length >= FLUSH_EVENT_THRESHOLD) {
    flushEvents();
  }
}

/* ───────────────── Public API ───────────────── */

/**
 * Initialise heatmap tracking — call once on page load.
 * Sets up global click, scroll, and hover listeners with debouncing.
 */
export function initHeatmapTracking(): void {
  if (isTracking || typeof window === 'undefined') return;

  sessionId = generateSessionId();
  isTracking = true;
  buffer = [];

  // ── Click handler ──
  handlers.click = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const ctx = extractDishContext(target);

    pushEvent({
      type: 'click',
      elementId: target.id || undefined,
      elementLabel: ctx.elementLabel,
      dishId: ctx.dishId,
      dishName: ctx.dishName,
      categoryId: ctx.categoryId,
      categoryName: ctx.categoryName,
      x: e.clientX,
      y: e.clientY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollDepth: getCurrentScrollDepth(),
    });
  };

  // ── Scroll handler (debounced via rAF) ──
  let scrollRafId: number | null = null;
  let lastScrollDepth = -1;

  handlers.scroll = () => {
    if (scrollRafId !== null) return;
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null;
      const depth = getCurrentScrollDepth();
      // Only record when depth actually changes
      if (depth !== lastScrollDepth) {
        lastScrollDepth = depth;
        pushEvent({
          type: 'scroll',
          x: 0,
          y: window.scrollY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          scrollDepth: depth,
        });
      }
    });
  };

  // ── Hover handler (debounced per element) ──
  handlers.hover = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const elementKey = target.id || target.dataset.dishId || target.tagName;

    const now = Date.now();
    const lastHover = hoverDebounceMap.get(elementKey) ?? 0;
    if (now - lastHover < HOVER_DEBOUNCE_MS) return;

    hoverDebounceMap.set(elementKey, now);
    const ctx = extractDishContext(target);

    pushEvent({
      type: 'hover',
      elementId: target.id || undefined,
      elementLabel: ctx.elementLabel,
      dishId: ctx.dishId,
      dishName: ctx.dishName,
      categoryId: ctx.categoryId,
      categoryName: ctx.categoryName,
      x: e.clientX,
      y: e.clientY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollDepth: getCurrentScrollDepth(),
    });
  };

  // ── Before-unload: flush remaining ──
  handlers.beforeunload = () => {
    flushEvents();
  };

  // Attach listeners
  window.addEventListener('click', handlers.click, { passive: true });
  window.addEventListener('scroll', handlers.scroll, { passive: true });
  window.addEventListener('mousemove', handlers.hover, { passive: true });
  window.addEventListener('beforeunload', handlers.beforeunload);

  // Periodic auto-flush
  flushTimer = setInterval(() => {
    flushEvents();
  }, FLUSH_INTERVAL_MS);
}

/**
 * Explicitly track a dish card click with full metadata.
 */
export function trackDishClick(
  dishId: string,
  dishName: string,
  categoryId?: string,
  categoryName?: string,
  x?: number,
  y?: number,
): void {
  pushEvent({
    type: 'click',
    dishId,
    dishName,
    categoryId,
    categoryName,
    elementLabel: dishName,
    x: x ?? 0,
    y: y ?? 0,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    scrollDepth: getCurrentScrollDepth(),
  });
}

/**
 * Track how long a user viewed a dish detail page/modal.
 * @param dishId   The dish identifier
 * @param dishName The dish display name
 * @param duration View duration in seconds
 */
export function trackDishView(dishId: string, dishName: string, duration: number): void {
  pushEvent({
    type: 'detail_view',
    dishId,
    dishName,
    elementLabel: dishName,
    x: 0,
    y: 0,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    scrollDepth: getCurrentScrollDepth(),
    metadata: { duration },
  });
}

/**
 * Track scroll depth percentage (0–100).
 */
export function trackScrollDepth(depth: number): void {
  pushEvent({
    type: 'scroll',
    x: 0,
    y: typeof window !== 'undefined' ? window.scrollY : 0,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    scrollDepth: Math.max(0, Math.min(100, Math.round(depth))),
  });
}

/**
 * Track when a user adds a dish to the cart.
 */
export function trackAddToCart(dishId: string, dishName: string): void {
  pushEvent({
    type: 'add_to_cart',
    dishId,
    dishName,
    elementLabel: dishName,
    x: 0,
    y: 0,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    scrollDepth: getCurrentScrollDepth(),
  });
}

/**
 * Retrieve all events currently in the in-memory buffer.
 */
export function getHeatmapData(): HeatmapEvent[] {
  return [...buffer];
}

/* ───────────────── Aggregation / Summary ───────────────── */

export interface HeatmapDishStat {
  dishId: string;
  dishName: string;
  count: number;
  percentage: number;
}

export interface ClickHotspot {
  /** Quadrant label: "أعلى يمين", "أسفل يسار", etc. */
  zone: string;
  count: number;
  percentage: number;
}

export interface HeatmapSummary {
  mostClickedDishes: HeatmapDishStat[];
  mostViewedDishes: HeatmapDishStat[];
  cartAddRate: HeatmapDishStat[];
  averageViewDuration: number;
  scrollDepthDistribution: { range: string; count: number }[];
  clickHotspots: ClickHotspot[];
  totalInteractions: number;
}

function getZoneLabel(xPct: number, yPct: number): string {
  const isTop = yPct < 50;
  const isRight = xPct > 50;
  if (isTop && isRight) return 'أعلى اليمين';
  if (isTop && !isRight) return 'أعلى اليسار';
  if (!isTop && isRight) return 'أسفل اليمين';
  return 'أسفل اليسار';
}

/**
 * Compute an aggregated summary from the current buffer.
 */
export function getHeatmapSummary(): HeatmapSummary {
  const events = buffer;

  // Click counts per dish
  const clickMap = new Map<string, { dishId: string; dishName: string; count: number }>();
  // View counts per dish
  const viewMap = new Map<string, { dishId: string; dishName: string; count: number; totalDuration: number }>();
  // Cart add counts per dish
  const cartMap = new Map<string, { dishId: string; dishName: string; count: number }>();
  // Scroll depth buckets
  const scrollBuckets = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
  // Click hotspot zones
  const hotspotMap = new Map<string, number>();

  let totalViewDuration = 0;
  let viewCount = 0;

  for (const ev of events) {
    // ── Clicks ──
    if (ev.type === 'click' && ev.dishId) {
      const key = ev.dishId;
      const existing = clickMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        clickMap.set(key, {
          dishId: ev.dishId,
          dishName: ev.dishName || 'غير معروف',
          count: 1,
        });
      }

      // Hotspot zone
      const xPct = ev.viewportWidth > 0 ? (ev.x / ev.viewportWidth) * 100 : 50;
      const yPct = ev.viewportHeight > 0 ? (ev.y / ev.viewportHeight) * 100 : 50;
      const zone = getZoneLabel(xPct, yPct);
      hotspotMap.set(zone, (hotspotMap.get(zone) ?? 0) + 1);
    }

    // ── Detail views ──
    if (ev.type === 'detail_view' && ev.dishId) {
      const key = ev.dishId;
      const duration = (ev.metadata?.duration as number) ?? 0;
      const existing = viewMap.get(key);
      if (existing) {
        existing.count++;
        existing.totalDuration += duration;
      } else {
        viewMap.set(key, {
          dishId: ev.dishId,
          dishName: ev.dishName || 'غير معروف',
          count: 1,
          totalDuration: duration,
        });
      }
      totalViewDuration += duration;
      viewCount++;
    }

    // ── Cart adds ──
    if (ev.type === 'add_to_cart' && ev.dishId) {
      const key = ev.dishId;
      const existing = cartMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        cartMap.set(key, {
          dishId: ev.dishId,
          dishName: ev.dishName || 'غير معروف',
          count: 1,
        });
      }
    }

    // ── Scroll ──
    if (ev.type === 'scroll') {
      const d = ev.scrollDepth;
      if (d <= 20) scrollBuckets[0]++;
      else if (d <= 40) scrollBuckets[1]++;
      else if (d <= 60) scrollBuckets[2]++;
      else if (d <= 80) scrollBuckets[3]++;
      else scrollBuckets[4]++;
    }
  }

  // Sort & top-N helpers
  const toStat = (
    map: Map<string, { dishId: string; dishName: string; count: number }>,
  ): HeatmapDishStat[] => {
    const total = Array.from(map.values()).reduce((s, v) => s + v.count, 0);
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((v) => ({
        dishId: v.dishId,
        dishName: v.dishName,
        count: v.count,
        percentage: total > 0 ? Math.round((v.count / total) * 1000) / 10 : 0,
      }));
  };

  const mostClickedDishes = toStat(clickMap);
  const mostViewedDishes = toStat(viewMap);
  const cartAddRate = toStat(cartMap);

  const averageViewDuration = viewCount > 0 ? Math.round(totalViewDuration / viewCount) : 0;

  const scrollDepthDistribution = [
    { range: '٠٪ – ٢٠٪', count: scrollBuckets[0] },
    { range: '٢٠٪ – ٤٠٪', count: scrollBuckets[1] },
    { range: '٤٠٪ – ٦٠٪', count: scrollBuckets[2] },
    { range: '٦٠٪ – ٨٠٪', count: scrollBuckets[3] },
    { range: '٨٠٪ – ١٠٠٪', count: scrollBuckets[4] },
  ];

  const totalClicks = Array.from(hotspotMap.values()).reduce((s, v) => s + v, 0);
  const clickHotspots: ClickHotspot[] = Array.from(hotspotMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([zone, count]) => ({
      zone,
      count,
      percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 1000) / 10 : 0,
    }));

  return {
    mostClickedDishes,
    mostViewedDishes,
    cartAddRate,
    averageViewDuration,
    scrollDepthDistribution,
    clickHotspots,
    totalInteractions: events.length,
  };
}

/**
 * Flush all buffered events to the server API `/api/analytics/heatmap`.
 * Clears the in-memory buffer on success.
 */
export async function flushEvents(): Promise<void> {
  if (buffer.length === 0) return;

  // Snapshot and clear the buffer first (so new events don't get lost)
  const batch = [...buffer];
  buffer = [];

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch.map((ev) => ({ ...ev, timestamp: ev.timestamp.toISOString() }))),
    });

    if (!res.ok) {
      // Re-queue on failure
      buffer = [...batch, ...buffer];
    }
  } catch {
    // Network error — re-queue
    buffer = [...batch, ...buffer];
  }
}

/**
 * Stop all heatmap tracking, remove event listeners, and cancel timers.
 */
export function stopHeatmapTracking(): void {
  if (!isTracking) return;
  isTracking = false;

  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }

  if (handlers.click) window.removeEventListener('click', handlers.click);
  if (handlers.scroll) window.removeEventListener('scroll', handlers.scroll);
  if (handlers.hover) window.removeEventListener('mousemove', handlers.hover);
  if (handlers.beforeunload) window.removeEventListener('beforeunload', handlers.beforeunload);

  handlers.click = null;
  handlers.scroll = null;
  handlers.hover = null;
  handlers.beforeunload = null;

  hoverDebounceMap.clear();

  // Final flush
  flushEvents();
}