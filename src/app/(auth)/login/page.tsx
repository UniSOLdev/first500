import { Logo } from "@/components/brand/logo";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthUnavailable } from "@/components/auth/auth-unavailable";
import { signIn } from "../actions";
import { safeRedirectPath } from "@/lib/auth/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const redirectTo = safeRedirectPath(next ?? "/dashboard");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      {isSupabaseConfigured() ? (
        <AuthForm
          mode="login"
          action={signIn}
          next={redirectTo}
          initialError={
            error === "auth"
              ? "Sign-in failed. Please try again or reset your password."
              : undefined
          }
        />
      ) : (
        <AuthUnavailable />
      )}
    </div>
  );
}
