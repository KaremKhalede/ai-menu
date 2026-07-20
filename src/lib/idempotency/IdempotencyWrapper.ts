import { NextRequest } from "next/server";
import { IdempotencyManager } from "./IdempotencyManager";
import { ValidationError } from "../api-framework/errors";

export enum IdempotencyPolicy {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
  DISABLED = "DISABLED",
}

export class IdempotencyWrapper {
  /**
   * Coordinates the idempotency lifecycle around a business transaction.
   * Ensures complete() is only called if the business logic fully succeeds.
   * Ensures fail() is called if any exception or rollback occurs.
   */
  public static async execute<T>(
    req: NextRequest,
    payload: any,
    policy: IdempotencyPolicy,
    businessLogic: () => Promise<T>
  ): Promise<{ data: T; cached: boolean }> {
    if (policy === IdempotencyPolicy.DISABLED) {
      const data = await businessLogic();
      return { data, cached: false };
    }

    const idempotencyKey = req.headers.get("idempotency-key") || req.headers.get("Idempotency-Key");

    if (!idempotencyKey) {
      if (policy === IdempotencyPolicy.REQUIRED) {
        throw new ValidationError("Idempotency-Key header is required for this operation.");
      }
      // Policy is OPTIONAL and key is missing
      const data = await businessLogic();
      return { data, cached: false };
    }

    const { proceed, cachedResponse } = await IdempotencyManager.begin(idempotencyKey, payload);

    if (!proceed) {
      return { data: cachedResponse, cached: true };
    }

    try {
      const data = await businessLogic();
      
      // Business transaction successfully committed. We can now persist the successful response.
      await IdempotencyManager.complete(idempotencyKey, data);
      
      return { data, cached: false };
    } catch (error) {
      // Business transaction failed or rolled back.
      // Transition to FAILED state to allow future retries, without persisting this error snapshot.
      await IdempotencyManager.fail(idempotencyKey);
      throw error;
    }
  }
}
