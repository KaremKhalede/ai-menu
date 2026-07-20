import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConversationEngine } from './ConversationEngine';
import { VoiceProviderAdapter } from '../types';

describe('ConversationEngine', () => {
  let engine: ConversationEngine;
  let mockAdapter: VoiceProviderAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAdapter = {
      generateEphemeralToken: vi.fn().mockResolvedValue({ token: 'test-token', expiresAt: new Date() })
    };
    engine = new ConversationEngine(mockAdapter);
  });

  it('handles successful context assembly', async () => {
    const { session, token } = await engine.initializeVoiceSession('tenant1', 'cust1');
    expect(session.id).toBeDefined();
    expect(token).toBeDefined();
    expect(mockAdapter.generateEphemeralToken).toHaveBeenCalled();
  });

  it('gracefully handles memory failure', async () => {
    // Force a failure in memory engine
    vi.spyOn((engine as any).memoryEngine, 'getCustomerMemory').mockRejectedValue(new Error('Redis Timeout'));
    
    const { token } = await engine.initializeVoiceSession('tenant1', 'cust1');
    
    const generatedInstruction = vi.mocked(mockAdapter.generateEphemeralToken).mock.calls[0][1] as any;
    expect(generatedInstruction.content).toContain('No prior customer memory available.');
  });

  it('gracefully handles knowledge failure', async () => {
    vi.spyOn((engine as any).knowledgeEngine, 'getMenuKnowledge').mockRejectedValue(new Error('DB Timeout'));
    
    await engine.initializeVoiceSession('tenant1', 'cust1');
    
    const generatedInstruction = vi.mocked(mockAdapter.generateEphemeralToken).mock.calls[0][1] as any;
    expect(generatedInstruction.content).toContain('System menu knowledge is currently unavailable.');
  });

  it('handles empty context (all fail)', async () => {
    vi.spyOn((engine as any).knowledgeEngine, 'getMenuKnowledge').mockRejectedValue(new Error('DB Timeout'));
    vi.spyOn((engine as any).knowledgeEngine, 'getPromotionsKnowledge').mockRejectedValue(new Error('DB Timeout'));
    vi.spyOn((engine as any).memoryEngine, 'getCustomerMemory').mockRejectedValue(new Error('Redis Timeout'));
    
    await engine.initializeVoiceSession('tenant1', 'cust1');
    
    const generatedInstruction = vi.mocked(mockAdapter.generateEphemeralToken).mock.calls[0][1] as any;
    expect(generatedInstruction.content).toContain('System menu knowledge is currently unavailable.');
    expect(generatedInstruction.content).toContain('No active promotions available.');
    expect(generatedInstruction.content).toContain('No prior customer memory available.');
  });
});
