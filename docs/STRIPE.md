# Stripe — FIRST $500

## Live product (created)

| Item | Value |
|------|-------|
| Product ID | `prod_VH1VHP9PCGdweq` |
| Price ID | `price_1UGTSJKQggiVQDOXw3Ay2w2I` |
| Amount | $17.00 USD one-time |
| Webhook ID | `we_1UGTSRKQggiVQDOXgcsS6gHb` |
| Webhook URL | `https://first500-fawn.vercel.app/api/stripe/webhook` |

## Vercel environment variables

Add these in **Production** (Stripe Dashboard → Developers → API keys for secret/publishable):

```
STRIPE_PRICE_ID=price_1UGTSJKQggiVQDOXw3Ay2w2I
STRIPE_SECRET_KEY=sk_live_...          # from Stripe Dashboard — never commit
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # from Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...          # from webhook we_1UGTSRKQggiVQDOXgcsS6gHb → Signing secret
```

After adding: **Redeploy** production on Vercel.

Also required for checkout to complete end-to-end:

```
SUPABASE_SERVICE_ROLE_KEY=...   # webhook entitlement writes
```

## Webhook events

The production endpoint listens for:

- `checkout.session.completed` — grants entitlement
- `charge.refunded` — revokes access
- `checkout.session.async_payment_failed` — revokes access

## Architecture

```
POST /api/stripe/checkout     → creates Checkout Session (auth required)
POST /api/stripe/webhook      → verifies signature, grants/revokes entitlement
POST /api/stripe/verify-session → fallback if webhook delayed (verifies with Stripe API)
GET  /api/entitlements/status → client polls after payment
```

Entitlements are **never** granted from the success URL alone. The verify-session endpoint confirms payment with Stripe server-side before granting.

## Test mode (local dev)

Use Stripe test keys in `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...   # test mode price
STRIPE_WEBHOOK_SECRET=whsec_...  # from `stripe listen`
```

Forward webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

## Smoke test checklist

1. Signup → `/checkout` → Stripe → pay $17
2. Land on `/checkout/success` → auto-redirect `/dashboard` within ~30s
3. Check `/admin` — customer appears with active entitlement
4. Stripe Dashboard → Webhooks → confirm `checkout.session.completed` delivered (200)
5. Refund in Stripe → confirm access revoked on next login

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Checkout temporarily unavailable" | Add `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` to Vercel, redeploy |
| Paid but locked out | Check webhook logs; verify `SUPABASE_SERVICE_ROLE_KEY`; hit refresh on success page |
| Webhook 400 invalid signature | `STRIPE_WEBHOOK_SECRET` mismatch — copy from Stripe webhook details |
| Duplicate charges | Checkout blocks already-entitled users (409 → dashboard) |
