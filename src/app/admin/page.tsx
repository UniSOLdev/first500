import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRODUCT } from "@/config/product";

type FunnelCounts = Record<string, number>;

async function getFunnelCounts(): Promise<FunnelCounts> {
  try {
    const admin = createAdminClient();
    const events = [
      "landing_view",
      "cta_click",
      "signup_completed",
      "checkout_started",
      "purchase_completed",
      "dashboard_view",
      "day_1_started",
      "challenge_completed",
    ] as const;

    const counts: FunnelCounts = {};
    await Promise.all(
      events.map(async (event) => {
        const { count } = await admin
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("event_name", event);
        counts[event] = count ?? 0;
      })
    );
    return counts;
  } catch {
    return {};
  }
}

export default async function AdminPage() {
  let stats = {
    totalUsers: 0,
    paidUsers: 0,
    onboardingCompleted: 0,
    dayCompletions: 0,
    revenueEstimate: 0,
  };

  let customers: Array<{
    email: string;
    purchased_at: string | null;
    stripe_customer_id: string | null;
    stripe_checkout_session_id: string | null;
    status: string;
  }> = [];

  const funnel = await getFunnelCounts();

  try {
    const admin = createAdminClient();

    const [
      { count: totalUsers },
      { count: paidUsers },
      { count: onboardingCompleted },
      { count: dayCompletions },
      { data: entitlementRows },
      { data: profileRows },
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
      admin
        .from("entitlements")
        .select("user_id, status, purchased_at, stripe_customer_id, stripe_checkout_session_id")
        .eq("product_key", PRODUCT.key)
        .order("purchased_at", { ascending: false })
        .limit(50),
      admin.from("profiles").select("id, email"),
    ]);

    const emailByUserId = new Map(
      (profileRows ?? []).map((p) => [p.id, p.email])
    );

    stats = {
      totalUsers: totalUsers ?? 0,
      paidUsers: paidUsers ?? 0,
      onboardingCompleted: onboardingCompleted ?? 0,
      dayCompletions: dayCompletions ?? 0,
      revenueEstimate: (paidUsers ?? 0) * PRODUCT.priceCents,
    };

    customers =
      entitlementRows?.map((row) => ({
        email: emailByUserId.get(row.user_id) ?? "—",
        purchased_at: row.purchased_at,
        stripe_customer_id: row.stripe_customer_id,
        stripe_checkout_session_id: row.stripe_checkout_session_id,
        status: row.status,
      })) ?? [];
  } catch {
    // Service role may be unavailable locally
  }

  const signups = funnel.signup_completed ?? 0;
  const purchases = funnel.purchase_completed ?? stats.paidUsers;
  const conversionRate =
    signups > 0 ? ((purchases / signups) * 100).toFixed(1) : "—";

  const metrics = [
    { label: "Total users", value: stats.totalUsers },
    { label: "Paid customers", value: stats.paidUsers },
    { label: "Est. revenue", value: `$${(stats.revenueEstimate / 100).toFixed(0)}` },
    { label: "Signup → purchase", value: `${conversionRate}%` },
  ];

  const funnelMetrics = [
    { label: "Landing views", value: funnel.landing_view ?? 0 },
    { label: "CTA clicks", value: funnel.cta_click ?? 0 },
    { label: "Signups", value: signups },
    { label: "Checkout starts", value: funnel.checkout_started ?? 0 },
    { label: "Purchases", value: purchases },
    { label: "Dashboard views", value: funnel.dashboard_view ?? 0 },
    { label: "Day 1 starts", value: funnel.day_1_started ?? 0 },
    { label: "Challenge completions", value: funnel.challenge_completed ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{PRODUCT.name}</h2>
        <p className="text-muted-foreground mt-1">Platform overview for ads &amp; funnel</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-neutral-200">
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{metric.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle>Funnel events</CardTitle>
          <CardDescription>Internal analytics — recorded event counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {funnelMetrics.map((item) => (
              <div key={item.label} className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-semibold tabular-nums">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle>Recent customers</CardTitle>
          <CardDescription>Latest entitlements (max 50)</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Email</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Purchased</th>
                <th className="pb-2 font-medium">Stripe session</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-muted-foreground">
                    No customers yet — or SUPABASE_SERVICE_ROLE_KEY not configured.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.stripe_checkout_session_id ?? customer.email}
                    className="border-b border-border/40"
                  >
                    <td className="py-2 pr-4">{customer.email}</td>
                    <td className="py-2 pr-4">{customer.status}</td>
                    <td className="py-2 pr-4">
                      {customer.purchased_at
                        ? new Date(customer.purchased_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">
                      {customer.stripe_checkout_session_id?.slice(0, 20) ?? "—"}…
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
