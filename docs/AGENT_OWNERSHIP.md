# Agent File Ownership

Lead/Integrator owns: `src/app/layout.tsx`, `src/app/(app)/layout.tsx`, integration wiring, QA, README, git.

## Agent 2 — Frontend/Conversion
- `src/app/page.tsx`
- `src/components/landing/**`
- `src/components/layout/marketing-nav.tsx`, `footer.tsx`, `mobile-cta.tsx`
- `src/components/layout/app-shell.tsx`, `app-nav.tsx`
- `src/components/challenge/progress-ring.tsx`, `day-timeline.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/app/disclaimer/page.tsx`
- `src/app/opengraph-image.tsx`

## Agent 3 — Supabase/Auth
- `supabase/migrations/**`
- `src/lib/supabase/**`, `src/lib/auth/**`, `src/middleware.ts`
- `src/app/(auth)/**`
- `src/app/(app)/onboarding/**`
- `src/app/(app)/settings/**`
- `src/lib/challenge/queries.ts`
- `src/app/(app)/challenge/actions.ts`
- `src/app/(app)/admin/page.tsx`

## Agent 4 — Stripe/Entitlements
- `src/lib/stripe/**`, `src/lib/entitlements.ts`
- `src/app/api/stripe/**`
- `src/app/api/entitlements/**`
- `src/app/checkout/**`

## Agent 5 — Challenge Product
- `src/content/challenge.ts`, `src/content/resources.ts`
- `src/app/(app)/resources/**`
- `src/app/(app)/complete/**`
- `src/app/(app)/challenge/[day]/**`
- `src/components/challenge/day-*.tsx`, `offer-builder.tsx`, `pricing-builder.tsx`, etc.
- `src/components/challenge/challenge-day-layout.tsx`, `copy-button.tsx`

## Agent 6 — OpenAI Coach
- `src/lib/openai/**`, `src/lib/ai/**`
- `src/app/api/ai/**`
- `src/components/coach/**`
