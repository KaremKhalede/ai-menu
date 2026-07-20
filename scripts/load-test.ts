import autocannon from 'autocannon';
import * as fs from 'fs';

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

const tenantId = 'e2e-tenant';
let sessionId = `bench-session-${Date.now()}`;

function runTest(title: string, opts: autocannon.Options): Promise<autocannon.Result> {
  return new Promise((resolve, reject) => {
    console.log(`\n[Level 2] Running Load Test: ${title}`);
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
  
  // 1. Session Initialization (Burst) - "Lunch Peak initialization spike"
  results.push(await runTest('Session Init (Burst)', {
    url: `${URL}/api/ai/session`,
    method: 'POST',
    connections: 50,
    duration: 10,
    body: JSON.stringify({ tenantId }),
    headers: { 'Content-Type': 'application/json' }
  }));

  // 2. Tool Execution (Sustained) - "Dinner Peak tool executions"
  results.push(await runTest('Tool Execution (Sustained)', {
    url: `${URL}/api/ai/tools/execute`,
    method: 'POST',
    connections: 10, // Concurrency 10
    duration: 15,
    body: JSON.stringify({
      tenantId,
      sessionId,
      actionName: 'add_to_cart',
      args: { dishId: 'dish-burger', quantity: 1 }
    }),
    headers: { 'Content-Type': 'application/json' }
  }));

  // 3. Mixed Traffic (Real-world simulation)
  results.push(await runTest('Mixed Traffic (Lunch Peak)', {
    url: URL,
    connections: 20,
    duration: 15,
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

  fs.writeFileSync('tests/perf/level2-results.json', JSON.stringify(results, null, 2));
  console.log('\n[Level 2] Load tests complete. Baseline saved to tests/perf/level2-results.json');
}

main().catch(console.error);
