import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  NotFoundError,
  ValidationError
} from "@/lib/api-framework";
import { updateRewardSchema } from "@/lib/validations/rewards";
import { RewardService } from "@/services/RewardService";
import { NextRequest } from "next/server";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const rewardId = ctx.params.id;

    const reward = await RewardService.getRewardById(restaurantId, rewardId);
    
    if (!reward) {
      throw new NotFoundError("Reward not found");
    }

    return apiSuccess({ reward });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);

export const PATCH = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const rewardId = ctx.params.id;
    const body = await validateBody(req, updateRewardSchema);

    try {
      const reward = await RewardService.updateReward(restaurantId, rewardId, body);
      return apiSuccess({ reward });
    } catch (error: any) {
      if (error.message === "Reward not found") {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);

export const DELETE = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const rewardId = ctx.params.id;

    try {
      await RewardService.softDeleteReward(restaurantId, rewardId);
      return apiSuccess({ message: "Reward deleted successfully" });
    } catch (error: any) {
      if (error.message === "Reward not found") {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
