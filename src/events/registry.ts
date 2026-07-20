import { NotificationEventHandler } from "./handlers/NotificationEventHandler";
import { CustomerTimelineEventHandler } from "./handlers/CustomerTimelineEventHandler";
import { AnalyticsEventHandler } from "./handlers/AnalyticsEventHandler";

let isRegistered = false;

export function registerDomainEventHandlers() {
  if (isRegistered) return;
  
  NotificationEventHandler.register();
  CustomerTimelineEventHandler.register();
  AnalyticsEventHandler.register();
  
  isRegistered = true;
  console.log("[DomainEventBus] Handlers registered successfully.");
}
