import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readServerEnv } from "@/lib/env";
import {
  err,
  failure,
  ok,
  type Failure,
  type Result,
} from "@/lib/services/result";

/**
 * The single Supabase client in the codebase.
 *
 * It is server-only (the `server-only` import makes importing it from a client
 * component a build error, not a runtime surprise) and it holds the service role
 * key, so every write it performs has already been validated by the route handler
 * that called it. No component, anywhere, imports this file.
 */

let cached: SupabaseClient | null = null;

export function getSupabase(): Result<SupabaseClient, Failure> {
  if (cached) return ok(cached);

  const env = readServerEnv();
  if (!env.ok) {
    return err(
      failure("config", "تعذّر إرسال الطلب الآن. يرجى المحاولة لاحقًا.", {
        retryable: false,
      }),
    );
  }

  cached = createClient(env.env.supabaseUrl, env.env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application": "turjoman-web" } },
  });

  return ok(cached);
}
