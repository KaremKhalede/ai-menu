import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  ValidationError
} from "@/lib/api-framework";
import { createRewardSchema, getRewardsQuerySchema } from "@/lib/validations/rewards";
import { RewardService } from "@/services/RewardService";
import { NextRequest } from "next/server";

export const POST = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const body = await validateBody(req, createRewardSchema);

    const reward = await RewardService.createReward(restaurantId, body);
    
    return apiSuccess(reward, null, 201);
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    
    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const parsed = getRewardsQuerySchema.safeParse(queryData);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.issues);
    }

    const { page, limit, active, rewardType, search } = parsed.data;
    const skip = (page - 1) * limit;

    const filters = {
      active: active === "true" ? true : active === "false" ? false : undefined,
      rewardType,
      search,
    };

    const { rewards, total } = await RewardService.getRewards(restaurantId, limit, skip, filters);

    return apiSuccess({
      rewards,
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
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
