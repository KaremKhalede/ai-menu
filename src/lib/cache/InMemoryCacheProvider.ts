import { CacheProvider, CacheEntry } from "./CacheProvider";

export class InMemoryCacheProvider implements CacheProvider {
  private store: Map<string, CacheEntry<any>> = new Map();
  // Request Coalescing map to prevent Cache Stampedes
  private activeFetches: Map<string, Promise<any>> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (entry.expiresAt !== 0 && now > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    const now = Date.now();
    this.store.set(key, {
      key,
      value,
      ttlSeconds,
      createdAt: now,
      expiresAt: ttlSeconds > 0 ? now + ttlSeconds * 1000 : 0,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.get(key)) !== null;
  }

  async clear(prefix?: string): Promise<void> {
    if (!prefix) {
      this.store.clear();
      return;
    }

    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
    try {
      // 1. Check cache normally
      const cachedValue = await this.get<T>(key);
      if (cachedValue !== null) {
        return cachedValue;
      }

      // 2. Prevent Cache Stampedes (Request Coalescing)
      // If another request is currently fetching this key, await its promise instead of fetching again.
      if (this.activeFetches.has(key)) {
        return (await this.activeFetches.get(key)) as T;
      }

      // 3. Initiate the fetch and store the promise so concurrent callers can await it
      const fetchPromise = fetcher().then(async (value) => {
        await this.set(key, value, ttlSeconds);
        return value;
      });

      this.activeFetches.set(key, fetchPromise);

      // 4. Await and resolve
      const result = await fetchPromise;
      return result;
    } catch (error) {
      // If the fetcher fails, we must not cache the failure or block future retries
      throw error;
    } finally {
      // 5. Clean up the active fetch map regardless of success or failure
      this.activeFetches.delete(key);
    }
  }
}
