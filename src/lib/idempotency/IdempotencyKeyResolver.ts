import crypto from "crypto";

export class IdempotencyKeyResolver {
  /**
   * Computes a deterministic SHA-256 hash of the request payload.
   * This is used to verify that a client isn't reusing an idempotency key
   * with a completely different payload (which is a contract violation).
   */
  static computeHash(payload: any): string {
    const serialized = typeof payload === "string" ? payload : JSON.stringify(payload || {});
    return crypto.createHash("sha256").update(serialized).digest("hex");
  }
}
