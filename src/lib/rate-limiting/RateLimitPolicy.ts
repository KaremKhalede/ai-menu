import { RateLimitProvider } from "./RateLimitProvider";
import { RateLimitResult } from "./RateLimitTypes";

export interface RateLimitPolicy {
  /**
   * Executes the rate limit logic using the provided storage backend.
   */
  evaluate(key: string, provider: RateLimitProvider, cost?: number): Promise<RateLimitResult>;
}

export class FixedWindowPolicy implements RateLimitPolicy {
  constructor(
    private readonly limit: number,
    private readonly windowMs: number
  ) {}

  async evaluate(key: string, provider: RateLimitProvider, cost: number = 1): Promise<RateLimitResult> {
    const { count, resetAt } = await provider.increment(key, this.windowMs, cost);

    const allowed = count <= this.limit;
    const remaining = Math.max(0, this.limit - count);
    const retryAfter = allowed ? 0 : Math.ceil((resetAt - Date.now()) / 1000);

    return {
      allowed,
      remaining,
      limit: this.limit,
      resetAt,
      retryAfter,
    };
  }
}
