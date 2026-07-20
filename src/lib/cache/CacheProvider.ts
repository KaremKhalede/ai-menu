export interface CacheEntry<T> {
  key: string;
  value: T;
  ttlSeconds: number;
  createdAt: number;
  expiresAt: number;
}

export interface CacheProvider {
  /**
   * Retrieves a value from the cache.
   * Returns null if missing or expired.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Sets a value in the cache with an optional TTL.
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Deletes a specific key from the cache.
   */
  delete(key: string): Promise<void>;

  /**
   * Checks if an unexpired key exists.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Clears the entire cache or all keys matching a specific prefix.
   */
  clear(prefix?: string): Promise<void>;

  /**
   * Gets a value if it exists, otherwise executes the fetcher, saves the result, and returns it.
   * Must include Cache Stampede prevention (Request Coalescing).
   */
  getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}
