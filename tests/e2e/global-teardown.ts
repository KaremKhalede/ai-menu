import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown() {
  console.log('[E2E Teardown] Cleaning up isolated test database...');
  
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.test.db');
  if (fs.existsSync(dbPath)) {
    // Optionally delete the test db, but leaving it might be useful for post-mortem debugging.
    // fs.unlinkSync(dbPath);
  }
}

export default globalTeardown;
