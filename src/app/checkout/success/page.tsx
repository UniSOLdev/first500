import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { requireAuth } from "@/lib/auth/server";
import { SuccessClient } from "./success-client";

function SuccessLoading() {
  return (
    <div className="w-full max-w-md rounded-xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground">
      Confirming your payment…
    </div>
  );
}

export default async function CheckoutSuccessPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Suspense fallback={<SuccessLoading />}>
        <SuccessClient />
      </Suspense>
    </div>
  );
}
