import { Scenario } from "./DeterministicEvaluator";

export interface LlmEvaluationResult {
  personaConsistency: boolean;
  helpfulness: boolean;
  score: number; // 0 to 100
  reasoning: string;
}

export class LlmEvaluator {
  public async evaluate(
    scenario: Scenario,
    aiResponse: { text: string; toolCalls: any[] }
  ): Promise<LlmEvaluationResult> {
    
    // In a real environment, this calls gpt-4o-mini with a prompt like:
    // "You are an expert AI evaluator. Assess the following response for Persona Consistency..."
    // Since this is a test framework, we'll implement a mock evaluator if an API key isn't present
    // or call fetch to OpenAI directly.
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'mock') {
      // Mock for fast CI without LLM overhead (or if Layer 2 is skipped)
      return {
        personaConsistency: true,
        helpfulness: true,
        score: 100,
        reasoning: "Mock evaluation passed."
      };
    }

    try {
      const prompt = `
        Evaluate the following AI Waiter response:
        Scenario Category: ${scenario.category}
        AI Response: "${aiResponse.text}"
        Did the AI maintain a professional, helpful persona? Reply in JSON format: { "personaConsistency": boolean, "helpfulness": boolean, "score": number, "reasoning": "string" }
      `;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await res.json();
      if (data.choices && data.choices[0]) {
        const result = JSON.parse(data.choices[0].message.content);
        return {
          personaConsistency: !!result.personaConsistency,
          helpfulness: !!result.helpfulness,
          score: result.score || 0,
          reasoning: result.reasoning || ""
        };
      }
    } catch (e: any) {
      console.warn("LLM Evaluation failed, falling back to false.", e.message);
    }

    return {
      personaConsistency: false,
      helpfulness: false,
      score: 0,
      reasoning: "Failed to parse LLM evaluation."
    };
  }
}
