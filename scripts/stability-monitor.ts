import * as fs from 'fs';

const PORT = 3000;
const URL = `http://localhost:${PORT}/api/health/metrics`;
const INTERVAL_MS = 5000; // Poll every 5 seconds
const DURATION_S = 900; // 15 minutes max (or pass via args)

interface MetricsRow {
  time: number;
  heapUsedMb: number;
  rssMb: number;
  cpuPercent: number;
  eventLoopP99Ms: number;
  eventBusQueueDepth: number;
  eventBusPublished: number;
  eventBusProcessed: number;
}

async function fetchMetrics(): Promise<any> {
  try {
    const res = await fetch(URL, { headers: { 'Authorization': `Bearer ${process.env.ADMIN_TELEMETRY_TOKEN}` }});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    console.error(`[Monitor] Failed to fetch metrics: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`[Monitor] Starting stability monitor for ${DURATION_S} seconds...`);
  const results: MetricsRow[] = [];
  const startTime = Date.now();

  const intervalId = setInterval(async () => {
    const elapsedS = Math.floor((Date.now() - startTime) / 1000);
    if (elapsedS >= DURATION_S) {
      clearInterval(intervalId);
      finish(results);
      return;
    }

    const data = await fetchMetrics();
    if (data) {
      const row: MetricsRow = {
        time: elapsedS,
        heapUsedMb: +(data.memory.heapUsed / 1024 / 1024).toFixed(2),
        rssMb: +(data.memory.rss / 1024 / 1024).toFixed(2),
        cpuPercent: +(data.cpu.utilizationPercent).toFixed(2),
        eventLoopP99Ms: +(data.eventLoop.delayP99).toFixed(2),
        eventBusQueueDepth: data.eventBus.queueDepth,
        eventBusPublished: data.eventBus.published,
        eventBusProcessed: data.eventBus.processed,
      };
      results.push(row);
      process.stdout.write(`\r[Monitor] T+${elapsedS}s | Heap: ${row.heapUsedMb}MB | CPU: ${row.cpuPercent}% | EL P99: ${row.eventLoopP99Ms}ms | Queue: ${row.eventBusQueueDepth}    `);
    }
  }, INTERVAL_MS);
}

function finish(results: MetricsRow[]) {
  console.log('\n[Monitor] Run complete. Generating reports...');

  // CSV
  const csvHeaders = 'Time(s),HeapUsed(MB),RSS(MB),CPU(%),EventLoopP99(ms),QueueDepth,Published,Processed\n';
  const csvRows = results.map(r => 
    `${r.time},${r.heapUsedMb},${r.rssMb},${r.cpuPercent},${r.eventLoopP99Ms},${r.eventBusQueueDepth},${r.eventBusPublished},${r.eventBusProcessed}`
  ).join('\n');
  fs.writeFileSync('tests/perf/telemetry-results.csv', csvHeaders + csvRows);

  // Markdown (sampled to ~15 rows for readability)
  let md = `## Long-Duration Stability Telemetry (Sampled)\n\n`;
  md += `| Time (s) | Heap Used (MB) | RSS (MB) | CPU (%) | Event Loop P99 (ms) | Queue Depth |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  
  const step = Math.max(1, Math.floor(results.length / 15));
  for (let i = 0; i < results.length; i += step) {
    const r = results[i];
    md += `| ${r.time} | ${r.heapUsedMb} | ${r.rssMb} | ${r.cpuPercent} | ${r.eventLoopP99Ms} | ${r.eventBusQueueDepth} |\n`;
  }

  // Ensure last row is included
  if (results.length > 0 && results.length % step !== 1) {
    const r = results[results.length - 1];
    md += `| ${r.time} | ${r.heapUsedMb} | ${r.rssMb} | ${r.cpuPercent} | ${r.eventLoopP99Ms} | ${r.eventBusQueueDepth} |\n`;
  }

  fs.writeFileSync('tests/perf/telemetry-results.md', md);
  console.log('[Monitor] Generated tests/perf/telemetry-results.csv and tests/perf/telemetry-results.md');
}

main().catch(console.error);
