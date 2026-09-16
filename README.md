# FIRST $500 — 7-Day Local Service Challenge

A paid 7-day challenge SaaS that helps beginners build a local service business: offer, pricing, brand, outreach, and customer acquisition system.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (Auth + Postgres + RLS), Stripe Checkout, OpenAI Responses API.

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in .env.local (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | e.g. `http://localhost:3000` or production URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (webhooks + admin only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook endpoint |
| `STRIPE_PRICE_ID` | One-time $17 price ID |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | Default: `gpt-4o-mini` |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `DEV_BYPASS_ENTITLEMENT` | `true` in local dev only — skips paid check |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration in **SQL Editor**:

   ```bash
   # File: supabase/migrations/001_initial_schema.sql
   ```

3. **Authentication → URL Configuration:**
   - Site URL: `https://your-domain.com` (or `http://localhost:3000`)
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback`
     - `http://localhost:3000/reset-password`
     - `https://your-domain.com/reset-password`

## Stripe setup

1. Create product **FIRST $500 — 7-Day Challenge** with a **one-time $17** price.
2. Copy the Price ID → `STRIPE_PRICE_ID`.
3. Add webhook endpoint:

   ```
   https://your-domain.com/api/stripe/webhook
   ```

   Events: `checkout.session.completed`

4. Local testing:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

   Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`.

## OpenAI setup

1. Create an API key at [platform.openai.com](https://platform.openai.com).
2. Set `OPENAI_API_KEY` and optionally `OPENAI_MODEL=gpt-4o-mini`.

## Customer flow

```
Landing → Sign up → Checkout ($17) → Stripe webhook grants entitlement
→ Success page polls → Onboarding → Dashboard → Days 1–7 → Complete
```

Entitlement is granted **only** via webhook — never from the success URL alone.

## Change the launch price

1. Update display copy in `src/config/product.ts` (`launchPriceUsd`, `displayPrice`, CTAs).
2. Create a new Stripe Price and update `STRIPE_PRICE_ID`.

## Edit challenge content

All day content lives in:

- `src/content/challenge.ts` — lessons, tasks, deliverables
- `src/content/resources.ts` — copyable scripts and templates

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
npx tsc --noEmit # TypeScript check
```

## Deploy to Vercel

1. Push to GitHub and import in Vercel.
2. Add all environment variables from `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Configure Stripe webhook to production URL.
5. Configure Supabase redirect URLs for production.

## Admin

Set `ADMIN_EMAILS=you@example.com` and visit `/admin` for basic stats.

## Development bypass

For local preview without Stripe/Supabase:

```bash
DEV_BYPASS_ENTITLEMENT=true
```

This only works when `NODE_ENV=development`. Never set in production.
