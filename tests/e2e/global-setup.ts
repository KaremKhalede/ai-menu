import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { CacheManager } from '../../src/lib/cache/CacheManager';

async function globalSetup() {
  console.log('[E2E Setup] Creating isolated test database...');
  
  // Clean up any old test db
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.test.db');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  // Push schema to the new test db
  process.env.DATABASE_URL = 'file:./dev.test.db';
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  
  // Seed basic test data
  execSync('npx tsx tests/e2e/seed.ts', { stdio: 'inherit' });
  
  console.log('[E2E Setup] Clearing test Redis cache...');
  // We don't have a flushAll in CacheManager, but we can clear specific keys or just use a different prefix for E2E if we had one.
  // We'll rely on the tests to clear their own session resources as requested by the user.
}

export default globalSetup;
