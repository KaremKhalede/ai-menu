export enum FailureStrategy {
  FAIL_OPEN = "FAIL_OPEN",
  FAIL_CLOSED = "FAIL_CLOSED",
}

export interface RateLimitContext {
  ip?: string;
  userId?: string;
  tenantId?: string;
  apiKey?: string;
  endpoint: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // Unix timestamp in milliseconds
  retryAfter: number; // Seconds to wait if not allowed
}
