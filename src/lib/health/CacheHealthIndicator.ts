import { CacheManager } from "@/lib/cache/CacheManager";
import { HealthIndicator } from "./HealthTypes";

export class CacheHealthIndicator implements HealthIndicator {
  public readonly name = "Cache";
  public readonly isCritical = false; // System can function without cache (it degrades gracefully)
  public readonly timeoutMs = 2000; // 2 seconds timeout

  async check(): Promise<Record<string, any>> {
    // Attempt a simple set and get to verify cache provider is responsive
    const testKey = "HEALTH_CHECK_TEST";
    await CacheManager.getOrSet(testKey, async () => "OK", 60);
    return { provider: "InMemoryCacheProvider" };
  }
}
