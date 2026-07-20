export interface RequestContextOptions {
  requestId: string;
  userId?: string;
  tenantId?: string;
  correlationId?: string;
  apiVersion?: string;
  featureFlagsSnapshot?: Record<string, boolean>;
}

export class RequestContext {
  public readonly requestId: string;
  public readonly userId?: string;
  public readonly tenantId?: string;
  public readonly correlationId?: string;
  public readonly apiVersion?: string;
  public readonly featureFlagsSnapshot?: Record<string, boolean>;
  public readonly startTime: number;

  // Controlled, isolated metadata extension
  private readonly internalMetadata = new Map<string, any>();

  constructor(options: RequestContextOptions) {
    this.requestId = options.requestId;
    this.userId = options.userId;
    this.tenantId = options.tenantId;
    this.correlationId = options.correlationId;
    this.apiVersion = options.apiVersion;
    this.featureFlagsSnapshot = options.featureFlagsSnapshot ? { ...options.featureFlagsSnapshot } : undefined;
    this.startTime = Date.now();

    // Deep freeze the core object properties to guarantee immutability across the request lifecycle
    Object.freeze(this);
  }

  /**
   * Attaches internal metadata (e.g. distributed tracing spans) without mutating the core context properties.
   */
  public setMetadata(key: string, value: any): void {
    this.internalMetadata.set(key, value);
  }

  /**
   * Retrieves attached internal metadata.
   */
  public getMetadata<T = any>(key: string): T | undefined {
    return this.internalMetadata.get(key) as T | undefined;
  }
}
