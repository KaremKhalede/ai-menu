import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class CustomerTimelineService {
  /**
   * Translates an event into localized title and description.
   */
  static getLocalizedEventDetails(eventType: string, metadataRaw: string) {
    let metadata: any = {};
    try {
      metadata = JSON.parse(metadataRaw);
    } catch {
      // Ignore
    }

    let title = eventType;
    let description = "";

    switch (eventType) {
      case "CUSTOMER_CREATED":
        title = "إنشاء ملف العميل";
        description = `تم تسجيل العميل ${metadata.fullName || ""} برقم الجوال ${metadata.phone || ""}`;
        break;
      case "ORDER_CREATED":
        title = "طلب جديد";
        description = `تم إنشاء طلب جديد بقيمة ${metadata.orderTotal || 0} ر.س`;
        break;
      case "ORDER_COMPLETED":
        title = "إكمال الطلب";
        description = `تم إكمال الطلب بقيمة ${metadata.orderTotal || 0} ر.س بنجاح`;
        break;
      case "ORDER_CANCELLED":
        title = "إلغاء الطلب";
        description = `تم إلغاء الطلب. السبب: ${metadata.reason || "غير محدد"}`;
        break;
      case "FIRST_ORDER":
        title = "أول طلب";
        description = `أتم العميل أول طلب له بقيمة ${metadata.orderTotal || 0} ر.س`;
        break;
      case "AI_SUGGESTION_ACCEPTED":
        title = "قبول اقتراح الذكاء الاصطناعي";
        description = `تم قبول اقتراح الطبق: ${metadata.dishName || ""}`;
        break;
      default:
        title = `حدث غير معروف: ${eventType}`;
        break;
    }

    return { title, description };
  }

  /**
   * Fetches the customer timeline using cursor pagination.
   */
  static async getTimeline(
    restaurantId: string,
    customerId: string,
    limit: number,
    cursor?: string,
    eventType?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    // Verify customer belongs to tenant
    const customer = await db.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer || customer.restaurantId !== restaurantId) {
      throw new Error("Customer not found or unauthorized");
    }

    const where: Prisma.CustomerEventWhereInput = {
      customerId,
      restaurantId,
    };

    if (eventType) {
      where.eventType = eventType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const events = await db.customerEvent.findMany({
      where,
      take: limit + 1, // Fetch one extra to determine if there's a next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
    });

    let nextCursor: string | undefined = undefined;
    if (events.length > limit) {
      const nextItem = events.pop(); // Remove the extra item
      nextCursor = nextItem!.id;
    }

    const formattedEvents = events.map((ev) => {
      const { title, description } = this.getLocalizedEventDetails(ev.eventType, ev.metadata);
      let parsedMetadata = {};
      try {
        parsedMetadata = JSON.parse(ev.metadata);
      } catch {}

      return {
        eventId: ev.id,
        eventType: ev.eventType,
        timestamp: ev.createdAt.toISOString(),
        title,
        description,
        metadata: parsedMetadata,
      };
    });

    return {
      events: formattedEvents,
      nextCursor,
    };
  }
}
