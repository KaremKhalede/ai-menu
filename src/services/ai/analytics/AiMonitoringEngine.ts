import { DomainEventBus, DomainEventType, createDomainEvent } from "@/lib/events/DomainEvent";

export interface AiAnalyticsPayload {
  eventType: string;
  timestamp: string;
  tenantId: string;
  sessionId: string;
  channel: string;
  payload: Record<string, any>;
}

export class AiMonitoringEngine {
  private eventBus: DomainEventBus;

  constructor() {
    this.eventBus = DomainEventBus.getInstance();
  }

  /**
   * Publishes a standardized AI observability event without blocking execution.
   */
  private publish(eventType: DomainEventType, tenantId: string, sessionId: string, channel: string, payload: Record<string, any>) {
    const standardizedSchema: AiAnalyticsPayload = {
      eventType,
      timestamp: new Date().toISOString(),
      tenantId,
      sessionId,
      channel,
      payload
    };

    const event = createDomainEvent(
      eventType,
      sessionId,
      "AiSession",
      standardizedSchema
    );

    try {
      // Fire and forget via the Event Bus
      this.eventBus.publish(event);
    } catch (e) {
      console.error("[AiMonitoringEngine] Failed to dispatch event synchronously.", e);
    }
  }

  public logContextAssembled(
    tenantId: string, 
    sessionId: string, 
    channel: string, 
    metrics: {
      generationTimeMs: number;
      charCount: number;
      estimatedTokens: number;
      totalPipelineTimeMs: number;
      cacheHitRatio?: number;
      cacheMissRatio?: number;
      sessionInitializationTimeMs?: number;
    }
  ) {
    this.publish(DomainEventType.AI_CONTEXT_ASSEMBLED, tenantId, sessionId, channel, metrics);
  }

  public logToolExecuted(
    tenantId: string,
    sessionId: string,
    channel: string,
    actionName: string,
    success: boolean,
    metrics: {
      latencyMs: number;
      errorReason?: string;
      conversionType?: 'ADD_TO_CART' | 'CHECKOUT' | 'INFO';
    }
  ) {
    this.publish(DomainEventType.AI_TOOL_EXECUTED, tenantId, sessionId, channel, { actionName, success, ...metrics });
  }

  public logSessionEnded(
    tenantId: string,
    sessionId: string,
    channel: string,
    data: {
      transcriptLength: number;
      hasTranscript: boolean;
      finalIntent?: string;
      conversationOutcome?: string;
      language?: string;
      escalatedToHuman?: boolean;
    }
  ) {
    this.publish(DomainEventType.AI_SESSION_ENDED, tenantId, sessionId, channel, data);
  }
}
