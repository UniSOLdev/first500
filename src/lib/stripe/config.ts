export function getStripePriceId(): string {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error("Missing STRIPE_PRICE_ID");
  }
  return priceId;
}
