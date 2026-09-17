"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/auth/server";
import { trackServer } from "@/lib/analytics";
import {
  isSupabaseConfigured,
  SupabaseNotConfiguredError,
} from "@/lib/supabase/config";

type AuthActionState = {
  error?: string;
  success?: boolean;
};

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function authUnavailableMessage(): AuthActionState {
  return {
    error:
      "Sign-in is temporarily unavailable. Please try again in a few minutes.",
  };
}

async function withAuthClient<T>(
  fn: (supabase: Awaited<ReturnType<typeof createClient>>) => Promise<T>
): Promise<T | AuthActionState> {
  if (!isSupabaseConfigured()) {
    console.error("[auth] Supabase not configured — action blocked");
    return authUnavailableMessage();
  }

  try {
    const supabase = await createClient();
    return await fn(supabase);
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return authUnavailableMessage();
    }
    throw error;
  }
}

export async function signUp(
  _prevState: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const next = safeRedirectPath(formData.get("next") as string);

  const result = await withAuthClient(async (supabase) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      return { error: error.message } satisfies AuthActionState;
    }

    trackServer("signup_completed", { email });
    redirect(next);
  });

  if (result && "error" in result) {
    return result;
  }

  return undefined;
}

export async function signIn(
  _prevState: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = safeRedirectPath(formData.get("next") as string);

  const result = await withAuthClient(async (supabase) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message } satisfies AuthActionState;
    }

    redirect(next);
  });

  if (result && "error" in result) {
    return result;
  }

  return undefined;
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("[auth] signOut failed", error);
  }

  redirect("/");
}

export async function forgotPassword(
  _prevState: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;

  const result = await withAuthClient(async (supabase) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
    });

    if (error) {
      return { error: error.message } satisfies AuthActionState;
    }

    return { success: true } satisfies AuthActionState;
  });

  if (result && ("error" in result || "success" in result)) {
    return result;
  }

  return authUnavailableMessage();
}

export async function resetPassword(
  _prevState: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState | undefined> {
  const password = formData.get("password") as string;

  const result = await withAuthClient(async (supabase) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: error.message } satisfies AuthActionState;
    }

    redirect("/dashboard");
  });

  if (result && "error" in result) {
    return result;
  }

  return undefined;
}
