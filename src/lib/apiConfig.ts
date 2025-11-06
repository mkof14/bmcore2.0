export const API_KEYS = {
  OPENAI: import.meta.env.VITE_OPENAI_API_KEY || '',
  GEMINI: import.meta.env.VITE_GEMINI_API_KEY || '',
  COPILOT: import.meta.env.VITE_GITHUB_COPILOT_TOKEN || '',
  ANTHROPIC: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  ELEVENLABS: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  SENDGRID: import.meta.env.VITE_SENDGRID_API_KEY || '',
  RESEND: import.meta.env.VITE_RESEND_API_KEY || '',
  GOOGLE_ANALYTICS: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  VAPID_PUBLIC: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
  CLOUDINARY: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  AWS_S3_BUCKET: import.meta.env.VITE_AWS_S3_BUCKET || '',
  APPLE_HEALTH: import.meta.env.VITE_APPLE_HEALTH_CLIENT_ID || '',
  FITBIT: import.meta.env.VITE_FITBIT_CLIENT_ID || '',
  GOOGLE_FIT: import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID || '',
  OURA: import.meta.env.VITE_OURA_CLIENT_ID || '',
  WITHINGS: import.meta.env.VITE_WITHINGS_CLIENT_ID || '',
  WHOOP: import.meta.env.VITE_WHOOP_CLIENT_ID || '',
  GARMIN: import.meta.env.VITE_GARMIN_CLIENT_ID || '',
};

export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1',
  GEMINI: 'https://generativelanguage.googleapis.com/v1',
  ANTHROPIC: 'https://api.anthropic.com/v1',
  ELEVENLABS: 'https://api.elevenlabs.io/v1',
  SENDGRID: 'https://api.sendgrid.com/v3',
  RESEND: 'https://api.resend.com',
  CLOUDINARY: 'https://api.cloudinary.com/v1_1',
  APPLE_HEALTH: 'https://developer.apple.com/health-records',
  FITBIT: 'https://api.fitbit.com',
  GOOGLE_FIT: 'https://www.googleapis.com/fitness/v1',
  OURA: 'https://api.ouraring.com/v2',
  WITHINGS: 'https://wbsapi.withings.net/v2',
  WHOOP: 'https://api.whoop.com/v1',
  GARMIN: 'https://apis.garmin.com',
};

export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL || '',
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export function validateAPIKeys() {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
    return false;
  }

  return true;
}

export function isServiceEnabled(service: keyof typeof API_KEYS): boolean {
  return !!API_KEYS[service];
}
