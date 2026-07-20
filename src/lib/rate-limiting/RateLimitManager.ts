import { RateLimitProvider } from "./RateLimitProvider";
import { InMemoryRateLimitProvider } from "./InMemoryRateLimitProvider";
import { RateLimitPolicy } from "./RateLimitPolicy";
import { RateLimitContext, RateLimitResult, FailureStrategy } from "./RateLimitTypes";
import { IdentityStrategy, RateLimitKeyBuilder } from "./RateLimitKeyBuilder";

export class RateLimitManager {
  private static provider: RateLimitProvider = new InMemoryRateLimitProvider();

  public static setProvider(provider: RateLimitProvider) {
    this.provider = provider;
  }

  /**
   * Consumes a rate limit quota.
   * Isolates identity resolution from rate limit evaluation.
   */
  public static async consume(
    context: RateLimitContext,
    identityStrategy: IdentityStrategy,
    policy: RateLimitPolicy,
    cost: number = 1,
    failureStrategy: FailureStrategy = FailureStrategy.FAIL_OPEN
  ): Promise<RateLimitResult> {
    const identity = identityStrategy.resolveIdentity(context);
    const key = RateLimitKeyBuilder.buildKey(context.endpoint, identity);

    try {
      return await policy.evaluate(key, this.provider, cost);
    } catch (error) {
      console.error(`[RateLimitManager] Failure evaluating limit for ${key}`, error);

      if (failureStrategy === FailureStrategy.FAIL_CLOSED) {
        throw new Error("Rate limit provider unavailable (FAIL_CLOSED)");
      }

      // FAIL_OPEN: Allow the request to proceed to protect API availability
      return {
        allowed: true,
        remaining: 9999,
        limit: 9999,
        resetAt: Date.now() + 60000,
        retryAfter: 0,
      };
    }
  }

  /**
   * Explicitly resets a rate limit counter (e.g. for testing or manual overrides).
   */
  public static async reset(context: RateLimitContext, identityStrategy: IdentityStrategy): Promise<void> {
    const identity = identityStrategy.resolveIdentity(context);
    const key = RateLimitKeyBuilder.buildKey(context.endpoint, identity);
    await this.provider.reset(key);
  }
}
