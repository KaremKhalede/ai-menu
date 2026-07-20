import { FeatureFlagProvider } from "./FeatureFlagProvider";
import { PrismaFeatureFlagProvider } from "./PrismaFeatureFlagProvider";
import { FeatureContext } from "./FeatureContext";
import { FeatureEvaluator } from "./FeatureEvaluator";
import { CacheManager } from "@/lib/cache/CacheManager";

export class FeatureFlagManager {
  private static provider: FeatureFlagProvider = new PrismaFeatureFlagProvider();

  public static setProvider(provider: FeatureFlagProvider) {
    this.provider = provider;
  }

  /**
   * Determines if a feature is enabled for the given context.
   * Guarantees request-level consistency.
   */
  static async isEnabled(flagKey: string, context: FeatureContext): Promise<boolean> {
    // 1. Request-Level Consistency
    const cachedResult = context.getCachedEvaluation(flagKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    // 2. High-Performance Flag Retrieval
    const cacheKey = `FEATURE_FLAG:${context.environment}:${flagKey}`;
    
    // We swallow errors during evaluation so business logic never crashes.
    try {
      const definitions = await CacheManager.getOrSet(
        cacheKey,
        async () => {
          return await this.provider.fetchFlagDefinitions(flagKey, context.environment);
        },
        300 // 5 minutes global cache TTL
      );

      // 3. Pure Deterministic Evaluation
      const result = FeatureEvaluator.evaluate(definitions, context);

      // 4. Cache on Context
      context.setCachedEvaluation(flagKey, result);
      return result;

    } catch (e) {
      console.error(`[FeatureFlagManager] Failed to evaluate flag ${flagKey}. Defaulting to false.`, e);
      // Fallback to false on failure to protect production
      context.setCachedEvaluation(flagKey, false);
      return false;
    }
  }

  /**
   * Explicitly purges the global cache for a flag, forcing a re-fetch on the next request.
   */
  static async refresh(flagKey: string, environment: string = process.env.NODE_ENV || "production"): Promise<void> {
    const cacheKey = `FEATURE_FLAG:${environment}:${flagKey}`;
    await CacheManager.delete(cacheKey);
  }
}
