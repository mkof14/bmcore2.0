import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function checkSupabase(): Promise<{ ok: boolean; status?: number; reason?: string }> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return { ok: false, reason: "env-missing" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("profiles").select("id").limit(1);

    return { ok: !error, status: error ? 500 : 200 };
  } catch {
    return { ok: false, reason: "error" };
  }
}

async function checkStripe(): Promise<{ ok: boolean; reason?: string; configured: boolean }> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return { ok: false, reason: "env-missing", configured: false };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: apiKeyConfig } = await supabase
      .from("api_keys_configuration")
      .select("key_value")
      .eq("key_name", "stripe_secret")
      .maybeSingle();

    if (!apiKeyConfig?.key_value || !apiKeyConfig.key_value.startsWith("sk_")) {
      return { ok: false, reason: "not-configured", configured: false };
    }

    return { ok: true, configured: true };
  } catch {
    return { ok: false, reason: "error", configured: false };
  }
}

async function checkAI(): Promise<{ ok: boolean; openai: boolean; anthropic: boolean; gemini: boolean }> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return { ok: false, openai: false, anthropic: false, gemini: false };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: keys } = await supabase
      .from("api_keys_configuration")
      .select("key_name, key_value")
      .in("key_name", ["openai_key", "anthropic_key", "gemini_key"]);

    const openai = keys?.some((k) => k.key_name === "openai_key" && k.key_value?.startsWith("sk-")) || false;
    const anthropic = keys?.some((k) => k.key_name === "anthropic_key" && k.key_value?.startsWith("sk-ant-")) || false;
    const gemini = keys?.some((k) => k.key_name === "gemini_key" && k.key_value?.startsWith("AIza")) || false;

    return {
      ok: openai || anthropic || gemini,
      openai,
      anthropic,
      gemini,
    };
  } catch {
    return { ok: false, openai: false, anthropic: false, gemini: false };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const [supabase, stripe, ai] = await Promise.all([
      checkSupabase(),
      checkStripe(),
      checkAI(),
    ]);

    const ok = !!(supabase.ok && stripe.ok && ai.ok);

    const response = {
      ok,
      supabase,
      stripe,
      ai,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: ok ? 200 : 503,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
