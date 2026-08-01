import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public (browser-safe) client using anon key.
export function getPublicSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  return createClient(url, anon, { auth: { persistSession: false } });
}

// Server-only client using service-role key. NEVER expose to the browser.
export function getAdminSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    throw new Error(
      "Supabase admin env vars missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }
  return createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Returns true only if real (non-placeholder) Supabase credentials are set.
 * The .env.local.example file uses placeholder values like
 * "YOUR-PROJECT-ref.supabase.co" and "YOUR_ANON_KEY" — those should NOT
 * trigger the Supabase code path. We check for both presence and validity.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) return false;
  // Reject known placeholder values from .env.local.example.
  if (url.includes("YOUR-PROJECT") || url.includes("YOUR_PROJECT")) return false;
  if (url.includes("example.supabase.co")) return false;
  if (anon === "YOUR_ANON_KEY" || service === "YOUR_SERVICE_ROLE_KEY") return false;
  // Must look like a real https URL.
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) return false;
  return true;
}
