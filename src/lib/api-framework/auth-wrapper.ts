import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, authorizeRoles } from '@/lib/auth-helper';
import { apiError } from './response';
import { UnauthorizedError, ForbiddenError } from './errors';
import type { AuthenticatedUser } from '@/lib/auth-helper';
import { RequestContextInitializer } from '@/lib/request-context/RequestContextInitializer';
import { RequestContextManager } from '@/lib/request-context/RequestContextManager';
import crypto from 'crypto';
import { RateLimitManager } from '@/lib/rate-limiting/RateLimitManager';
import { RateLimitConfig } from '@/lib/rate-limiting/RateLimitPolicies';
import { RateLimitResult } from '@/lib/rate-limiting/RateLimitTypes';

export interface RouteContext {
  params: Record<string, string>;
  user?: AuthenticatedUser;
}

export interface RouteOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  rateLimit?: RateLimitConfig;
}

type HandlerFunction = (req: NextRequest, ctx: RouteContext) => Promise<Response> | Response;

export const withApiHandler = (handler: HandlerFunction, options: RouteOptions = {}) => {
  return async (req: NextRequest, context: any) => {
    try {
      const resolvedParams = context?.params ? await context.params : {};
      const ctx: RouteContext = { params: resolvedParams };

      if (options.requireAuth || options.allowedRoles) {
        const user = await getSessionUser(req);
        if (!user) {
          throw new UnauthorizedError('يجب تسجيل الدخول');
        }

        if (options.allowedRoles && options.allowedRoles.length > 0) {
          if (!authorizeRoles(user, options.allowedRoles)) {
            throw new ForbiddenError('صلاحيات غير كافية');
          }
        }

        ctx.user = user;
      }

      // Initialize RequestContext globally for every request
      const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
      const correlationId = req.headers.get('x-correlation-id') || undefined;
      const tenantId = ctx.user?.restaurantId || req.headers.get('x-tenant-id') || undefined;
      const userId = ctx.user?.id || req.headers.get('x-customer-id') || undefined;
      
      const reqContext = RequestContextInitializer.create({
        requestId,
        correlationId,
        tenantId,
        userId,
      });

      // Bind context to execution boundary
      return await RequestContextManager.run(reqContext, async () => {
        let rlResult: RateLimitResult | null = null;
        
        if (options.rateLimit) {
          const rlContext = {
            ip: req.headers.get("x-forwarded-for") || "unknown",
            userId: reqContext.userId,
            tenantId: reqContext.tenantId,
            endpoint: req.nextUrl.pathname,
          };
          rlResult = await RateLimitManager.consume(
            rlContext,
            options.rateLimit.strategy,
            options.rateLimit.policy,
            options.rateLimit.cost
          );

          if (!rlResult.allowed) {
            const errRes = NextResponse.json(
              { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
              { status: 429 }
            );
            errRes.headers.set('X-RateLimit-Limit', rlResult.limit.toString());
            errRes.headers.set('X-RateLimit-Remaining', rlResult.remaining.toString());
            errRes.headers.set('X-RateLimit-Reset', rlResult.resetAt.toString());
            errRes.headers.set('Retry-After', rlResult.retryAfter.toString());
            return errRes;
          }
        }

        let response: Response;
        try {
          response = await handler(req, ctx);
        } catch (error) {
          response = apiError(error);
        }

        if (rlResult) {
          response.headers.set('X-RateLimit-Limit', rlResult.limit.toString());
          response.headers.set('X-RateLimit-Remaining', rlResult.remaining.toString());
          response.headers.set('X-RateLimit-Reset', rlResult.resetAt.toString());
        }

        return response;
      });
    } catch (error) {
      return apiError(error);
    }
  };
};
