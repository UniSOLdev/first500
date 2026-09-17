import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import {
  grantEntitlementFromCheckout,
  recordStripeWebhookEvent,
  revokeEntitlement,
} from "@/lib/entitlements";
import { sendWelcomeEmail } from "@/lib/email";
import { PRODUCT } from "@/config/product";
import { trackServer } from "@/lib/analytics";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function getUserEmail(userId: string): Promise<{
  email: string;
  fullName: string | null;
} | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle();
    if (!data?.email) return null;
    return { email: data.email, fullName: data.full_name };
  } catch {
    return null;
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const customerId =
    typeof charge.customer === "string" ? charge.customer : charge.customer?.id;

  if (customerId) {
    await revokeEntitlement({ stripeCustomerId: customerId });
    return;
  }

  // Fallback: lookup checkout session from payment intent
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (paymentIntentId) {
    const stripe = getStripe();
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
      limit: 1,
    });
    const session = sessions.data[0];
    const userId =
      session?.metadata?.user_id ?? session?.client_reference_id ?? null;
    if (userId) {
      await revokeEntitlement({ userId });
    }
  }
}

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

  try {
    const isNew = await recordStripeWebhookEvent(event.id, event.type);
    if (!isNew) {
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch (error) {
    console.error("[stripe/webhook] Dedup check failed — continuing:", error);
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
      return NextResponse.json(
        { error: "Missing user id on checkout session" },
        { status: 500 }
      );
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

      trackServer(
        "purchase_completed",
        {
          product_key: productKey,
          session_id: session.id,
          amount: session.amount_total ?? 0,
        },
        userId
      );

      const profile = await getUserEmail(userId);
      if (profile) {
        void sendWelcomeEmail({
          to: profile.email,
          fullName: profile.fullName,
        });
      }
    } catch (error) {
      console.error("[stripe/webhook] Failed to grant entitlement", error);
      return NextResponse.json(
        { error: "Failed to process checkout" },
        { status: 500 }
      );
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    try {
      await handleRefund(charge);
    } catch (error) {
      console.error("[stripe/webhook] Failed to revoke entitlement", error);
      return NextResponse.json({ error: "Revoke failed" }, { status: 500 });
    }
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId =
      session.metadata?.user_id ?? session.client_reference_id ?? null;
    if (userId) {
      try {
        await revokeEntitlement({ userId });
      } catch (error) {
        console.error("[stripe/webhook] Failed to revoke after async failure", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
