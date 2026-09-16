import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getSiteUrl } from "@/lib/stripe/client";
import { getStripePriceId } from "@/lib/stripe/config";
import { PRODUCT } from "@/config/product";
import { trackServer } from "@/lib/analytics";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    trackServer("checkout_started", {
      user_id: user.id,
      product_key: PRODUCT.key,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/checkout]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
