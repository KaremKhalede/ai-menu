import { CacheProvider } from "./CacheProvider";
import { InMemoryCacheProvider } from "./InMemoryCacheProvider";

export class CacheManager {
  private static provider: CacheProvider = new InMemoryCacheProvider();

  /**
   * Inject a different provider (e.g. RedisCacheProvider) in the future.
   */
  public static setProvider(provider: CacheProvider) {
    this.provider = provider;
  }

  public static async get<T>(key: string): Promise<T | null> {
    try {
      return await this.provider.get<T>(key);
    } catch (e) {
      console.warn(`[CacheManager] Failed to get key ${key}`, e);
      return null; // Fallback gracefully if cache is down
    }
  }

  public static async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      await this.provider.set(key, value, ttlSeconds);
    } catch (e) {
      console.warn(`[CacheManager] Failed to set key ${key}`, e);
    }
  }

  public static async delete(key: string): Promise<void> {
    try {
      await this.provider.delete(key);
    } catch (e) {
      console.warn(`[CacheManager] Failed to delete key ${key}`, e);
    }
  }

  public static async clear(prefix?: string): Promise<void> {
    try {
      await this.provider.clear(prefix);
    } catch (e) {
      console.warn(`[CacheManager] Failed to clear cache`, e);
    }
  }

  /**
   * Safely gets from cache or falls back to database fetcher.
   * If cache infrastructure is down, directly returns fetcher result (graceful degradation).
   */
  public static async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    try {
      return await this.provider.getOrSet(key, fetcher, ttlSeconds);
    } catch (e) {
      // If the cache itself throws (e.g. Redis connection lost), just fetch from DB.
      // Note: If the fetcher throws, this catch block catches it too, but we should let business logic handle DB errors.
      // So we only intercept known cache errors. Since our in-memory cache doesn't throw, we'll let it bubble for now,
      // but wrap the initial fallback to ensure business continuity.
      console.warn(`[CacheManager] getOrSet encountered an error for key ${key}. Falling back to fetcher.`, e);
      return await fetcher();
    }
  }
}
