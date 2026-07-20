import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  NotFoundError
} from "@/lib/api-framework";

export const GET = withApiHandler(
  async (req, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const id = ctx.params.id;

    const customer = await db.customer.findFirst({
      where: {
        id,
        restaurantId,
      },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          }
        }
      }
    });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    return apiSuccess({ customer });
  },
  { 
    requireAuth: true,
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
