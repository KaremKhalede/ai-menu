import autocannon from 'autocannon';
import * as fs from 'fs';

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

const tenantId = 'e2e-tenant';
let sessionId = `stability-session-${Date.now()}`;

function runTest(title: string, opts: autocannon.Options): Promise<autocannon.Result> {
  return new Promise((resolve, reject) => {
    console.log(`\n[Level 3] Running Stability Test: ${title}`);
    console.log(`Connections: ${opts.connections}, Duration: ${opts.duration}s`);
    
    const instance = autocannon(opts, (err, result) => {
      if (err) return reject(err);
      
      console.log(`Completed: ${title}`);
      console.log(`  Requests: ${result.requests.total} (Avg: ${result.requests.average}/s)`);
      console.log(`  Latency P50: ${result.latency.p50}ms`);
      console.log(`  Latency P95: ${result.latency.p95}ms`);
      console.log(`  Latency P99: ${result.latency.p99}ms`);
      console.log(`  Max Latency: ${result.latency.max}ms`);
      console.log(`  Errors: ${result.errors}, Timeouts: ${result.timeouts}`);
      
      resolve(result);
    });

    autocannon.track(instance, { renderProgressBar: false });
  });
}

async function main() {
  const results: any[] = [];
  
  // 15 minutes = 900 seconds
  results.push(await runTest('Long-Duration Stability', {
    url: URL,
    connections: 15,
    duration: 900,
    requests: [
      {
        method: 'POST',
        path: '/api/ai/session',
        body: JSON.stringify({ tenantId }),
        headers: { 'Content-Type': 'application/json' }
      },
      {
        method: 'POST',
        path: '/api/ai/tools/execute',
        body: JSON.stringify({
          tenantId,
          sessionId,
          actionName: 'add_to_cart',
          args: { dishId: 'dish-burger', quantity: 1 }
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    ]
  }));

  fs.writeFileSync('tests/perf/level3-results.json', JSON.stringify(results, null, 2));
  console.log('\n[Level 3] Stability tests complete. Baseline saved to tests/perf/level3-results.json');
}

main().catch(console.error);
