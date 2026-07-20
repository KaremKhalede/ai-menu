export interface AiSession {
  id: string;
  tenantId: string;
  customerId?: string;
  channel: 'voice' | 'chat';
  startedAt: Date;
}

export interface VoiceProviderSessionToken {
  token: string;
  expiresAt: Date;
  providerUrl: string;
}

export interface SystemInstruction {
  content: string;
  role: 'system';
}

export interface VoiceProviderAdapter {
  providerName: string;
  
  /**
   * Generates a short-lived ephemeral token for the client to connect directly to the Voice Provider
   */
  generateEphemeralToken(session: AiSession, systemInstruction: SystemInstruction): Promise<VoiceProviderSessionToken>;
}

export interface ToolExecutionRequest {
  toolName: string;
  parameters: Record<string, any>;
  callId: string;
}

export interface ToolExecutionResponse {
  callId: string;
  success: boolean;
  result: any;
  error?: string;
}
