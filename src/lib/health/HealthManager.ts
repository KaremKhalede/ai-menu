import { HealthStatus, HealthComponentReport, HealthReport, HealthIndicator } from "./HealthTypes";

export class HealthManager {
  private static indicators: HealthIndicator[] = [];

  /**
   * Registers a new health indicator to be evaluated during readiness checks.
   */
  public static register(indicator: HealthIndicator) {
    this.indicators.push(indicator);
  }

  /**
   * Executes a single indicator with a strict timeout.
   */
  private static async executeIndicator(indicator: HealthIndicator): Promise<HealthComponentReport> {
    const startTime = Date.now();
    
    // Timeout Promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout exceeded (${indicator.timeoutMs}ms)`)), indicator.timeoutMs);
    });

    try {
      // Race the actual check against the timeout
      const details = await Promise.race([
        indicator.check(),
        timeoutPromise
      ]);

      const latencyMs = Date.now() - startTime;
      return {
        componentName: indicator.name,
        status: HealthStatus.HEALTHY,
        latencyMs,
        timestamp: new Date().toISOString(),
        details,
        isCritical: indicator.isCritical,
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      return {
        componentName: indicator.name,
        status: indicator.isCritical ? HealthStatus.UNHEALTHY : HealthStatus.DEGRADED,
        latencyMs,
        timestamp: new Date().toISOString(),
        details: { error: error.message || "Unknown error" },
        isCritical: indicator.isCritical,
      };
    }
  }

  /**
   * Liveness Check: Bypasses all infrastructure and indicators.
   * Proves strictly that the Node.js process is alive and responding to HTTP requests.
   */
  public static liveness(): HealthReport {
    return {
      status: HealthStatus.HEALTHY,
      totalLatencyMs: 0,
      timestamp: new Date().toISOString(),
      components: [],
    };
  }

  /**
   * Readiness Check: Evaluates all registered indicators concurrently.
   * Isolates failures and computes aggregate status.
   */
  public static async readiness(): Promise<HealthReport> {
    const startTime = Date.now();
    
    // Run all indicators concurrently. Promise.all is safe here because we catch all errors inside executeIndicator.
    const componentReports = await Promise.all(
      this.indicators.map(indicator => this.executeIndicator(indicator))
    );

    let overallStatus = HealthStatus.HEALTHY;
    
    for (const report of componentReports) {
      if (report.status === HealthStatus.UNHEALTHY) {
        overallStatus = HealthStatus.UNHEALTHY;
        break; // A single critical failure makes the whole system UNHEALTHY
      }
      if (report.status === HealthStatus.DEGRADED) {
        overallStatus = HealthStatus.DEGRADED;
      }
    }

    return {
      status: overallStatus,
      totalLatencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      components: componentReports,
    };
  }
}
