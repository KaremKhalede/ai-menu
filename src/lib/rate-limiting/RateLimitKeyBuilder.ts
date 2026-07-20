import { RateLimitContext } from "./RateLimitTypes";

export interface IdentityStrategy {
  /**
   * Resolves a unique identity string based on the context.
   * If the required identity field is missing, it should throw or return a fallback.
   */
  resolveIdentity(context: RateLimitContext): string;
}

export class IpIdentityStrategy implements IdentityStrategy {
  resolveIdentity(context: RateLimitContext): string {
    if (!context.ip) return "global-fallback-ip";
    return `ip:${context.ip}`;
  }
}

export class TenantIdentityStrategy implements IdentityStrategy {
  resolveIdentity(context: RateLimitContext): string {
    if (!context.tenantId) throw new Error("Tenant ID is required for this rate limit strategy");
    return `tenant:${context.tenantId}`;
  }
}

export class UserIdentityStrategy implements IdentityStrategy {
  resolveIdentity(context: RateLimitContext): string {
    if (!context.userId) throw new Error("User ID is required for this rate limit strategy");
    return `user:${context.userId}`;
  }
}

export class RateLimitKeyBuilder {
  /**
   * Combines the endpoint and the resolved identity into a deterministic storage key.
   */
  static buildKey(endpoint: string, identity: string): string {
    return `rate_limit:${endpoint}:${identity}`;
  }
}
