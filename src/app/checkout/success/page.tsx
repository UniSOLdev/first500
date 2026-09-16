import { Logo } from "@/components/brand/logo";
import { requireAuth } from "@/lib/auth/server";
import { SuccessClient } from "./success-client";

export default async function CheckoutSuccessPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <SuccessClient />
    </div>
  );
}
