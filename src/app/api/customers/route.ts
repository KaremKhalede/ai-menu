import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  ValidationError
} from "@/lib/api-framework";
import { getCustomersQuerySchema } from "@/lib/validations/customers";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);

    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const parsed = getCustomersQuerySchema.safeParse(queryData);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.issues);
    }

    const { page, limit, search, minSpent, maxSpent, sort } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {
      restaurantId,
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (minSpent !== undefined || maxSpent !== undefined) {
      where.totalSpent = {};
      if (minSpent !== undefined) where.totalSpent.gte = minSpent;
      if (maxSpent !== undefined) where.totalSpent.lte = maxSpent;
    }

    let orderBy: Prisma.CustomerOrderByWithRelationInput = {};
    switch (sort) {
      case "lastOrderAt_desc": orderBy = { lastOrderAt: "desc" }; break;
      case "lastOrderAt_asc": orderBy = { lastOrderAt: "asc" }; break;
      case "totalSpent_desc": orderBy = { totalSpent: "desc" }; break;
      case "totalSpent_asc": orderBy = { totalSpent: "asc" }; break;
      case "totalOrders_desc": orderBy = { totalOrders: "desc" }; break;
      case "createdAt_desc": orderBy = { createdAt: "desc" }; break;
      default: orderBy = { lastOrderAt: "desc" };
    }

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      db.customer.count({ where }),
    ]);

    return apiSuccess({
      customers,
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
    allowedRoles: [TenantRoles.OWNER, TenantRoles.MANAGER] 
  }
);
