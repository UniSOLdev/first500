import { Logo } from "@/components/brand/logo";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthUnavailable } from "@/components/auth/auth-unavailable";
import { signUp } from "../actions";
import { safeRedirectPath } from "@/lib/auth/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = safeRedirectPath(next ?? "/checkout");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      {isSupabaseConfigured() ? (
        <AuthForm mode="signup" action={signUp} next={redirectTo} />
      ) : (
        <AuthUnavailable />
      )}
    </div>
  );
}
