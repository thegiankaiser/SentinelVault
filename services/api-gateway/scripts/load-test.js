const axios = require('axios');

async function main() {
  const token = process.env.TOKEN;
  if (!token) throw new Error('Set TOKEN to a valid JWT before running the load test.');
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const concurrency = Number(process.env.CONCURRENCY || 10);
  const requests = Number(process.env.REQUESTS || 100);
  const durations = [];
  let failures = 0;
  async function worker(count) {
    for (let i = 0; i < count; i++) {
      const start = performance.now();
      try {
        await axios.get(`${base}/api/telemetry`, { headers: { Authorization: `Bearer ${token}` } });
      } catch { failures++; }
      durations.push(performance.now() - start);
    }
  }
  const each = Math.ceil(requests / concurrency);
  await Promise.all(Array.from({ length: concurrency }, () => worker(each)));
  durations.sort((a, b) => a - b);
  const percentile = p => durations[Math.min(durations.length - 1, Math.floor(durations.length * p))];
  console.log({ samples: durations.length, failures, p50Ms: +percentile(.50).toFixed(2),
    p95Ms: +percentile(.95).toFixed(2), p99Ms: +percentile(.99).toFixed(2) });
}
main().catch(err => { console.error(err.message); process.exit(1); });
