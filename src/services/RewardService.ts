import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class RewardService {
  static async createReward(restaurantId: string, data: Prisma.RewardCreateWithoutRestaurantInput) {
    return await db.reward.create({
      data: {
        ...data,
        restaurantId,
      },
    });
  }

  static async updateReward(restaurantId: string, rewardId: string, data: Prisma.RewardUpdateInput) {
    // Ensure the reward belongs to the tenant and is not deleted
    const reward = await db.reward.findFirst({
      where: { id: rewardId, restaurantId, deletedAt: null },
    });

    if (!reward) {
      throw new Error("Reward not found");
    }

    return await db.reward.update({
      where: { id: rewardId },
      data,
    });
  }

  static async softDeleteReward(restaurantId: string, rewardId: string) {
    const reward = await db.reward.findFirst({
      where: { id: rewardId, restaurantId, deletedAt: null },
    });

    if (!reward) {
      throw new Error("Reward not found");
    }

    return await db.reward.update({
      where: { id: rewardId },
      data: { deletedAt: new Date() },
    });
  }

  static async getRewardById(restaurantId: string, rewardId: string) {
    return await db.reward.findFirst({
      where: { id: rewardId, restaurantId, deletedAt: null },
    });
  }

  static async getRewards(
    restaurantId: string,
    limit: number,
    skip: number,
    filters?: {
      active?: boolean;
      rewardType?: string;
      search?: string;
    }
  ) {
    const where: Prisma.RewardWhereInput = {
      restaurantId,
      deletedAt: null,
    };

    if (filters?.active !== undefined) {
      where.active = filters.active;
    }
    if (filters?.rewardType !== undefined) {
      where.rewardType = filters.rewardType;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const [rewards, total] = await Promise.all([
      db.reward.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      db.reward.count({ where }),
    ]);

    return { rewards, total };
  }
}
