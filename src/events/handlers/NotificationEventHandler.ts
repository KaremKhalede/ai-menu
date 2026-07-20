import { DomainEvent, DomainEventBus, DomainEventType } from "@/lib/events/DomainEvent";
import { NotificationType, NotificationRecipientType } from "@/lib/notification-constants";
import { JobDispatcher } from "@/lib/jobs/JobDispatcher";
import { JobType } from "@/lib/jobs/JobTypes";

export class NotificationEventHandler {
  static handleOrderCreated = async (event: DomainEvent<any>) => {
    const { restaurantId, customerId, grandTotal } = event.payload;

    // Fire and forget: delegate execution to background job queue
    await JobDispatcher.enqueue(JobType.SEND_NOTIFICATION, {
      restaurantId,
      recipientType: NotificationRecipientType.STAFF,
      notificationType: NotificationType.ORDER_CREATED,
      title: `New Order #${event.aggregateId.slice(-6)}`,
      message: `Order received for $${grandTotal}`,
      metadata: { orderId: event.aggregateId, customerId },
    });
  };

  static register() {
    const bus = DomainEventBus.getInstance();
    bus.subscribe(DomainEventType.ORDER_CREATED, NotificationEventHandler.handleOrderCreated);
  }
}
