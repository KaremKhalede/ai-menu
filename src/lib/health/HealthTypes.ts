export enum HealthStatus {
  HEALTHY = "HEALTHY",
  DEGRADED = "DEGRADED",
  UNHEALTHY = "UNHEALTHY",
}

export interface HealthComponentReport {
  componentName: string;
  status: HealthStatus;
  latencyMs: number;
  timestamp: string;
  details?: Record<string, any>;
  isCritical: boolean; // Determines if failure cascades to UNHEALTHY or just DEGRADED
}

export interface HealthReport {
  status: HealthStatus;
  totalLatencyMs: number;
  timestamp: string;
  components: HealthComponentReport[];
}

export interface HealthIndicator {
  /**
   * Identifies the component (e.g., 'Database', 'Cache').
   */
  readonly name: string;
  
  /**
   * Whether the application can function without this component.
   */
  readonly isCritical: boolean;

  /**
   * The maximum time (in milliseconds) the check is allowed to run before timing out.
   */
  readonly timeoutMs: number;

  /**
   * Executes the health check and returns component-specific details.
   */
  check(): Promise<Record<string, any>>;
}
