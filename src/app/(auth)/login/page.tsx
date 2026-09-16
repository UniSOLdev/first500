import { Logo } from "@/components/brand/logo";
import { AuthForm } from "@/components/auth/auth-form";
import { signIn } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <AuthForm mode="login" action={signIn} next={next ?? "/dashboard"} />
    </div>
  );
}
