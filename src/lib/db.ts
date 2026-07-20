import { PrismaClient } from '@prisma/client'
import { AuditLogger } from './audit/AuditLogger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query', 'warn', 'error'],
});

export const db = (globalForPrisma.prisma ?? prismaClient).$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const stateChangingOps = ['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'];
        if (!stateChangingOps.includes(operation)) {
          return query(args);
        }

        // Skip infrastructure models
        if (
          !model ||
          model === 'AuditLog' || 
          model === 'CustomerEvent' || 
          model === 'AnalyticsEvent' || 
          model === 'BackgroundJob' ||
          model === 'DistributedLock' ||
          model === 'IdempotencyRecord' ||
          model === 'Session'
        ) {
          return query(args);
        }

        let beforeState: any = null;
        // Capture beforeState for update/delete
        if (['update', 'delete', 'upsert'].includes(operation) && (args as any).where) {
          try {
            // @ts-ignore
            beforeState = await prismaClient[model.charAt(0).toLowerCase() + model.slice(1)].findFirst({ where: (args as any).where });
          } catch (e) {
            // Best effort capture
          }
        }

        const result = await query(args);
        const afterState = ['delete', 'deleteMany'].includes(operation) ? null : result;
        
        // ID inference
        const entityId = (result as any)?.id || (args as any).where?.id || "BULK_OPERATION";

        // Asynchronously log the physical CRUD event as a fallback
        setImmediate(() => {
          if (operation === 'create' || operation === 'createMany') {
            AuditLogger.logCreate(model, entityId, afterState).catch(() => {});
          } else if (operation === 'update' || operation === 'updateMany' || operation === 'upsert') {
            AuditLogger.logUpdate(model, entityId, beforeState, afterState).catch(() => {});
          } else if (operation === 'delete' || operation === 'deleteMany') {
            AuditLogger.logDelete(model, entityId, beforeState).catch(() => {});
          }
        });

        return result;
      }
    }
  }
}) as unknown as PrismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;