# FIRST $500 — Launch Checklist

Use this before sending paid traffic.

## ✅ Done in code (deployed)

- [x] Signup/login/checkout auth flow with graceful errors
- [x] Supabase production fallbacks for public keys
- [x] Stripe checkout → webhook → entitlement grant
- [x] Webhook deduplication + refund revoke handler
- [x] Success page polls entitlement → dashboard
- [x] AI coach: 100 messages/customer (configurable via `AI_MESSAGE_LIMIT`)
- [x] Internal funnel analytics + `/admin` founder view
- [x] Support email throughout site (`NEXT_PUBLIC_SUPPORT_EMAIL`)
- [x] Founder credibility section on landing page
- [x] Legal pages linked in footer

## 🔴 Founder must do before running ads

### 1. Vercel environment variables (Production)

Add in [Vercel → first500 → Settings → Environment Variables](https://vercel.com/unisoldevs-projects/first500/settings/environment-variables):

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://first500-fawn.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | `https://fnjcqlspebccknzshxfa.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Yes** | From Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Webhooks + admin. **Never expose client-side.** |
| `STRIPE_SECRET_KEY` | **Yes** | Stripe Dashboard → Developers → API keys (live) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Yes** | Live publishable key |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | From webhook endpoint (see below) |
| `STRIPE_PRICE_ID` | **Yes** | Live $17 one-time Price ID |
| `OPENAI_API_KEY` | **Yes** | For AI coach |
| `ADMIN_EMAILS` | **Yes** | e.g. `claytonreidd@gmail.com` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | **Yes** | e.g. `claytonreidd@gmail.com` |
| `AI_MESSAGE_LIMIT` | Optional | Default `100` |
| `RESEND_API_KEY` | Optional | Welcome emails (flow works without) |
| `EMAIL_FROM` | Optional | e.g. `FIRST $500 <onboarding@yourdomain.com>` |

After adding vars: **Redeploy** production (or push any commit).

### 2. Stripe (live mode) — product & webhook created ✅

Stripe live resources are configured. Add to Vercel:

| Variable | Value |
|----------|-------|
| `STRIPE_PRICE_ID` | `price_1UGTSJKQggiVQDOXw3Ay2w2I` |
| `STRIPE_SECRET_KEY` | `sk_live_...` from [Stripe API keys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` from same page |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from webhook `we_1UGTSRKQggiVQDOXgcsS6gHb` |

Webhook URL (already registered): `https://first500-fawn.vercel.app/api/stripe/webhook`

See `docs/STRIPE.md` for full details.

5. Run one **live test purchase** with a real card, then refund yourself

### 3. Supabase Auth — **disable email confirmation** (critical for ads)

In [Supabase → Authentication → Providers → Email](https://supabase.com/dashboard/project/fnjcqlspebccknzshxfa/auth/providers):

1. **Turn OFF "Confirm email"** — customers must reach checkout immediately after signup
2. Without this, Supabase sends a confirmation email on every signup and hits **email rate limits** quickly (`email rate limit exceeded`)
3. Payment via Stripe is your gate — email confirmation adds friction and breaks the ad funnel

Optional for scale: configure **custom SMTP** (Resend) under Authentication → Email Templates → SMTP Settings for higher send limits on password resets.

### 4. Supabase Auth URLs

In [Supabase → Authentication → URL Configuration](https://supabase.com/dashboard/project/fnjcqlspebccknzshxfa/auth/url-configuration):

- **Site URL:** `https://first500-fawn.vercel.app`
- **Redirect URLs:**
  - `https://first500-fawn.vercel.app/auth/callback`
  - `https://first500-fawn.vercel.app/reset-password`

### 5. Smoke test (15 min)

1. Incognito → landing page → CTA → signup → checkout → pay $17
2. Confirm redirect to dashboard within ~30 seconds
3. Start Day 1, send one AI coach message
4. Log out → log back in → access persists
5. Visit `/admin` (must be in `ADMIN_EMAILS`)

### 6. Optional before scaling ads

- [ ] Connect custom domain to Vercel
- [ ] Set up Resend for welcome emails
- [ ] Add real proof screenshots to founder section placeholders
- [ ] Connect PostHog or Vercel Analytics for richer reporting
- [ ] Set up Stripe tax if required for your jurisdiction

## Ad funnel URL

Send traffic to: **https://first500-fawn.vercel.app/signup?next=/checkout**

Or the homepage CTA — all buttons route through signup → checkout.

## Support

Default support email: `support@first500.app` (override with `NEXT_PUBLIC_SUPPORT_EMAIL`).

## Admin dashboard

https://first500-fawn.vercel.app/admin

Shows funnel counts, customers, revenue estimate. Requires `ADMIN_EMAILS` match.
