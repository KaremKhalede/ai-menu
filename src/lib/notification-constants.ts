export enum NotificationRecipientType {
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  SYSTEM = "SYSTEM",
}

export enum NotificationType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  LOYALTY_POINTS_EARNED = "LOYALTY_POINTS_EARNED",
  REWARD_REDEEMED = "REWARD_REDEEMED",
  CUSTOMER_CREATED = "CUSTOMER_CREATED",
  SYSTEM = "SYSTEM",
}

export enum NotificationPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
}
