import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AiMonitoringEngine } from './AiMonitoringEngine';
import { DomainEventBus } from '@/lib/events/DomainEvent';

describe('AiMonitoringEngine', () => {
  let engine: AiMonitoringEngine;
  let publishSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    publishSpy = vi.spyOn(DomainEventBus.getInstance(), 'publish');
    engine = new AiMonitoringEngine();
  });

  it('successfully dispatches session ended events matching schema', () => {
    engine.logSessionEnded('tenant1', 'session1', 'voice', {
      transcriptLength: 100,
      hasTranscript: true,
      finalIntent: 'EXPLORING',
    });

    expect(publishSpy).toHaveBeenCalledTimes(1);
    const event = publishSpy.mock.calls[0][0];
    
    expect(event.eventType).toBe('AI_SESSION_ENDED');
    expect(event.payload.tenantId).toBe('tenant1');
    expect(event.payload.sessionId).toBe('session1');
    expect(event.payload.payload.finalIntent).toBe('EXPLORING');
    expect(event.payload.timestamp).toBeDefined();
  });

  it('safely tolerates event bus failures without throwing back to caller', () => {
    publishSpy.mockImplementation(() => {
      throw new Error('Bus crashed');
    });

    // The engine itself shouldn't crash if publish fails synchronously (though our publish has try/catch)
    // Actually our publish method in AiMonitoringEngine just calls bus.publish, which might throw if it's not wrapped in try/catch in AiMonitoringEngine.
    // Wait, bus.publish uses setImmediate inside, so it doesn't throw synchronously anyway.
    
    expect(() => {
      engine.logToolExecuted('t1', 's1', 'voice', 'add_to_cart', true, { latencyMs: 50 });
    }).not.toThrowError(); 
  });
});
