import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 50 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<450'],
    failed_requests: ['rate<0.01'],
  },
};

const SUPABASE_URL = __ENV.SUPABASE_URL || 'http://localhost:54321';
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

export default function () {
  const uptimeCheck = http.get(`${SUPABASE_URL}/functions/v1/uptime`);
  check(uptimeCheck, {
    'uptime status is 200': (r) => r.status === 200,
    'uptime has ok field': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.ok === true;
      } catch {
        return false;
      }
    },
  });
  failureRate.add(uptimeCheck.status !== 200);

  sleep(0.5);

  const depsCheck = http.get(`${SUPABASE_URL}/functions/v1/deps-check`);
  check(depsCheck, {
    'deps check status is 200 or 503': (r) => r.status === 200 || r.status === 503,
  });
  failureRate.add(depsCheck.status !== 200 && depsCheck.status !== 503);

  sleep(0.5);

  const healthCheck = http.get(`${BASE_URL}/api/health.json`);
  check(healthCheck, {
    'health check status is 200': (r) => r.status === 200,
  });
  failureRate.add(healthCheck.status !== 200);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  let summary = '\n';

  summary += `${indent}Test Duration: ${data.state.testRunDurationMs}ms\n`;
  summary += `${indent}Total Requests: ${data.metrics.http_reqs.values.count}\n`;
  summary += `${indent}Failed Requests: ${data.metrics.failed_requests.values.rate * 100}%\n`;
  summary += `${indent}Request Duration (p95): ${data.metrics.http_req_duration.values['p(95)']}ms\n`;
  summary += `${indent}Request Duration (avg): ${data.metrics.http_req_duration.values.avg}ms\n`;

  return summary;
}
