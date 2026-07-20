import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { CacheManager } from "@/lib/cache/CacheManager";
import { CacheKeyBuilder } from "@/lib/cache/CacheKeyBuilder";
import { DomainEventBus, createDomainEvent, DomainEventType } from "@/lib/events/DomainEvent";
import { RequestContextManager } from "@/lib/request-context/RequestContextManager";

export class PromotionService {
  static async createPromotion(data: any) {
    const restaurantId = RequestContextManager.get().tenantId!;
    const promotion = await db.promotion.create({
      data: {
        ...data,
        restaurantId,
        metadata: data.metadata ? JSON.stringify(data.metadata) : "{}",
      },
    });

    await CacheManager.delete(CacheKeyBuilder.activePromotions(restaurantId));
    
    // Audit Logging
    DomainEventBus.getInstance().publish(
      createDomainEvent(DomainEventType.PROMOTION_CREATED, promotion.id, "Promotion", promotion)
    );

    return promotion;
  }

  static async updatePromotion(promotionId: string, data: any) {
    const restaurantId = RequestContextManager.get().tenantId!;
    const promotion = await db.promotion.findFirst({
      where: { id: promotionId, restaurantId, deletedAt: null },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const updateData = { ...data };
    if (updateData.metadata) {
      updateData.metadata = JSON.stringify(updateData.metadata);
    }

    const updated = await db.promotion.update({
      where: { id: promotionId },
      data: updateData,
    });

    await CacheManager.delete(CacheKeyBuilder.activePromotions(restaurantId));

    // Audit Logging
    DomainEventBus.getInstance().publish(
      createDomainEvent(DomainEventType.PROMOTION_UPDATED, promotion.id, "Promotion", updated)
    );

    return updated;
  }

  static async archivePromotion(promotionId: string) {
    const restaurantId = RequestContextManager.get().tenantId!;
    const promotion = await db.promotion.findFirst({
      where: { id: promotionId, restaurantId, deletedAt: null },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const archived = await db.promotion.update({
      where: { id: promotionId },
      data: {
        deletedAt: new Date(),
        active: false,
      },
    });

    await CacheManager.delete(CacheKeyBuilder.activePromotions(restaurantId));

    // Audit Logging (Archiving is a logical delete/update)
    DomainEventBus.getInstance().publish(
      createDomainEvent(DomainEventType.PROMOTION_ARCHIVED, promotion.id, "Promotion", promotion)
    );

    return archived;
  }

  static async getPromotion(promotionId: string) {
    const restaurantId = RequestContextManager.get().tenantId!;
    const promotion = await db.promotion.findFirst({
      where: { id: promotionId, restaurantId, deletedAt: null },
    });

    if (!promotion) return null;

    return {
      ...promotion,
      metadata: JSON.parse(promotion.metadata),
    };
  }

  static async listPromotions(
    limit: number,
    skip: number,
    filters?: {
      active?: boolean;
      currentlyActive?: boolean;
      promotionType?: string;
      search?: string;
    }
  ) {
    const restaurantId = RequestContextManager.get().tenantId!;
    const where: Prisma.PromotionWhereInput = {
      restaurantId,
      deletedAt: null,
    };

    if (filters?.active !== undefined) {
      where.active = filters.active;
    }

    if (filters?.promotionType) {
      where.promotionType = filters.promotionType;
    }

    if (filters?.search) {
      where.name = {
        contains: filters.search,
      };
    }

    if (filters?.currentlyActive) {
      const now = new Date();
      where.startsAt = { lte: now };
      where.endsAt = { gte: now };
      where.active = true;
    }

    const [promotions, total] = await Promise.all([
      db.promotion.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      db.promotion.count({ where }),
    ]);

    const formattedPromotions = promotions.map(p => ({
      ...p,
      metadata: JSON.parse(p.metadata),
    }));

    return { promotions: formattedPromotions, total };
  }

  static async getActivePromotions() {
    const restaurantId = RequestContextManager.get().tenantId!;
    const cacheKey = CacheKeyBuilder.activePromotions(restaurantId);
    
    return await CacheManager.getOrSet(
      cacheKey,
      async () => {
        const now = new Date();
        const activePromotions = await db.promotion.findMany({
          where: {
            restaurantId,
            deletedAt: null,
            active: true,
            startsAt: { lte: now },
            endsAt: { gte: now },
          },
          orderBy: { priority: "desc" },
        });

        return activePromotions.map((p) => ({
          ...p,
          metadata: JSON.parse(p.metadata),
        }));
      },
      60 * 15 // Cache for 15 minutes
    );
  }
}
