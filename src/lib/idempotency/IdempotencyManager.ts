import { IdempotencyProvider } from "./IdempotencyProvider";
import { PrismaIdempotencyProvider } from "./PrismaIdempotencyProvider";
import { IdempotencyKeyResolver } from "./IdempotencyKeyResolver";
import { IdempotencyStatus } from "./IdempotencyTypes";

export class IdempotencyPayloadMismatchError extends Error {
  constructor() {
    super("Idempotency key reused with a different payload");
    this.name = "IdempotencyPayloadMismatchError";
  }
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super("Request is currently in progress");
    this.name = "IdempotencyConflictError";
  }
}

export class IdempotencyManager {
  private static provider: IdempotencyProvider = new PrismaIdempotencyProvider();

  public static setProvider(provider: IdempotencyProvider) {
    this.provider = provider;
  }

  /**
   * Begins an idempotent operation.
   * Ensures atomic creation and strong payload validation.
   */
  public static async begin(key: string, payload: any, ttlMs: number = 86400000): Promise<{ proceed: boolean; cachedResponse?: any }> {
    const requestHash = IdempotencyKeyResolver.computeHash(payload);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);

    const result = await this.provider.insertIfNotExists({
      idempotencyKey: key,
      requestHash,
      status: IdempotencyStatus.PROCESSING,
      responseSnapshot: null,
      createdAt: now,
      expiresAt,
    });

    const record = result.record;

    // 1. Check expiration of the existing record
    if (!result.isNew && record.expiresAt < now) {
      await this.provider.delete(key);
      return this.begin(key, payload, ttlMs);
    }

    // 2. We just created it atomically -> proceed!
    if (result.isNew) {
      return { proceed: true };
    }

    // 3. Contract Enforcement: Payload must exactly match
    if (record.requestHash !== requestHash) {
      throw new IdempotencyPayloadMismatchError();
    }

    // 4. State Machine Handling
    if (record.status === IdempotencyStatus.COMPLETED) {
      return { proceed: false, cachedResponse: record.responseSnapshot };
    }

    if (record.status === IdempotencyStatus.PROCESSING) {
      throw new IdempotencyConflictError();
    }

    if (record.status === IdempotencyStatus.FAILED) {
      // Retry strategy: Reset status to PROCESSING and allow execution
      await this.provider.update(key, IdempotencyStatus.PROCESSING);
      return { proceed: true };
    }

    throw new Error(`Unknown idempotency status: ${record.status}`);
  }

  /**
   * Marks the operation as successfully completed and persists the response.
   */
  public static async complete(key: string, responseSnapshot: any): Promise<void> {
    await this.provider.update(key, IdempotencyStatus.COMPLETED, responseSnapshot);
  }

  /**
   * Marks the operation as failed. 
   * Crucially, we do NOT persist error responses.
   */
  public static async fail(key: string): Promise<void> {
    await this.provider.update(key, IdempotencyStatus.FAILED); // No snapshot stored
  }
}
