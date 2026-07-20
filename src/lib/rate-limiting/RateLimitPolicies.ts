import { RateLimitPolicy, FixedWindowPolicy } from "./RateLimitPolicy";
import { IdentityStrategy, IpIdentityStrategy, TenantIdentityStrategy, UserIdentityStrategy } from "./RateLimitKeyBuilder";

export interface RateLimitConfig {
  strategy: IdentityStrategy;
  policy: RateLimitPolicy;
  cost: number;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

/**
 * Predefined Rate Limit Policies for the API.
 * This completely isolates policy definitions from the route implementations.
 */
export const RateLimitPolicies = {
  // CRITICAL OPERATIONS: Checkout, Refunds, etc. (Tenant isolated)
  CRITICAL_OPERATIONS: {
    strategy: new TenantIdentityStrategy(),
    policy: new FixedWindowPolicy(process.env.PLAYWRIGHT_TEST === '1' ? 1000 : 100, MINUTE), // 100 requests per minute
    cost: 1,
  } as RateLimitConfig,

  // HEAVY AI GENERATION: High cost, lower limit
  AI_GENERATION: {
    strategy: new TenantIdentityStrategy(),
    policy: new FixedWindowPolicy(process.env.PLAYWRIGHT_TEST === '1' ? 1000 : 20, MINUTE),
    cost: 5, // AI requests cost 5x by default
  } as RateLimitConfig,

  // STANDARD INTERNAL OPS: Promotions, Rewards, Menu Management
  STANDARD_INTERNAL: {
    strategy: new TenantIdentityStrategy(),
    policy: new FixedWindowPolicy(500, MINUTE),
    cost: 1,
  } as RateLimitConfig,

  // PUBLIC/AUTH: Login, OTP (IP isolated to prevent brute force)
  PUBLIC_AUTH: {
    strategy: new IpIdentityStrategy(),
    policy: new FixedWindowPolicy(10, MINUTE), // 10 requests per minute per IP
    cost: 1,
  } as RateLimitConfig,

  // GENERAL PUBLIC API: Anonymous catalog access
  PUBLIC_API: {
    strategy: new IpIdentityStrategy(),
    policy: new FixedWindowPolicy(100, MINUTE),
    cost: 1,
  } as RateLimitConfig,
};
