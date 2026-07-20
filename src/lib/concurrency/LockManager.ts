import { LockProvider, LockScope } from "./LockProvider";
import { PrismaLockProvider } from "./PrismaLockProvider";

export class LockManager {
  private static provider: LockProvider = new PrismaLockProvider();

  /**
   * Inject a different provider (e.g. RedisLockProvider) in the future.
   */
  public static setProvider(provider: LockProvider) {
    this.provider = provider;
  }

  /**
   * Helper to format scope and ID securely.
   */
  public static getLockKey(scope: LockScope, id: string): string {
    return `${scope}:${id}`;
  }

  /**
   * Wraps an execution block in a distributed lock.
   * Ensures safe release, even if the execution throws an error.
   * Throws if the lock cannot be acquired within 1 attempt. (Fail-fast strategy).
   * 
   * @param scope The lock scope (e.g. CUSTOMER)
   * @param resourceId The specific ID to lock
   * @param ttlMs How long the lock should live (default 5000ms)
   * @param work The async function to execute safely
   */
  public static async withLock<T>(
    scope: LockScope,
    resourceId: string,
    work: () => Promise<T>,
    ttlMs: number = 5000
  ): Promise<T> {
    const lockKey = this.getLockKey(scope, resourceId);
    const lock = await this.provider.tryAcquire(lockKey, ttlMs);

    if (!lock) {
      throw new Error(`Concurrency error: Resource ${lockKey} is currently locked by another process.`);
    }

    try {
      return await work();
    } finally {
      await this.provider.release(lock.lockKey, lock.token);
    }
  }
}
