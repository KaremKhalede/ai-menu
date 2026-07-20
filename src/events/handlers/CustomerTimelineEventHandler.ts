import { DomainEventBus, DomainEventType, DomainEvent } from "@/lib/events/DomainEvent";
import { db } from "@/lib/db";
import { LoyaltyTransactionType } from "@/lib/loyalty-constants";

export class CustomerTimelineEventHandler {
  static handleRewardRedeemed = async (event: DomainEvent<any>) => {
    const { restaurantId, customerId, rewardId, pointsSpent, rewardName } = event.payload;

    await db.customerEvent.create({
      data: {
        customerId,
        restaurantId,
        eventType: "REWARD_REDEEMED",
        metadata: JSON.stringify({
          rewardId,
          redemptionId: event.aggregateId,
          pointsSpent,
          rewardName,
        }),
      },
    });
  };

  static handlePointsAwarded = async (event: DomainEvent<any>) => {
    const { restaurantId, customerId, orderId, pointsEarned } = event.payload;

    await db.customerEvent.create({
      data: {
        customerId,
        restaurantId,
        eventType: LoyaltyTransactionType.POINTS_EARNED,
        metadata: JSON.stringify({ orderId, pointsEarned }),
      },
    });
  };

  static register() {
    const bus = DomainEventBus.getInstance();
    bus.subscribe(DomainEventType.REWARD_REDEEMED, CustomerTimelineEventHandler.handleRewardRedeemed);
    bus.subscribe(DomainEventType.LOYALTY_POINTS_AWARDED, CustomerTimelineEventHandler.handlePointsAwarded);
  }
}
