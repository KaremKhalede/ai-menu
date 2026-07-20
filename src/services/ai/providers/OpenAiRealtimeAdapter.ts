import { AiSession, SystemInstruction, VoiceProviderAdapter, VoiceProviderSessionToken } from '../types';

export class OpenAiRealtimeAdapter implements VoiceProviderAdapter {
  public readonly providerName = 'openai_realtime';

  public async generateEphemeralToken(session: AiSession, systemInstruction: SystemInstruction): Promise<VoiceProviderSessionToken> {
    if (process.env.PLAYWRIGHT_TEST === '1' || process.env.NODE_ENV === 'test') {
      return {
        token: 'mock-ephemeral-token',
        expiresAt: new Date(Date.now() + 3600 * 1000),
        providerUrl: 'wss://api.openai.com/v1/realtime',
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing from environment variables.");
    }

    // According to OpenAI Realtime API documentation, we can generate an ephemeral token
    // by making a POST request to /v1/realtime/sessions
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "ash", // Ash is a good warm voice
        instructions: systemInstruction.content,
        // In Sprint 8, we won't define tools yet. We will add them in Sprint 11.
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate OpenAI ephemeral token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // The client uses the ephemeral token to connect to wss://api.openai.com/v1/realtime
    return {
      token: data.client_secret.value, // OpenAI's ephemeral token format
      expiresAt: new Date(Date.now() + data.client_secret.expires_at * 1000), // Expires in seconds from now? OpenAI provides explicit expires_at
      providerUrl: "wss://api.openai.com/v1/realtime",
    };
  }
}
