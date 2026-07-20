import { AiSession } from '../types';
import { randomUUID } from 'crypto';

export class SessionManager {
  /**
   * Initializes a new AI interaction session.
   * This is stateless on the DB for now, maintaining the session purely in memory
   * or relying on the ephemeral token lifecycle of the Voice Provider.
   */
  public createSession(tenantId: string, customerId?: string, channel: 'voice' | 'chat' = 'voice'): AiSession {
    const session: AiSession = {
      id: randomUUID(),
      tenantId,
      customerId,
      channel,
      startedAt: new Date(),
    };

    // In future sprints, this could hydrate active cart state, push a record to the DB, etc.
    return session;
  }
}
