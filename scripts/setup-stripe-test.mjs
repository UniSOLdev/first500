#!/usr/bin/env node
/**
 * Creates a Stripe TEST mode product + price for local development.
 * Requires STRIPE_SECRET_KEY (sk_test_...) in environment.
 *
 * Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-test.mjs
 */

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key?.startsWith("sk_test_")) {
  console.error("Set STRIPE_SECRET_KEY to a test secret key (sk_test_...)");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2026-08-26.dahlia" });

const product = await stripe.products.create({
  name: "FIRST $500 — 7-Day Challenge",
  description: "Test mode — 7-day local service business challenge",
  metadata: { product_key: "first_500_challenge", app: "first500" },
  default_price_data: {
    currency: "usd",
    unit_amount: 1700,
  },
});

console.log("\n✅ Test product created\n");
console.log("Add to .env.local:\n");
console.log(`STRIPE_PRICE_ID=${product.default_price}`);
console.log(`STRIPE_SECRET_KEY=${key}`);
console.log("\nThen run: stripe listen --forward-to localhost:3000/api/stripe/webhook");
console.log("Copy the whsec_... secret to STRIPE_WEBHOOK_SECRET\n");
