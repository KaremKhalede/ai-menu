import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  ValidationError
} from "@/lib/api-framework";
import { redeemRewardSchema } from "@/lib/validations/redemptions";
import { RewardRedemptionService } from "@/services/RewardRedemptionService";
import { IdempotencyWrapper, IdempotencyPolicy } from "@/lib/idempotency/IdempotencyWrapper";
import { RateLimitPolicies } from "@/lib/rate-limiting/RateLimitPolicies";
import { NextRequest } from "next/server";

export const POST = withApiHandler(
  async (req: NextRequest, ctx) => {
    // Tenant context is now implicitly handled via RequestContext globally in withApiHandler
    const rewardId = ctx.params.id;
    const body = await validateBody(req, redeemRewardSchema);

    try {
      const { data: redemption, cached } = await IdempotencyWrapper.execute(
        req,
        body,
        IdempotencyPolicy.REQUIRED,
        async () => {
          return await RewardRedemptionService.redeemReward(
            rewardId,
            body.customerId
          );
        }
      );

      return apiSuccess({
        redemption: {
          id: redemption.id,
          redemptionStatus: redemption.redemptionStatus,
          pointsSpent: redemption.pointsSpent,
          rewardSnapshot: JSON.parse(redemption.rewardSnapshot),
          redeemedAt: redemption.redeemedAt,
        }
      }, cached ? "Reward redemption returned from cache" : null, 201);
    } catch (error: any) {
      if (
        error.message === "Reward is unavailable or does not exist" ||
        error.message === "Reward is not yet active" ||
        error.message === "Reward has expired" ||
        error.message === "Insufficient points for this reward"
      ) {
        throw new ValidationError(error.message);
      }
      
      // Catch Prisma P2002 explicitly for idempotency if it slips through the first check
      if (error.code === 'P2002' && error.meta?.target?.includes('idempotencyKey')) {
        // Technically this shouldn't happen because of the first check, 
        // but it's the final safety net against extreme race conditions
        throw new ValidationError("Redemption already processed for this idempotency key.");
      }

      throw error;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER],
    rateLimit: RateLimitPolicies.CRITICAL_OPERATIONS
  }
);
