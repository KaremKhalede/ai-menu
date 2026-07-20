import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  ValidationError
} from "@/lib/api-framework";
import { createPromotionSchema, getPromotionsQuerySchema } from "@/lib/validations/promotions";
import { PromotionService } from "@/services/PromotionService";
import { IdempotencyWrapper, IdempotencyPolicy } from "@/lib/idempotency/IdempotencyWrapper";
import { RateLimitPolicies } from "@/lib/rate-limiting/RateLimitPolicies";
import { NextRequest } from "next/server";

export const POST = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    const body = await validateBody(req, createPromotionSchema);

    try {
      const { data: promotion, cached } = await IdempotencyWrapper.execute(
        req,
        body,
        IdempotencyPolicy.OPTIONAL,
        async () => {
          return await PromotionService.createPromotion(body);
        }
      );
      
      return apiSuccess({
        ...promotion,
        metadata: JSON.parse(promotion.metadata)
      }, cached ? "Promotion returned from cache" : null, 201);
    } catch (error: any) {
      throw error;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER],
    rateLimit: RateLimitPolicies.STANDARD_INTERNAL
  }
);

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    
    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const parsed = getPromotionsQuerySchema.safeParse(queryData);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.issues);
    }

    const { page, limit, active, currentlyActive, promotionType, search } = parsed.data;
    const skip = (page - 1) * limit;

    const filters: any = {
      promotionType,
      search,
    };

    if (active !== undefined) {
      filters.active = active === "true";
    }
    if (currentlyActive !== undefined) {
      filters.currentlyActive = currentlyActive === "true";
    }

    const { promotions, total } = await PromotionService.listPromotions(
      limit, 
      skip, 
      filters
    );

    return apiSuccess({
      promotions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER],
    rateLimit: RateLimitPolicies.STANDARD_INTERNAL
  }
);
