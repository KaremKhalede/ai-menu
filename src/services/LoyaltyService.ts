import { PrismaClient } from "@prisma/client";
import { LoyaltyTransactionType, calculateEarnedPoints } from "@/lib/loyalty-constants";

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export class LoyaltyService {
  /**
   * Awards points for a completed order.
   * Enforces atomicity by running on the provided Prisma transaction.
   * 
   * Ledger is Append-Only: We never modify an existing LoyaltyTransaction.
   */
  static async awardPointsForOrder(
    tx: TransactionClient,
    customerId: string,
    restaurantId: string,
    orderId: string,
    orderTotal: number
  ) {
    const pointsToAward = calculateEarnedPoints(orderTotal);
    if (pointsToAward <= 0) return;

    // 1. Fetch or create LoyaltyAccount
    let account = await tx.loyaltyAccount.findUnique({
      where: { customerId },
    });

    if (!account) {
      account = await tx.loyaltyAccount.create({
        data: {
          customerId,
          restaurantId,
          currentPoints: 0,
          lifetimeEarnedPoints: 0,
          lifetimeRedeemedPoints: 0,
        },
      });
    }

    const balanceAfter = account.currentPoints + pointsToAward;

    // 2. Update LoyaltyAccount
    await tx.loyaltyAccount.update({
      where: { id: account.id },
      data: {
        currentPoints: balanceAfter,
        lifetimeEarnedPoints: account.lifetimeEarnedPoints + pointsToAward,
      },
    });

    // 3. Append to LoyaltyTransaction Ledger (Append-Only)
    await tx.loyaltyTransaction.create({
      data: {
        loyaltyAccountId: account.id,
        customerId,
        restaurantId,
        transactionType: LoyaltyTransactionType.POINTS_EARNED,
        points: pointsToAward,
        balanceAfter,
        orderId,
        metadata: JSON.stringify({ orderTotal, rule: "1 point per 1 unit" }),
      },
    });

    // 4. Append to CustomerEvent timeline
    await tx.customerEvent.create({
      data: {
        customerId,
        restaurantId,
        eventType: LoyaltyTransactionType.POINTS_EARNED,
        metadata: JSON.stringify({ orderId, pointsEarned: pointsToAward }),
      },
    });
  }
}
