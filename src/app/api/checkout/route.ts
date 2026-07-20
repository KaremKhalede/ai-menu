import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  ValidationError
} from "@/lib/api-framework";
import { checkoutRequestSchema } from "@/lib/validations/checkout";
import { CheckoutService } from "@/services/CheckoutService";
import { IdempotencyWrapper, IdempotencyPolicy } from "@/lib/idempotency/IdempotencyWrapper";
import { RateLimitPolicies } from "@/lib/rate-limiting/RateLimitPolicies";
import { NextRequest } from "next/server";

export const POST = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    const body = await validateBody(req, checkoutRequestSchema);

    try {
      const { data: result, cached } = await IdempotencyWrapper.execute(
        req,
        body,
        IdempotencyPolicy.REQUIRED,
        async () => {
          return await CheckoutService.processCheckout(
            body.customerId,
            body.items,
            body.rewardId
          );
        }
      );

      return apiSuccess(result, cached ? "Checkout returned from cache" : "Checkout completed successfully", 201);
    } catch (error: any) {
      if (error.message.includes("not found") || error.message.includes("Insufficient points")) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  },
  { 
    requireAuth: true,
    // POS terminal operators, owners, managers
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE],
    rateLimit: RateLimitPolicies.CRITICAL_OPERATIONS
  }
);
