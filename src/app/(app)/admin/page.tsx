import { redirect } from "next/navigation";
import { requireAuth, isAdminEmail } from "@/lib/auth/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRODUCT } from "@/config/product";

export default async function AdminPage() {
  const user = await requireAuth();

  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  let stats = {
    totalUsers: 0,
    paidUsers: 0,
    onboardingCompleted: 0,
    dayCompletions: 0,
  };

  try {
    const admin = createAdminClient();

    const [
      { count: totalUsers },
      { count: paidUsers },
      { count: onboardingCompleted },
      { count: dayCompletions },
    ] = await Promise.all([
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin
        .from("entitlements")
        .select("*", { count: "exact", head: true })
        .eq("product_key", PRODUCT.key)
        .eq("status", "active"),
      admin
        .from("challenge_profiles")
        .select("*", { count: "exact", head: true })
        .eq("onboarding_completed", true),
      admin
        .from("challenge_progress")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),
    ]);

    stats = {
      totalUsers: totalUsers ?? 0,
      paidUsers: paidUsers ?? 0,
      onboardingCompleted: onboardingCompleted ?? 0,
      dayCompletions: dayCompletions ?? 0,
    };
  } catch {
    // Admin credentials may be unavailable in local dev
  }

  const metrics = [
    { label: "Total users", value: stats.totalUsers },
    { label: "Paid users", value: stats.paidUsers },
    { label: "Onboarding completed", value: stats.onboardingCompleted },
    { label: "Day completions", value: stats.dayCompletions },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="text-muted-foreground mt-1">
            {PRODUCT.name} — platform overview
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-neutral-200">
              <CardHeader className="pb-2">
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {metric.value.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
