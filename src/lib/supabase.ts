import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// If environment variables are not set (e.g., during a Vercel build without secrets),
// provide dummy values to allow the application to build and render.
// The application will show the UI, but all Supabase-related functionality will fail at runtime
// until the correct environment variables are configured in Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
