import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  validateBody,
  ValidationError
} from "@/lib/api-framework";
import { createNotificationSchema, getNotificationsQuerySchema } from "@/lib/validations/notifications";
import { NotificationService } from "@/services/NotificationService";
import { NextRequest } from "next/server";

export const POST = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const body = await validateBody(req, createNotificationSchema);

    const notification = await NotificationService.createNotification(restaurantId, body);
    
    return apiSuccess({
      ...notification,
      metadata: JSON.parse(notification.metadata)
    }, null, 201);
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE] 
  }
);

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    
    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const parsed = getNotificationsQuerySchema.safeParse(queryData);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.issues);
    }

    const { page, limit, unreadOnly, recipientType, recipientId, notificationType, priority, status } = parsed.data;
    const skip = (page - 1) * limit;

    const filters = {
      unreadOnly: unreadOnly === "true",
      recipientType,
      recipientId,
      notificationType,
      priority,
      status,
    };

    const { notifications, total, unreadCount } = await NotificationService.listNotifications(
      restaurantId, 
      limit, 
      skip, 
      filters
    );

    return apiSuccess({
      notifications,
      unreadCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE] 
  }
);
