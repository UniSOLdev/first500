import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { requireAuth } from "@/lib/auth/server";
import { hasActiveEntitlement } from "@/lib/entitlements";
import { PRODUCT } from "@/config/product";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const user = await requireAuth();
  const entitled = await hasActiveEntitlement(user.id, PRODUCT.key);

  if (entitled) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <CheckoutClient />
    </div>
  );
}
