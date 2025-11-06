const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const base = SUPABASE_URL || "http://localhost:54321";

if (!SUPABASE_URL) {
  console.error("Error: VITE_SUPABASE_URL or SUPABASE_URL environment variable is required");
  process.exit(1);
}

async function mustOk(path, description) {
  try {
    const url = `${base}/functions/v1/${path}`;
    console.log(`Testing: ${description}`);
    console.log(`  URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.ok === false) {
      throw new Error(`Response ok=false: ${JSON.stringify(json)}`);
    }

    console.log(`  ✓ PASS - ${description}`);
    return json;
  } catch (error) {
    console.error(`  ✗ FAIL - ${description}`);
    console.error(`  Error: ${error.message}`);
    throw error;
  }
}

async function checkEndpoint(path, description) {
  try {
    const url = `${base}/functions/v1/${path}`;
    console.log(`Testing: ${description}`);
    console.log(`  URL: ${url}`);

    const response = await fetch(url);
    const json = await response.json();

    console.log(`  Status: ${response.status}`);
    console.log(`  Response: ${JSON.stringify(json, null, 2)}`);

    if (response.status === 200 || response.status === 503) {
      console.log(`  ✓ PASS - ${description}`);
      return json;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.error(`  ✗ FAIL - ${description}`);
    console.error(`  Error: ${error.message}`);
    throw error;
  }
}

(async () => {
  console.log("\n=== BioMath Core - API Smoke Tests ===\n");
  console.log(`Base URL: ${base}\n`);

  try {
    await mustOk("uptime", "Uptime endpoint");

    await checkEndpoint("deps-check", "Dependencies check endpoint");

    console.log("\n=== Static Files ===\n");

    const healthUrl = base.replace("/functions/v1", "") + "/api/health.json";
    console.log(`Testing: Static health check`);
    console.log(`  URL: ${healthUrl}`);

    const healthResponse = await fetch(healthUrl);
    if (healthResponse.ok) {
      const healthJson = await healthResponse.json();
      console.log(`  ✓ PASS - Static health check`);
      console.log(`  Response: ${JSON.stringify(healthJson, null, 2)}`);
    } else {
      console.log(`  ⚠ WARN - Static health check returned ${healthResponse.status}`);
    }

    console.log("\n=== All Smoke Tests Passed ===\n");
    process.exit(0);
  } catch (error) {
    console.error("\n=== Smoke Tests Failed ===\n");
    console.error(error.message);
    process.exit(1);
  }
})();
