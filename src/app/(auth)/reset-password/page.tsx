import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { getUser } from "@/lib/auth/server";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <div className="w-full max-w-md text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Your reset link may have expired or already been used.
          </p>
          <Link href="/forgot-password" className="text-brand hover:underline text-sm">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <ResetPasswordForm />
    </div>
  );
}
