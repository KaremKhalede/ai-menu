import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  ValidationError
} from "@/lib/api-framework";
import { getRedemptionsQuerySchema } from "@/lib/validations/redemptions";
import { RewardRedemptionService } from "@/services/RewardRedemptionService";
import { NextRequest } from "next/server";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    const customerId = ctx.params.id;

    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const parsed = getRedemptionsQuerySchema.safeParse(queryData);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.issues);
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    try {
      const { redemptions, total } = await RewardRedemptionService.getCustomerRedemptions(
        customerId,
        limit,
        skip
      );

      return apiSuccess({
        redemptions: redemptions.map(r => ({
          id: r.id,
          rewardId: r.rewardId,
          pointsSpent: r.pointsSpent,
          redemptionStatus: r.redemptionStatus,
          rewardSnapshot: JSON.parse(r.rewardSnapshot),
          redeemedAt: r.redeemedAt,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      });
    } catch (e: any) {
      if (e.message === "Customer not found or unauthorized") {
        throw new ValidationError(e.message);
      }
      throw e;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
