/**
 * Environment access, in one place.
 *
 * The Supabase credentials are server-only and never prefixed with NEXT_PUBLIC_,
 * so they cannot leak into the client bundle. The browser reaches the database
 * through our own route handler, never directly — which also means the service
 * role key stays on the server, where a write can be validated before it lands.
 */

export type ServerEnv = {
  supabaseUrl: string;
  supabaseServiceKey: string;
};

/** The studio's WhatsApp number, in E.164. Optional: a missing number must never
 *  fail an order — Supabase is the source of truth, WhatsApp is only the channel. */
export function readWhatsAppNumber(): string | null {
  const raw = process.env.WHATSAPP_BUSINESS_NUMBER?.trim();
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export type EnvResult =
  { ok: true; env: ServerEnv } | { ok: false; missing: string[] };

/** Read and validate at call time, not at import time — a missing key must not crash the build. */
export function readServerEnv(): EnvResult {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missing: string[] = [];
  if (!supabaseUrl) missing.push("SUPABASE_URL");
  if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missing.length || !supabaseUrl || !supabaseServiceKey) {
    return { ok: false, missing };
  }

  return { ok: true, env: { supabaseUrl, supabaseServiceKey } };
}
