export class FeatureContext {
  public readonly tenantId?: string;
  public readonly userId?: string;
  public readonly environment: string;
  public readonly metadata: Record<string, any>;

  // Request-level consistency cache
  private evaluationCache = new Map<string, boolean>();

  constructor(params: {
    tenantId?: string;
    userId?: string;
    environment?: string;
    metadata?: Record<string, any>;
  }) {
    this.tenantId = params.tenantId;
    this.userId = params.userId;
    this.environment = params.environment || process.env.NODE_ENV || "production";
    this.metadata = params.metadata || {};
  }

  getCachedEvaluation(flagKey: string): boolean | undefined {
    return this.evaluationCache.get(flagKey);
  }

  setCachedEvaluation(flagKey: string, result: boolean): void {
    this.evaluationCache.set(flagKey, result);
  }
}
