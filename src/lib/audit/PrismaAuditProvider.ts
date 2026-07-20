import { db } from "@/lib/db";
import { AuditProvider, AuditContext, AuditRecord } from "./AuditProvider";

export class PrismaAuditProvider implements AuditProvider {
  async log(context: AuditContext, record: AuditRecord): Promise<void> {
    // Audit records are intentionally immutable by design.
    // There are explicitly no update() or delete() methods provided here or in the Prisma model schema.
    await db.auditLog.create({
      data: {
        tenantId: context.tenantId,
        actorId: context.actorId,
        correlationId: context.correlationId,
        
        action: record.action,
        entityType: record.entityType,
        entityId: record.entityId,
        
        beforeState: record.beforeState ? JSON.stringify(record.beforeState) : null,
        afterState: record.afterState ? JSON.stringify(record.afterState) : null,
        metadata: JSON.stringify({
          ...(record.metadata || {}),
          ...(context.requestId ? { requestId: context.requestId } : {})
        }),
      },
    });
  }
}
