import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  tenantWhere,
  TenantRoles,
  NotFoundError
} from "@/lib/api-framework";

export const GET = withApiHandler(
  async (req, ctx) => {
    const id = ctx.params.id;

    const order = await db.order.findFirst({
      where: {
        id,
        ...tenantWhere(ctx.user),
      },
      include: {
        items: {
          include: {
            dish: {
              select: { name: true, nameEn: true, image: true, categoryId: true }
            }
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return apiSuccess({ order });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER, TenantRoles.EMPLOYEE] 
  }
);
