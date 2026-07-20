import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  validateBody, 
  tenantWhere,
  requireTenant,
  TenantRoles
} from "@/lib/api-framework";
import { createCategorySchema } from "@/lib/validations/menu";

export const GET = withApiHandler(
  async (req, ctx) => {
    const categories = await db.category.findMany({
      where: tenantWhere(ctx.user),
      orderBy: { sortOrder: 'asc' },
    });
    return apiSuccess({ categories });
  },
  { requireAuth: true }
);

export const POST = withApiHandler(
  async (req, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const body = await validateBody(req, createCategorySchema);

    const category = await db.category.create({
      data: {
        ...body,
        restaurantId,
      },
    });

    return apiSuccess({ category }, 201);
  },
  { 
    requireAuth: true, 
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
