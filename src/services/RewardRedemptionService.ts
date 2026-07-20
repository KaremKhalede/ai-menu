import { db } from "@/lib/db";
import { LoyaltyTransactionType, RedemptionStatus } from "@/lib/loyalty-constants";
import { Prisma } from "@prisma/client";
import { LockManager } from "@/lib/concurrency/LockManager";
import { LockScope } from "@/lib/concurrency/LockProvider";
import { DomainEventBus, createDomainEvent, DomainEventType } from "@/lib/events/DomainEvent";
import { RequestContextManager } from "@/lib/request-context/RequestContextManager";

export class RewardRedemptionService {
  static async redeemReward(
    rewardId: string,
    customerId: string,
    txClient?: Prisma.TransactionClient
  ) {
    const restaurantId = RequestContextManager.get().tenantId!;
    // 2. Wrap all validation and deductions in an isolated transaction
    const run = async (tx: Prisma.TransactionClient) => {
      // Check reward validity and configuration
      const reward = await tx.reward.findFirst({
        where: { id: rewardId, restaurantId, deletedAt: null, active: true },
      });

      if (!reward) {
        throw new Error("Reward is unavailable or does not exist");
      }

      const now = new Date();
      if (reward.startsAt && reward.startsAt > now) {
        throw new Error("Reward is not yet active");
      }
      if (reward.endsAt && reward.endsAt < now) {
        throw new Error("Reward has expired");
      }

      // Check customer points
      const loyaltyAccount = await tx.loyaltyAccount.findUnique({
        where: { customerId },
      });

      if (!loyaltyAccount || loyaltyAccount.currentPoints < reward.pointsCost) {
        throw new Error("Insufficient points for this reward");
      }

      const balanceAfter = loyaltyAccount.currentPoints - reward.pointsCost;

      // Deduct Points
      await tx.loyaltyAccount.update({
        where: { id: loyaltyAccount.id },
        data: {
          currentPoints: balanceAfter,
          lifetimeRedeemedPoints: loyaltyAccount.lifetimeRedeemedPoints + reward.pointsCost,
        },
      });

      // Insert LoyaltyTransaction for the spend
      const loyaltyTx = await tx.loyaltyTransaction.create({
        data: {
          loyaltyAccountId: loyaltyAccount.id,
          customerId,
          restaurantId,
          transactionType: LoyaltyTransactionType.POINTS_REDEEMED,
          points: -reward.pointsCost,
          balanceAfter,
          metadata: JSON.stringify({ rewardId }),
        },
      });

      // Structured JSON Snapshot of reward configuration
      const rewardSnapshot = JSON.stringify({
        name: reward.name,
        rewardType: reward.rewardType,
        pointsCost: reward.pointsCost,
        monetaryValue: reward.monetaryValue,
      });

      // Insert RewardRedemption record
      const redemption = await tx.rewardRedemption.create({
        data: {
          restaurantId,
          customerId,
          rewardId,
          loyaltyTransactionId: loyaltyTx.id,
          pointsSpent: reward.pointsCost,
          rewardSnapshot,
          redemptionStatus: RedemptionStatus.COMPLETED,
        },
      });

      // Append Customer Event
      await tx.customerEvent.create({
        data: {
          customerId,
          restaurantId,
          eventType: "REWARD_REDEEMED",
          metadata: JSON.stringify({
            rewardId,
            redemptionId: redemption.id,
            pointsSpent: reward.pointsCost,
            rewardName: reward.name,
          }),
        },
      });

      // Audit Logging
      DomainEventBus.getInstance().publish(
        createDomainEvent(DomainEventType.REWARD_REDEEMED, redemption.id, "RewardRedemption", redemption, {
          rewardId: reward.id,
          customerId: customerId,
          pointsSpent: reward.pointsCost
        })
      );

      return redemption;
    };

    if (txClient) {
      return await LockManager.withLock(LockScope.LOYALTY_ACCOUNT, customerId, () => run(txClient));
    }
    return await LockManager.withLock(LockScope.LOYALTY_ACCOUNT, customerId, () => db.$transaction(run));
  }

  static async getCustomerRedemptions(
    customerId: string,
    limit: number,
    skip: number
  ) {
    const restaurantId = RequestContextManager.get().tenantId!;
    // Validate customer belongs to tenant
    const customer = await db.customer.findFirst({
      where: { id: customerId, restaurantId },
    });

    if (!customer) {
      throw new Error("Customer not found or unauthorized");
    }

    const where: Prisma.RewardRedemptionWhereInput = {
      restaurantId,
      customerId,
    };

    const [redemptions, total] = await Promise.all([
      db.rewardRedemption.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      db.rewardRedemption.count({ where }),
    ]);

    return { redemptions, total };
  }
}
