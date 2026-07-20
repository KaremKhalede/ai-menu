import { z } from "zod";
import { 
  NotificationRecipientType, 
  NotificationType, 
  NotificationPriority,
  NotificationStatus
} from "../notification-constants";

export const createNotificationSchema = z.object({
  recipientType: z.nativeEnum(NotificationRecipientType),
  recipientId: z.string().optional().nullable(),
  notificationType: z.nativeEnum(NotificationType),
  title: z.string().min(1, "Title is required").max(255),
  message: z.string().min(1, "Message is required"),
  metadata: z.record(z.string(), z.any()).optional().default({}),
  priority: z.nativeEnum(NotificationPriority).optional().default(NotificationPriority.NORMAL),
});

export const getNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  unreadOnly: z.enum(["true", "false"]).optional(),
  recipientType: z.nativeEnum(NotificationRecipientType).optional(),
  recipientId: z.string().optional(),
  notificationType: z.nativeEnum(NotificationType).optional(),
  priority: z.nativeEnum(NotificationPriority).optional(),
  status: z.nativeEnum(NotificationStatus).optional(),
});
