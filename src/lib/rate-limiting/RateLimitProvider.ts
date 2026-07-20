export interface RateLimitProvider {
  /**
   * Atomically increments the counter for the given key.
   * @param key The resolved rate limit key
   * @param windowMs The TTL for the key in milliseconds
   * @param cost The cost of the request (default 1)
   * @returns The new count and the timestamp when the window resets
   */
  increment(key: string, windowMs: number, cost?: number): Promise<{ count: number; resetAt: number }>;

  /**
   * Retrieves the current count and resetAt for the given key without modifying it.
   */
  get(key: string): Promise<{ count: number; resetAt: number } | null>;

  /**
   * Resets/deletes the counter for the given key.
   */
  reset(key: string): Promise<void>;
}
