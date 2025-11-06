const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

async function testEndpoint(
  name: string,
  path: string,
  options?: RequestInit
): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const duration = Date.now() - start;

    if (!response.ok) {
      return {
        name,
        passed: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        duration,
      };
    }

    return {
      name,
      passed: true,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - start;
    return {
      name,
      passed: false,
      error: error instanceof Error ? error.message : "Unknown error",
      duration,
    };
  }
}

async function runSmokeTests(): Promise<void> {
  console.log("🔍 Running smoke tests...\n");

  const tests: Array<() => Promise<TestResult>> = [
    () => testEndpoint("Health Check", "/api/health.json"),
    () => testEndpoint("Home Page", "/"),
    () => testEndpoint("About Page", "/about"),
    () => testEndpoint("Pricing Page", "/pricing"),
    () => testEndpoint("Services Page", "/services"),
    () => testEndpoint("Contact Page", "/contact"),
    () => testEndpoint("Sign In Page", "/sign-in"),
    () => testEndpoint("Sign Up Page", "/sign-up"),
  ];

  const results: TestResult[] = [];

  for (const test of tests) {
    const result = await test();
    results.push(result);

    const icon = result.passed ? "✅" : "❌";
    const time = `(${result.duration}ms)`;
    console.log(`${icon} ${result.name} ${time}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  console.log("\n" + "=".repeat(50));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const avgTime = Math.round(results.reduce((sum, r) => sum + r.duration, 0) / total);

  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Average response time: ${avgTime}ms`);

  if (failed > 0) {
    console.log("\n❌ Smoke tests failed!");
    process.exit(1);
  } else {
    console.log("\n✅ All smoke tests passed!");
    process.exit(0);
  }
}

if (require.main === module) {
  runSmokeTests().catch((error) => {
    console.error("Fatal error running smoke tests:", error);
    process.exit(1);
  });
}

export { runSmokeTests, testEndpoint };
