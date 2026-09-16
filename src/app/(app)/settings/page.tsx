import Link from "next/link";
import { requireAuth, getProfile } from "@/lib/auth/server";
import { getChallengeProfile } from "@/lib/challenge/queries";
import { hasActiveEntitlement } from "@/lib/entitlements";
import { PRODUCT } from "@/config/product";
import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "./settings-form";
import { signOut } from "@/app/(auth)/actions";

export default async function SettingsPage() {
  const user = await requireAuth();
  const [profile, challengeProfile, entitled] = await Promise.all([
    getProfile(user.id),
    getChallengeProfile(user.id),
    hasActiveEntitlement(user.id, PRODUCT.key),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and challenge preferences
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Challenge Access</p>
            <p className="text-sm text-muted-foreground">{PRODUCT.name}</p>
          </div>
          <Badge variant={entitled ? "default" : "secondary"}>
            {entitled ? "Active" : "Inactive"}
          </Badge>
        </div>

        <SettingsForm
          initial={{
            fullName: profile?.full_name ?? "",
            selectedService: challengeProfile?.selected_service ?? "",
            cityOrMarket: challengeProfile?.city_or_market ?? "",
            startingBudget: challengeProfile?.starting_budget ?? "",
            availableHours: challengeProfile?.available_hours ?? "",
          }}
        />

        <div className="rounded-lg border border-neutral-200 bg-card p-4 space-y-4">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-sm text-muted-foreground">
              Change your password via email reset link
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-brand hover:underline"
          >
            Change password
          </Link>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-destructive hover:underline"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
