import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/auth/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    console.error("[auth/callback] Supabase not configured");
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error("[auth/callback] Code exchange failed:", error.message);
    } catch (error) {
      console.error("[auth/callback] Unexpected error:", error);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
