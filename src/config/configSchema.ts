export type KeyScope = "client_public" | "server_private" | "flag";
export type EnvTarget = "preview" | "production" | "both";

export type ConfigKey = {
  key: string;
  label: string;
  description?: string;
  required: boolean;
  scope: KeyScope;
  envTarget: EnvTarget;
  example?: string;
  validator?: { startsWith?: string; regex?: string; notContains?: string[]; };
};

export type ConfigSection = {
  group: "Supabase" | "Flags" | "AI" | "Email" | "Analytics" | "Storage" | "Devices";
  title: string;
  subtitle?: string;
  keys: ConfigKey[];
};

export const CONFIG_SECTIONS: ConfigSection[] = [
  {
    group: "Supabase",
    title: "Supabase (required)",
    subtitle: "Core auth & DB connectivity.",
    keys: [
      {
        key: "VITE_SUPABASE_URL",
        label: "Project URL",
        required: true,
        scope: "client_public",
        envTarget: "both",
        example: "https://YOUR.supabase.co",
        validator: { startsWith: "https://" }
      },
      {
        key: "VITE_SUPABASE_ANON_KEY",
        label: "Anon public key",
        required: true,
        scope: "client_public",
        envTarget: "both",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
      }
    ]
  },
  {
    group: "Flags",
    title: "Feature flags & safety",
    subtitle: "Freeze UI, QA mode, Trust Center.",
    keys: [
      { key: "VITE_CONFIG_LOCK", label: "Config Lock", required: true, scope: "flag", envTarget: "both", example: "1" },
      { key: "VITE_QA_MODE", label: "QA Mode", required: true, scope: "flag", envTarget: "both", example: "1" },
      { key: "VITE_DUAL_OPINION_ENABLED", label: "Dual Opinion ON", required: true, scope: "flag", envTarget: "both", example: "1" },
      { key: "REPORTS_PDF_ENABLED", label: "PDF Export", required: true, scope: "flag", envTarget: "both", example: "1" }
    ]
  },
  {
    group: "AI",
    title: "AI providers",
    subtitle: "Optional AI keys.",
    keys: [
      { key: "VITE_GEMINI_API_KEY", label: "Gemini", required: false, scope: "client_public", envTarget: "both" },
      { key: "VITE_ANTHROPIC_API_KEY", label: "Anthropic", required: false, scope: "client_public", envTarget: "both" },
      { key: "VITE_OPENAI_API_KEY", label: "OpenAI", required: false, scope: "client_public", envTarget: "both" }
    ]
  },
  {
    group: "Email",
    title: "Email providers",
    subtitle: "Optional",
    keys: [
      { key: "VITE_RESEND_API_KEY", label: "Resend", required: false, scope: "client_public", envTarget: "both" },
      { key: "VITE_SENDGRID_API_KEY", label: "SendGrid", required: false, scope: "client_public", envTarget: "both" }
    ]
  },
  {
    group: "Analytics",
    title: "Analytics",
    subtitle: "Optional GA/Sentry.",
    keys: [
      { key: "VITE_GA_MEASUREMENT_ID", label: "GA4 ID", required: false, scope: "client_public", envTarget: "both" },
      { key: "VITE_SENTRY_DSN", label: "Sentry DSN", required: false, scope: "client_public", envTarget: "both" }
    ]
  },
  {
    group: "Storage",
    title: "Storage",
    subtitle: "S3/Cloudinary optional.",
    keys: [
      { key: "VITE_AWS_S3_BUCKET", label: "S3 Bucket", required: false, scope: "client_public", envTarget: "both" }
    ]
  },
  {
    group: "Devices",
    title: "Devices APIs",
    subtitle: "OAuth-ready integrations.",
    keys: [
      { key: "VITE_WITHINGS_CLIENT_ID", label: "Withings ID", required: false, scope: "client_public", envTarget: "both" }
    ]
  }
];
