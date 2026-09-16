import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { grantEntitlementFromCheckout } from "@/lib/entitlements";
import { PRODUCT } from "@/config/product";
import { trackServer } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe/webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe/webhook] Signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const userId =
      session.metadata?.user_id ?? session.client_reference_id ?? null;
    const productKey = session.metadata?.product_key ?? PRODUCT.key;

    if (!userId) {
      console.error("[stripe/webhook] Missing user id on session", session.id);
      return NextResponse.json({ received: true });
    }

    const stripeCustomerId =
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null);

    try {
      await grantEntitlementFromCheckout({
        userId,
        productKey,
        stripeCustomerId,
        stripeCheckoutSessionId: session.id,
        purchasedAt: new Date(session.created * 1000).toISOString(),
      });

      trackServer("checkout_completed", {
        user_id: userId,
        product_key: productKey,
        session_id: session.id,
      });
    } catch (error) {
      console.error("[stripe/webhook] Failed to grant entitlement", error);
      return NextResponse.json(
        { error: "Failed to process checkout" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
