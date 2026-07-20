export interface AuditContext {
  tenantId: string;
  actorId: string;
  correlationId?: string;
  requestId?: string;
}

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "CUSTOM";

export interface AuditRecord {
  entityType: string;
  entityId: string;
  action: AuditAction | string;
  beforeState?: any;
  afterState?: any;
  metadata?: any;
}

export interface AuditProvider {
  /**
   * Persists an immutable audit log record.
   * Providers MUST NEVER update or delete an audit record once written.
   */
  log(context: AuditContext, record: AuditRecord): Promise<void>;
}
