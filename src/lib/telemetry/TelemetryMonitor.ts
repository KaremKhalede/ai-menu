import { monitorEventLoopDelay } from 'perf_hooks';
import * as os from 'os';
import { DomainEventBus } from '../events/DomainEvent';

export interface TelemetryMetrics {
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  eventLoop: {
    delayP50: number;
    delayP99: number;
    delayMax: number;
  };
  cpu: {
    utilizationPercent: number;
  };
  eventBus: {
    published: number;
    processed: number;
    failed: number;
    queueDepth: number;
    activeHandlers: number;
  };
  timestamp: string;
}

export class TelemetryMonitor {
  private static instance: TelemetryMonitor;
  private eventLoopMonitor: ReturnType<typeof monitorEventLoopDelay>;
  private lastCpuUsage: NodeJS.CpuUsage;
  private lastCpuTime: number;

  private constructor() {
    this.eventLoopMonitor = monitorEventLoopDelay({ resolution: 10 });
    this.eventLoopMonitor.enable();
    
    this.lastCpuUsage = process.cpuUsage();
    this.lastCpuTime = Date.now();
  }

  public static getInstance(): TelemetryMonitor {
    if (!TelemetryMonitor.instance) {
      TelemetryMonitor.instance = new TelemetryMonitor();
    }
    return TelemetryMonitor.instance;
  }

  public getMetrics(): TelemetryMetrics {
    const memory = process.memoryUsage();
    const eventBusMetrics = DomainEventBus.getInstance().getMetrics();
    
    // CPU Utilization calculation
    const currentCpuUsage = process.cpuUsage(this.lastCpuUsage);
    const currentTime = Date.now();
    const timeDelta = currentTime - this.lastCpuTime;
    
    // Convert microseconds to milliseconds
    const totalCpuTimeMs = (currentCpuUsage.user + currentCpuUsage.system) / 1000;
    
    // Divide by wall clock time and number of CPUs to get a percentage
    // (Note: Node is primarily single threaded, so we measure relative to 1 core, capped at 100% * CPUs)
    const utilizationPercent = (totalCpuTimeMs / timeDelta) * 100;
    
    this.lastCpuUsage = process.cpuUsage();
    this.lastCpuTime = currentTime;

    // We must ensure the resolution captures nanoseconds to milliseconds properly
    // The histogram values are in nanoseconds. We convert to milliseconds.
    const nanosecondsToMs = (ns: number) => ns / 1_000_000;

    return {
      timestamp: new Date().toISOString(),
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
      },
      eventLoop: {
        delayP50: nanosecondsToMs(this.eventLoopMonitor.percentile(50)),
        delayP99: nanosecondsToMs(this.eventLoopMonitor.percentile(99)),
        delayMax: nanosecondsToMs(this.eventLoopMonitor.max),
      },
      cpu: {
        utilizationPercent: Math.min(100, Math.max(0, utilizationPercent)), // Approximate per-core util
      },
      eventBus: eventBusMetrics,
    };
  }
}
