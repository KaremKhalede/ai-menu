import { db } from "@/lib/db";
import { IdempotencyProvider } from "./IdempotencyProvider";
import { IdempotencyRecordModel, IdempotencyStatus } from "./IdempotencyTypes";

export class PrismaIdempotencyProvider implements IdempotencyProvider {
  async insertIfNotExists(record: IdempotencyRecordModel): Promise<{ record: IdempotencyRecordModel, isNew: boolean }> {
    try {
      const created = await db.idempotencyRecord.create({
        data: {
          idempotencyKey: record.idempotencyKey,
          requestHash: record.requestHash,
          status: record.status,
          responseSnapshot: record.responseSnapshot ? JSON.stringify(record.responseSnapshot) : null,
          createdAt: record.createdAt,
          expiresAt: record.expiresAt,
        },
      });

      return { record: this.mapToModel(created), isNew: true };
    } catch (error: any) {
      // Prisma P2002 is Unique constraint failed
      if (error.code === "P2002") {
        const existing = await db.idempotencyRecord.findUnique({
          where: { idempotencyKey: record.idempotencyKey },
        });

        if (!existing) {
          throw new Error("Concurrency edge case: Record existed but could not be fetched.");
        }

        return { record: this.mapToModel(existing), isNew: false };
      }
      throw error;
    }
  }

  async update(idempotencyKey: string, status: IdempotencyStatus, responseSnapshot?: any): Promise<void> {
    await db.idempotencyRecord.update({
      where: { idempotencyKey },
      data: {
        status,
        // Only update responseSnapshot if one is provided
        ...(responseSnapshot !== undefined && { responseSnapshot: JSON.stringify(responseSnapshot) }),
      },
    });
  }

  async delete(idempotencyKey: string): Promise<void> {
    await db.idempotencyRecord.delete({
      where: { idempotencyKey },
    }).catch(() => {
      // Ignore if it doesn't exist
    });
  }

  private mapToModel(prismaRecord: any): IdempotencyRecordModel {
    return {
      idempotencyKey: prismaRecord.idempotencyKey,
      requestHash: prismaRecord.requestHash,
      status: prismaRecord.status as IdempotencyStatus,
      responseSnapshot: prismaRecord.responseSnapshot ? JSON.parse(prismaRecord.responseSnapshot) : null,
      createdAt: prismaRecord.createdAt,
      expiresAt: prismaRecord.expiresAt,
    };
  }
}
