import { DomainEventBus, DomainEventType, DomainEvent } from "@/lib/events/DomainEvent";
import { JobDispatcher } from "@/lib/jobs/JobDispatcher";
import { JobType } from "@/lib/jobs/JobTypes";

export class AnalyticsEventHandler {
  static handleEvent = async (event: DomainEvent<any>) => {
    // Defer processing to the background job queue
    await JobDispatcher.enqueue(JobType.GENERATE_ANALYTICS, {
      type: event.eventType,
      payload: {
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        payload: event.payload,
      }
    });
  };

  static register() {
    const bus = DomainEventBus.getInstance();
    
    // Subscribe to all crucial domain events for analytics
    bus.subscribe(DomainEventType.ORDER_CREATED, AnalyticsEventHandler.handleEvent);
    bus.subscribe(DomainEventType.ORDER_COMPLETED, AnalyticsEventHandler.handleEvent);
    bus.subscribe(DomainEventType.REWARD_REDEEMED, AnalyticsEventHandler.handleEvent);
    bus.subscribe(DomainEventType.CUSTOMER_CREATED, AnalyticsEventHandler.handleEvent);
    bus.subscribe(DomainEventType.PROMOTION_CREATED, AnalyticsEventHandler.handleEvent);
  }
}
