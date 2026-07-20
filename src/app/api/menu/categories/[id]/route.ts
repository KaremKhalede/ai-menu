import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  validateBody, 
  tenantWhere,
  TenantRoles,
  NotFoundError,
  ConflictError
} from "@/lib/api-framework";
import { updateCategorySchema } from "@/lib/validations/menu";

export const PUT = withApiHandler(
  async (req, ctx) => {
    const id = ctx.params.id;
    const body = await validateBody(req, updateCategorySchema);

    // Verify category exists and belongs to tenant
    const existing = await db.category.findFirst({
      where: {
        id,
        ...tenantWhere(ctx.user),
      },
    });

    if (!existing) {
      throw new NotFoundError("Category not found");
    }

    const category = await db.category.update({
      where: { id },
      data: body,
    });

    return apiSuccess({ category });
  },
  { 
    requireAuth: true, 
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);

export const DELETE = withApiHandler(
  async (req, ctx) => {
    const id = ctx.params.id;

    // Verify category exists and belongs to tenant
    const existing = await db.category.findFirst({
      where: {
        id,
        ...tenantWhere(ctx.user),
      },
      include: {
        _count: {
          select: { dishes: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundError("Category not found");
    }

    // Business Rule: Prevent deleting categories that still contain dishes
    if (existing._count.dishes > 0) {
      throw new ConflictError("Cannot delete category because it contains dishes. Please remove or reassign the dishes first.");
    }

    await db.category.delete({
      where: { id },
    });

    return apiSuccess({ success: true, message: "Category deleted successfully" });
  },
  { 
    requireAuth: true, 
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
