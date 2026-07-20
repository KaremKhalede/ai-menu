import { db } from '../../src/lib/db';
import { KnowledgeEngine } from '../../src/services/ai/knowledge/KnowledgeEngine';
import { ConversationEngine } from '../../src/services/ai/core/ConversationEngine';
import { ToolCallingEngine } from '../../src/services/ai/tools/ToolCallingEngine';
import { CacheManager } from '../../src/lib/cache/CacheManager';
import { VoiceProviderAdapter, SystemInstruction } from '../../src/services/ai/types';
import { execSync } from 'child_process';
import { performance } from 'perf_hooks';
import * as fs from 'fs';

const tenantId = 'e2e-tenant';

class MockVoiceAdapter implements VoiceProviderAdapter {
  providerName = 'bench';
  async createSession(instruction: SystemInstruction): Promise<any> { return {}; }
  async injectAudio(sessionId: string, audioData: Buffer): Promise<void> {}
  async terminateSession(sessionId: string): Promise<void> {}
  async generateEphemeralToken(): Promise<any> { return { token: 'mock', expiresAt: new Date(), providerUrl: 'mock' }; }
}

async function runBenchmark(name: string, iterations: number, warmup: number, fn: () => Promise<void>) {
  // Warmup
  for (let i = 0; i < warmup; i++) {
    await fn();
  }

  // Measure
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }

  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  const best = Math.min(...times);
  const worst = Math.max(...times);
  const variance = times.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);

  return { name, avg, best, worst, stdDev, iterations };
}

async function main() {
  console.log('[Level 1] Starting Engine Benchmarks...');
  
  // Seed DB
  execSync('npx cross-env DATABASE_URL="file:./dev.test.db" NODE_ENV=test npx tsx tests/e2e/seed.ts', { stdio: 'inherit' });
  
  await CacheManager.delete(`ai:knowledge:menu:${tenantId}`);
  await CacheManager.delete(`ai:knowledge:promotions:${tenantId}`);

  const knowledgeEngine = new KnowledgeEngine();
  const conversationEngine = new ConversationEngine(new MockVoiceAdapter());
  const toolEngine = new ToolCallingEngine();
  
  const results: any[] = [];

  // 1. KnowledgeEngine - Cache Miss
  results.push(await runBenchmark('KnowledgeEngine (Cache Miss)', 50, 5, async () => {
    await CacheManager.delete(`ai:knowledge:menu:${tenantId}`);
    await knowledgeEngine.getMenuKnowledge(tenantId);
  }));

  // 2. KnowledgeEngine - Cache Hit
  await knowledgeEngine.getMenuKnowledge(tenantId); // ensure populated
  results.push(await runBenchmark('KnowledgeEngine (Cache Hit)', 1000, 100, async () => {
    await knowledgeEngine.getMenuKnowledge(tenantId);
  }));

  // 3. ConversationEngine - Pipeline Synthesis
  results.push(await runBenchmark('ConversationEngine Pipeline', 500, 50, async () => {
    await conversationEngine.initializeVoiceSession(tenantId);
  }));

  // 4. ToolCallingEngine - add_to_cart execution
  results.push(await runBenchmark('ToolCallingEngine (add_to_cart)', 100, 10, async () => {
    await toolEngine.executeTool(tenantId, 'bench-session', 'e2e-cust', 'add_to_cart', { dishId: 'dish-burger', quantity: 1 });
  }));

  console.table(results);
  fs.writeFileSync('tests/perf/level1-results.json', JSON.stringify(results, null, 2));
  
  await db.$disconnect();
}

main().catch(console.error);
