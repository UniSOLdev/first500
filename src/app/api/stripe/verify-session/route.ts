import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { grantEntitlementFromCheckout, hasActiveEntitlement } from "@/lib/entitlements";
import { isStripeConfigured } from "@/lib/stripe/config";
import { PRODUCT } from "@/config/product";
import { trackServer } from "@/lib/analytics";

const querySchema = z.object({
  session_id: z.string().min(1),
});

/**
 * Server-side fallback when webhook delivery is delayed.
 * Verifies payment with Stripe API — never trusts client payment flags.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = querySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const alreadyActive = await hasActiveEntitlement(user.id, PRODUCT.key);
  if (alreadyActive) {
    return NextResponse.json({ active: true, source: "existing" });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(parsed.data.session_id);

    const sessionUserId =
      session.metadata?.user_id ?? session.client_reference_id ?? null;

    if (sessionUserId !== user.id) {
      return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ active: false, payment_status: session.payment_status });
    }

    const stripeCustomerId =
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null);

    await grantEntitlementFromCheckout({
      userId: user.id,
      productKey: session.metadata?.product_key ?? PRODUCT.key,
      stripeCustomerId,
      stripeCheckoutSessionId: session.id,
      purchasedAt: new Date(session.created * 1000).toISOString(),
    });

    trackServer(
      "purchase_completed",
      { session_id: session.id, source: "verify_session" },
      user.id
    );

    return NextResponse.json({ active: true, source: "verified" });
  } catch (error) {
    console.error("[stripe/verify-session]", error);
    return NextResponse.json(
      { error: "Unable to verify payment" },
      { status: 500 }
    );
  }
}
