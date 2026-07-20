import { AuditProvider, AuditContext, AuditRecord } from "./AuditProvider";
export type { AuditContext };
import { PrismaAuditProvider } from "./PrismaAuditProvider";
import { RequestContextManager } from "../request-context/RequestContextManager";
import "./AuditSubscriber";

export class AuditLogger {
  private static provider: AuditProvider = new PrismaAuditProvider();

  // Keys to auto-sanitize
  private static SENSITIVE_KEYS = new Set([
    "password", "token", "apikey", "api_key", "secret", "cvv", "creditcard", "payment_token"
  ]);

  /**
   * Inject a different provider (e.g., ElasticsearchAuditProvider)
   */
  public static setProvider(provider: AuditProvider) {
    this.provider = provider;
  }

  /**
   * Deeply sanitizes an object before it is passed to the provider.
   */
  private static sanitize(data: any): any {
    if (data === null || data === undefined) return data;
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }
    
    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.SENSITIVE_KEYS.has(key.toLowerCase())) {
          sanitized[key] = "[REDACTED]";
        } else {
          sanitized[key] = this.sanitize(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private static resolveContext(explicitContext?: AuditContext): AuditContext {
    if (explicitContext) return explicitContext;
    if (RequestContextManager.has()) {
      const reqCtx = RequestContextManager.get();
      return {
        tenantId: reqCtx.tenantId || "SYSTEM",
        actorId: reqCtx.userId || "SYSTEM",
        correlationId: reqCtx.correlationId,
        requestId: reqCtx.requestId,
      };
    }
    return { tenantId: "SYSTEM", actorId: "SYSTEM" };
  }

  private static async executeLog(explicitContext: AuditContext | undefined, record: AuditRecord): Promise<void> {
    try {
      const context = this.resolveContext(explicitContext);
      const sanitizedRecord: AuditRecord = {
        ...record,
        beforeState: this.sanitize(record.beforeState),
        afterState: this.sanitize(record.afterState),
        metadata: this.sanitize(record.metadata),
      };

      await this.provider.log(context, sanitizedRecord);
    } catch (e) {
      // Fire-and-forget: Swallow errors so we never fail the main business transaction.
      console.error("[AuditLogger] Failed to write audit log:", e);
    }
  }

  public static async logCreate(entityType: string, entityId: string, afterState: any, metadata?: any, explicitContext?: AuditContext): Promise<void> {
    await this.executeLog(explicitContext, {
      entityType,
      entityId,
      action: "CREATE",
      afterState,
      metadata,
    });
  }

  public static async logUpdate(entityType: string, entityId: string, beforeState: any, afterState: any, metadata?: any, explicitContext?: AuditContext): Promise<void> {
    await this.executeLog(explicitContext, {
      entityType,
      entityId,
      action: "UPDATE",
      beforeState,
      afterState,
      metadata,
    });
  }

  public static async logDelete(entityType: string, entityId: string, beforeState: any, metadata?: any, explicitContext?: AuditContext): Promise<void> {
    await this.executeLog(explicitContext, {
      entityType,
      entityId,
      action: "DELETE",
      beforeState,
      metadata,
    });
  }

  public static async logCustom(action: string, entityType: string, entityId: string, metadata?: any, explicitContext?: AuditContext): Promise<void> {
    await this.executeLog(explicitContext, {
      entityType,
      entityId,
      action,
      metadata,
    });
  }
}
