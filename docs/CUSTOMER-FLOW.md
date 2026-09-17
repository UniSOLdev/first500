# FIRST $500 — Customer Flow

## Funnel overview

```
Ad / Social / Direct
        ↓
Landing Page (/)
        ↓ CTA click
Signup (/signup?next=/checkout)
        ↓ account created
Checkout (/checkout)
        ↓ auto-redirect
Stripe Checkout ($17 one-time)
        ↓ payment success
Success page (/checkout/success)
        ↓ webhook grants entitlement (polls ~2–60s)
Dashboard (/dashboard)
        ↓ optional
Onboarding (/onboarding) — if profile incomplete
        ↓
Day 1 (/challenge/day-1)
        ↓
Days 2–7 → Complete (/complete)
```

## Step-by-step

### 1. Landing page

- URL: `https://first500-fawn.vercel.app`
- Events tracked: `landing_view`, `cta_click`
- Mobile sticky CTA at bottom

### 2. Signup

- URL: `/signup?next=/checkout`
- Creates Supabase auth account + profile row (via DB trigger)
- Redirects to `/checkout` on success
- Events: `signup_started`, `signup_completed`

### 3. Checkout

- Requires logged-in user (middleware redirects to login if not)
- Auto-starts Stripe Checkout session via `/api/stripe/checkout`
- Blocks users who already have active entitlement → `/dashboard`
- Event: `checkout_started`

### 4. Stripe payment

- Mode: `payment` (one-time)
- Success URL: `/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `/checkout/canceled`

### 5. Webhook (automatic)

- Endpoint: `/api/stripe/webhook`
- On `checkout.session.completed` + `payment_status=paid`:
  1. Deduplicate by Stripe event ID
  2. Insert/update `entitlements` row (`status=active`)
  3. Fire `purchase_completed` analytics event
  4. Send welcome email (if `RESEND_API_KEY` set)

### 6. Success page

- Polls `/api/entitlements/status` every 2 seconds (max 60s)
- On active entitlement → redirect `/dashboard`
- Timeout shows refresh button + support email

### 7. Dashboard & challenge

- App routes require active entitlement (server-side)
- Day 1 unlocked after purchase; subsequent days unlock on completion
- Event: `dashboard_view`, `day_1_started`, `day_completed`, `challenge_completed`

## Failure paths

| Scenario | User sees |
|----------|-----------|
| Checkout canceled | `/checkout/canceled` with retry link |
| Stripe/checkout API error | Friendly message + support email |
| Webhook delayed | Success page keeps polling, then manual refresh |
| Already paid | Checkout API returns 409 → dashboard |
| AI limit reached | Coach shows limit message (100 messages default) |

## Security notes

- Entitlement is **never** granted from success URL alone — only via verified webhook
- Payment flags are never trusted from client
- Admin routes require `ADMIN_EMAILS` match (no entitlement required)
