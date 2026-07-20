import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Architecture Compliance Tests
 * Prevents accidental dependency erosion across boundaries.
 */
describe('Architectural Compliance', () => {

  const getFileContent = (relativePath: string) => {
    const fullPath = path.join(__dirname, relativePath);
    return fs.readFileSync(fullPath, 'utf8');
  };

  it('Core modules must not import specific provider implementations', () => {
    const conversationEngineCode = getFileContent('core/ConversationEngine.ts');
    const reasoningEngineCode = getFileContent('core/AiReasoningEngine.ts');

    // Should rely entirely on VoiceProviderAdapter interface
    expect(conversationEngineCode).not.toContain('OpenAiRealtimeAdapter');
    expect(reasoningEngineCode).not.toContain('OpenAiRealtimeAdapter');
  });

  it('Business Rules must not depend on Conversation Engine or Cognitive layers', () => {
    const businessRulesCode = getFileContent('tools/BusinessRulesEngine.ts');

    expect(businessRulesCode).not.toContain('ConversationEngine');
    expect(businessRulesCode).not.toContain('DecisionEngine');
    expect(businessRulesCode).not.toContain('IntentEngine');
  });

  it('Knowledge Engine must not depend on AI providers or conversation logic', () => {
    const knowledgeEngineCode = getFileContent('knowledge/KnowledgeEngine.ts');

    expect(knowledgeEngineCode).not.toContain('OpenAi');
    expect(knowledgeEngineCode).not.toContain('ConversationEngine');
  });

  it('Tool Calling Engine must always pass through Safety & Policy Engine', () => {
    const toolCallingCode = getFileContent('tools/ToolCallingEngine.ts');

    // Make sure SafetyPolicyEngine is imported and invoked
    expect(toolCallingCode).toContain('SafetyPolicyEngine');
    expect(toolCallingCode).toContain('this.safetyEngine.validateAction(');
  });
});
