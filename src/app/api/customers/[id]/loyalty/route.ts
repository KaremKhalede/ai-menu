import { db } from "@/lib/db";
import { 
  withApiHandler, 
  apiSuccess, 
  requireTenant,
  TenantRoles,
  ValidationError
} from "@/lib/api-framework";
import { z } from "zod";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

const getLoyaltyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const GET = withApiHandler(
  async (req: NextRequest, ctx) => {
    const restaurantId = requireTenant(ctx.user);
    const customerId = ctx.params.id;

    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const parsed = getLoyaltyQuerySchema.safeParse(queryData);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.issues);
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    // Strict Tenant Isolation
    const customer = await db.customer.findFirst({
      where: { id: customerId, restaurantId },
    });

    if (!customer) {
      throw new ValidationError("Customer not found or unauthorized");
    }

    // Fetch materialized loyalty account
    let loyaltyAccount = await db.loyaltyAccount.findUnique({
      where: { customerId },
    });

    // If they have no account, return empty state instead of 404
    if (!loyaltyAccount) {
      return apiSuccess({
        loyaltyAccount: {
          currentPoints: 0,
          lifetimeEarnedPoints: 0,
          lifetimeRedeemedPoints: 0,
        },
        recentTransactions: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        }
      });
    }

    // Fetch paginated ledger transactions
    const where: Prisma.LoyaltyTransactionWhereInput = {
      loyaltyAccountId: loyaltyAccount.id,
      restaurantId,
    };

    const [transactions, total] = await Promise.all([
      db.loyaltyTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.loyaltyTransaction.count({ where }),
    ]);

    return apiSuccess({
      loyaltyAccount: {
        currentPoints: loyaltyAccount.currentPoints,
        lifetimeEarnedPoints: loyaltyAccount.lifetimeEarnedPoints,
        lifetimeRedeemedPoints: loyaltyAccount.lifetimeRedeemedPoints,
      },
      recentTransactions: transactions.map(tx => ({
        id: tx.id,
        transactionType: tx.transactionType,
        points: tx.points,
        balanceAfter: tx.balanceAfter,
        orderId: tx.orderId,
        metadata: JSON.parse(tx.metadata),
        createdAt: tx.createdAt,
      })),
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
