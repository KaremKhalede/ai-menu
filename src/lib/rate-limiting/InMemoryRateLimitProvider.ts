import { RateLimitProvider } from "./RateLimitProvider";

interface CacheEntry {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimitProvider implements RateLimitProvider {
  private store = new Map<string, CacheEntry>();

  async increment(key: string, windowMs: number, cost: number = 1): Promise<{ count: number; resetAt: number }> {
    this.cleanUpExpired();

    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
    }

    entry.count += cost;
    this.store.set(key, entry);

    return { count: entry.count, resetAt: entry.resetAt };
  }

  async get(key: string): Promise<{ count: number; resetAt: number } | null> {
    const entry = this.store.get(key);
    if (!entry || entry.resetAt <= Date.now()) {
      return null;
    }
    return { count: entry.count, resetAt: entry.resetAt };
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  /**
   * Lazy eviction to prevent memory leaks in the MVP.
   */
  private cleanUpExpired() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }
}
