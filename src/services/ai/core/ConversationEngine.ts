import { SessionManager } from './SessionManager';
import { AiReasoningEngine } from './AiReasoningEngine';
import { KnowledgeEngine } from '../knowledge/KnowledgeEngine';
import { MemoryEngine } from '../knowledge/MemoryEngine';
import { RecommendationEngine } from '../cognitive/RecommendationEngine';
import { DecisionEngine } from '../cognitive/DecisionEngine';
import { ResponseValidationEngine } from '../cognitive/ResponseValidationEngine';
import { VoiceProviderAdapter, VoiceProviderSessionToken, AiSession } from '../types';

export class ConversationEngine {
  private sessionManager: SessionManager;
  private reasoningEngine: AiReasoningEngine;
  private knowledgeEngine: KnowledgeEngine;
  private memoryEngine: MemoryEngine;
  
  // Cognitive Engines
  private recommendationEngine: RecommendationEngine;
  private decisionEngine: DecisionEngine;
  private validationEngine: ResponseValidationEngine;

  private voiceAdapter: VoiceProviderAdapter;

  constructor(voiceAdapter: VoiceProviderAdapter) {
    this.sessionManager = new SessionManager();
    this.reasoningEngine = new AiReasoningEngine();
    this.knowledgeEngine = new KnowledgeEngine();
    this.memoryEngine = new MemoryEngine();
    
    this.recommendationEngine = new RecommendationEngine();
    this.decisionEngine = new DecisionEngine();
    this.validationEngine = new ResponseValidationEngine();
    
    this.voiceAdapter = voiceAdapter;
  }

  /**
   * Initializes a new AI conversation session and returns the ephemeral token
   * required for the client to connect directly to the Voice Provider.
   */
  public async initializeVoiceSession(tenantId: string, customerId?: string): Promise<{ session: AiSession; token: VoiceProviderSessionToken; metrics: any }> {
    const totalStart = performance.now();

    // 1. Initialize the session state
    const session = this.sessionManager.createSession(tenantId, customerId, 'voice');

    // 2. Concurrently fetch all context blocks (Knowledge + Memory)
    // Wrap in try-catch to ensure graceful degradation if Redis/DB is down
    const safeFetch = async (fetchPromise: Promise<string>, fallback: string) => {
      try {
        return await fetchPromise;
      } catch (error) {
        console.error("[ConversationEngine] Context fetch failed. Using fallback.", error);
        return fallback;
      }
    };

    const [menuKnowledge, promotionsKnowledge, customerMemory] = await Promise.all([
      safeFetch(this.knowledgeEngine.getMenuKnowledge(tenantId), "System menu knowledge is currently unavailable."),
      safeFetch(this.knowledgeEngine.getPromotionsKnowledge(tenantId), "No active promotions available."),
      safeFetch(this.memoryEngine.getCustomerMemory(tenantId, customerId), "No prior customer memory available.")
    ]);

    // 3. Run Cognitive Pipeline (Synchronously on top of cached knowledge)
    const candidates = this.recommendationEngine.generateCandidates(menuKnowledge, customerMemory);
    const decisionModel = this.decisionEngine.computeDecisionModel(candidates);
    const validationRules = this.validationEngine.generateValidationRules();

    // 4. Deterministically assemble the system instructions (The AI Waiter Brain logic)
    const { instruction: systemInstruction, metrics: reasoningMetrics } = this.reasoningEngine.synthesizeSystemInstruction(
      tenantId,
      menuKnowledge,
      promotionsKnowledge,
      customerMemory,
      decisionModel,
      validationRules
    );

    // 5. Request a secure ephemeral token from the Voice Provider using the synthesized prompt
    const token = await this.voiceAdapter.generateEphemeralToken(session, systemInstruction);

    const totalEnd = performance.now();
    const finalMetrics = {
      ...reasoningMetrics,
      totalPipelineTimeMs: totalEnd - totalStart,
    };

    // Log generation metrics as requested
    console.log(`[ConversationEngine] Session Initialized for Tenant ${tenantId}`);
    console.log(`[ConversationEngine] Metrics:`, finalMetrics);

    return {
      session,
      token,
      metrics: finalMetrics
    };
  }
}
