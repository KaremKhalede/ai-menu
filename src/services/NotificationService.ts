import { db } from "@/lib/db";
import { NotificationStatus } from "@/lib/notification-constants";
import { Prisma } from "@prisma/client";

export class NotificationService {
  /**
   * Creates a notification atomically. 
   * Accepts an optional Prisma transaction client.
   * 
   * We stringify the metadata JSON securely. This enables future localization 
   * pipelines where the title/message are ignored in favor of translating 
   * notificationType + metadata on the fly.
   */
  static async createNotification(
    restaurantId: string,
    data: {
      recipientType: string;
      recipientId?: string | null;
      notificationType: string;
      title: string;
      message: string;
      metadata?: Record<string, any>;
      priority?: string;
    },
    tx?: Omit<Prisma.TransactionClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  ) {
    const client = tx || db;

    return await client.notification.create({
      data: {
        restaurantId,
        recipientType: data.recipientType,
        recipientId: data.recipientId,
        notificationType: data.notificationType,
        title: data.title,
        message: data.message,
        metadata: data.metadata ? JSON.stringify(data.metadata) : "{}",
        priority: data.priority || "NORMAL",
        status: NotificationStatus.UNREAD,
      },
    });
  }

  static async markAsRead(restaurantId: string, notificationId: string) {
    const notification = await db.notification.findFirst({
      where: { id: notificationId, restaurantId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return await db.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
  }

  static async archive(restaurantId: string, notificationId: string) {
    const notification = await db.notification.findFirst({
      where: { id: notificationId, restaurantId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return await db.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.ARCHIVED,
      },
    });
  }

  static async getNotificationById(restaurantId: string, notificationId: string) {
    const notification = await db.notification.findFirst({
      where: { id: notificationId, restaurantId },
    });

    if (!notification) return null;

    return {
      ...notification,
      metadata: JSON.parse(notification.metadata),
    };
  }

  static async listNotifications(
    restaurantId: string,
    limit: number,
    skip: number,
    filters?: {
      unreadOnly?: boolean;
      recipientType?: string;
      recipientId?: string;
      notificationType?: string;
      priority?: string;
      status?: string;
    }
  ) {
    const where: Prisma.NotificationWhereInput = {
      restaurantId,
    };

    if (filters?.unreadOnly === true) {
      where.status = NotificationStatus.UNREAD;
    } else if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.recipientType) {
      where.recipientType = filters.recipientType;
    }
    if (filters?.recipientId) {
      where.recipientId = filters.recipientId;
    }
    if (filters?.notificationType) {
      where.notificationType = filters.notificationType;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      db.notification.count({ where }),
      db.notification.count({ where: { restaurantId, status: NotificationStatus.UNREAD } }),
    ]);

    const formattedNotifications = notifications.map(n => ({
      ...n,
      metadata: JSON.parse(n.metadata),
    }));

    return { notifications: formattedNotifications, total, unreadCount };
  }
}
