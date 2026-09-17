/**
 * Central Supabase configuration.
 * Supports both publishable key (sb_publishable_...) and legacy anon key names.
 *
 * Production fallbacks use the public publishable key only — safe to expose client-side.
 * Env vars always take precedence when set.
 */
const PRODUCTION_SITE_HOSTS = [
  "first500-fawn.vercel.app",
  "first500-unisoldevs-projects.vercel.app",
];

const PRODUCTION_SUPABASE_URL = "https://fnjcqlspebccknzshxfa.supabase.co";
const PRODUCTION_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_liktHB7cTd9XNW8v1LMo_A_iW-nwSok";

function isProductionSite(): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return process.env.VERCEL_ENV === "production";
  try {
    const host = new URL(siteUrl).hostname;
    return PRODUCTION_SITE_HOSTS.includes(host);
  } catch {
    return false;
  }
}

export function getSupabaseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (url) return url;
  if (isProductionSite()) return PRODUCTION_SUPABASE_URL;
  return undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (key) return key;
  if (isProductionSite()) return PRODUCTION_SUPABASE_PUBLISHABLE_KEY;
  return undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Authentication is temporarily unavailable. Please try again in a few minutes or contact support."
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

export function requireSupabaseConfig(): { url: string; anonKey: string } {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    console.error(
      "[supabase] Missing configuration:",
      !url ? "NEXT_PUBLIC_SUPABASE_URL" : null,
      !anonKey
        ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        : null
    );
    throw new SupabaseNotConfiguredError();
  }

  return { url, anonKey };
}
