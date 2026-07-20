import { describe, it, expect } from 'vitest';
import { 
  AiSession, 
  VoiceProviderSessionToken, 
  VoiceProviderAdapter 
} from '../types';
import { AiAnalyticsPayload } from '../analytics/AiMonitoringEngine';
import { DecisionModel } from '../cognitive/DecisionEngine';
import { RecommendationCandidate } from '../cognitive/RecommendationEngine';

/**
 * Contract Tests
 * These tests ensure that the shared interfaces across the architectural boundaries
 * do not change unexpectedly. If a type changes, this file will fail to compile,
 * breaking the build and alerting the developer to an architectural contract violation.
 */
describe('Architectural Contracts', () => {

  it('validates AiSession contract', () => {
    const session: AiSession = {
      id: '123',
      tenantId: 'tenant1',
      customerId: 'cust1',
      channel: 'voice',
      startedAt: new Date(),
    };
    expect(session.channel).toBe('voice');
  });

  it('validates VoiceProviderSessionToken contract', () => {
    const token: VoiceProviderSessionToken = {
      token: 'secure-string',
      expiresAt: new Date()
    };
    expect(token.token).toBe('secure-string');
  });

  it('validates VoiceProviderAdapter contract', async () => {
    const adapter: VoiceProviderAdapter = {
      generateEphemeralToken: async (session: AiSession, systemInstruction: string) => {
        return { token: 't', expiresAt: new Date() };
      }
    };
    expect(adapter).toBeDefined();
  });

  it('validates AiAnalyticsPayload contract', () => {
    const payload: AiAnalyticsPayload = {
      eventType: 'AI_SESSION_ENDED',
      timestamp: new Date().toISOString(),
      tenantId: 't1',
      sessionId: 's1',
      channel: 'voice',
      payload: { anything: true }
    };
    expect(payload.eventType).toBe('AI_SESSION_ENDED');
  });

  it('validates DecisionModel contract', () => {
    const decision: DecisionModel = {
      primaryObjective: 'Assist customer',
      allowedIntents: ['EXPLORING'],
      recommendationConstraints: {
        maxItemsToRecommend: 2,
        candidates: []
      },
      escalationCriteria: ['Angry customer']
    };
    expect(decision.primaryObjective).toBeDefined();
  });

  it('validates RecommendationCandidate contract', () => {
    const candidate: RecommendationCandidate = {
      recommendation: 'Burger',
      reason: 'Best seller',
      source: 'Best Seller',
      confidence: 0.9
    };
    expect(candidate.confidence).toBe(0.9);
  });
});
