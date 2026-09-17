import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getSiteUrl } from "@/lib/stripe/client";
import { getStripePriceId, isStripeConfigured } from "@/lib/stripe/config";
import { hasActiveEntitlement } from "@/lib/entitlements";
import { PRODUCT } from "@/config/product";
import { trackServer } from "@/lib/analytics";
import { getSupportEmail } from "@/lib/support";

export async function POST() {
  if (!isStripeConfigured()) {
    console.error("[stripe/checkout] Stripe not configured");
    return NextResponse.json(
      {
        error: `Checkout is temporarily unavailable. Please try again shortly or email ${getSupportEmail()}.`,
      },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
  }

  const entitled = await hasActiveEntitlement(user.id, PRODUCT.key);
  if (entitled) {
    return NextResponse.json(
      { error: "You already have access.", redirect: "/dashboard" },
      { status: 409 }
    );
  }

  try {
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: getStripePriceId(), quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        product_key: PRODUCT.key,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/canceled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to start checkout. Please try again." },
        { status: 500 }
      );
    }

    trackServer("checkout_started", { product_key: PRODUCT.key }, user.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/checkout]", error);
    return NextResponse.json(
      {
        error: `Unable to start checkout. Please try again or contact ${getSupportEmail()}.`,
      },
      { status: 500 }
    );
  }
}
