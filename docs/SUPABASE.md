# Supabase — FIRST $500

## Project

- **Name:** first500
- **Project ref:** `fnjcqlspebccknzshxfa`
- **Region:** us-east-1
- **Dashboard:** https://supabase.com/dashboard/project/fnjcqlspebccknzshxfa

## Migrations applied

1. `001_initial_schema` — profiles, entitlements, challenge_profiles, challenge_progress, ai_conversations, RLS
2. `002_harden_functions` — search_path + revoke public execute on trigger function

## Auth — disable email confirmation (required for launch)

In **Authentication → Providers → Email**:

- **Confirm email: OFF**

Why: Paid traffic needs instant signup → checkout. Confirmation emails hit Supabase's built-in SMTP rate limit (`email rate limit exceeded`) during testing and early launch. Stripe payment is the access gate.

## Auth URL configuration

In **Authentication → URL Configuration**:

**Site URL:**
```
https://first500-unisoldevs-projects.vercel.app
```

**Redirect URLs:**
```
https://first500-unisoldevs-projects.vercel.app/auth/callback
https://first500-unisoldevs-projects.vercel.app/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/reset-password
```

## Vercel environment variables

Add these in Vercel → first500 → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://fnjcqlspebccknzshxfa.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key from dashboard>
SUPABASE_SERVICE_ROLE_KEY=<service role key from dashboard — keep secret>
NEXT_PUBLIC_SITE_URL=https://first500-unisoldevs-projects.vercel.app
```

Get keys: Supabase Dashboard → Project Settings → API

Use the **publishable** key (`sb_publishable_...`) for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

The **service role** key is required for Stripe webhooks to grant entitlements.
