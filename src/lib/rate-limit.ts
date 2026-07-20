import { NextRequest } from 'next/server';

interface RateLimitConfig {
  intervalMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  req: NextRequest,
  config: RateLimitConfig
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const path = req.nextUrl.pathname;
  const key = `${ip}:${path}`;
  const now = Date.now();

  // Periodic pruning when map size gets too large (simple memory leakage protection)
  if (rateLimitStore.size > 1000) {
    const pruneNow = Date.now();
    for (const [k, v] of rateLimitStore.entries()) {
      if (pruneNow > v.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const newRecord = {
      count: 1,
      resetTime: now + config.intervalMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}
