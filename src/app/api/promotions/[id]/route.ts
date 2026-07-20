import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  NotFoundError
} from "@/lib/api-framework";
import { updatePromotionSchema } from "@/lib/validations/promotions";
import { PromotionService } from "@/services/PromotionService";
import { NextRequest } from "next/server";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    const promotionId = ctx.params.id;

    const promotion = await PromotionService.getPromotion(promotionId);
    
    if (!promotion) {
      throw new NotFoundError("Promotion not found");
    }

    return apiSuccess({ promotion });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);

export const PATCH = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    const promotionId = ctx.params.id;
    const body = await validateBody(req, updatePromotionSchema);

    try {
      const promotion = await PromotionService.updatePromotion(promotionId, body);
      return apiSuccess({
        ...promotion,
        metadata: JSON.parse(promotion.metadata)
      });
    } catch (e: any) {
      if (e.message === "Promotion not found") {
        throw new NotFoundError(e.message);
      }
      throw e;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);

export const DELETE = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    const promotionId = ctx.params.id;

    try {
      await PromotionService.archivePromotion(promotionId);
      return apiSuccess(null, "Promotion deleted successfully");
    } catch (e: any) {
      if (e.message === "Promotion not found") {
        throw new NotFoundError(e.message);
      }
      throw e;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
