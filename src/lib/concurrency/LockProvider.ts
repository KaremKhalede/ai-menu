export enum LockScope {
  CUSTOMER = "CUSTOMER",
  ORDER = "ORDER",
  LOYALTY_ACCOUNT = "LOYALTY_ACCOUNT",
  REWARD = "REWARD",
  JOB = "JOB",
}

export interface AcquiredLock {
  lockKey: string;
  token: string;
}

export interface LockProvider {
  /**
   * Attempts to acquire a lock.
   * @returns AcquiredLock if successful, null if lock is currently held by someone else.
   */
  tryAcquire(lockKey: string, ttlMs: number): Promise<AcquiredLock | null>;

  /**
   * Releases a lock using its unique token.
   * @returns true if released, false if the lock had already expired or token was invalid.
   */
  release(lockKey: string, token: string): Promise<boolean>;

  /**
   * Extends the TTL of a lock using its unique token.
   * @returns true if extended, false if the lock had already expired or token was invalid.
   */
  extend(lockKey: string, token: string, extensionMs: number): Promise<boolean>;
}
