# FIRST $500 — Founder Operations

What you need to do when customers start purchasing. **No manual fulfillment required** for normal orders.

## What happens automatically

When a customer pays $17:

1. Stripe webhook fires → entitlement granted in database
2. Customer redirected to dashboard (via success page poll)
3. Welcome email sent (if Resend configured)
4. All 7 challenge days unlocked progressively
5. AI coach available (100 messages included)

**You do not need to manually unlock accounts.**

## Daily checks (5 minutes)

1. Open **Admin**: https://first500-fawn.vercel.app/admin
   - Paid customers count
   - Funnel events (signups, checkout starts, purchases)
   - Recent customer list

2. Check **Stripe Dashboard** → Payments for failed/chargeback alerts

3. Check **Vercel** → Runtime logs if customers report issues

## When a customer emails support

### "I paid but I'm locked out"

1. Ask for their signup email
2. Check Stripe Dashboard → search email → confirm payment succeeded
3. Check Supabase → `entitlements` table → look for `user_id` + `status=active`
4. If paid in Stripe but no entitlement:
   - Webhook may have failed — check Vercel logs for `/api/stripe/webhook`
   - Verify `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel
   - Re-send webhook from Stripe Dashboard → Events → select event → "Resend"
5. If still stuck, manually insert entitlement in Supabase (service role) or grant via SQL:

```sql
-- Only if Stripe shows paid and no active entitlement exists
insert into entitlements (user_id, product_key, status, purchased_at)
values ('USER_UUID_HERE', 'first_500_challenge', 'active', now());
```

### "Refund request"

1. Process refund in Stripe Dashboard
2. Webhook `charge.refunded` automatically sets entitlement `status=refunded`
3. Reply confirming access revoked

### "AI coach not working"

1. Confirm `OPENAI_API_KEY` is set in Vercel production
2. Customer may have hit 100-message limit — check `ai_usage` table
3. To reset: `update ai_usage set message_count = 0 where user_id = 'UUID';`

### "Can't sign up / login"

1. Verify Supabase Auth is up: https://status.supabase.com
2. Confirm env vars in Vercel (see LAUNCH-CHECKLIST.md)
3. Check Supabase Auth URL config matches production domain

## Environment variable changes

After changing any Vercel env var → **redeploy production**.

Critical vars:
- `STRIPE_*` — payments
- `SUPABASE_SERVICE_ROLE_KEY` — webhooks
- `OPENAI_API_KEY` — AI coach
- `ADMIN_EMAILS` — your admin access

## Running ads

**Ready when:**
- [ ] All items in LAUNCH-CHECKLIST.md "Founder must do" are checked
- [ ] One live $17 test purchase completed end-to-end
- [ ] `/admin` shows the test customer

**Recommended ad URL:**
```
https://first500-fawn.vercel.app/signup?next=/checkout
```

**UTM tracking:** Append standard UTM params — internal analytics tracks `landing_view` and `cta_click` regardless.

## Scaling notes

- AI cost: ~100 messages × $17 customers — monitor OpenAI usage dashboard
- Supabase free tier handles early volume; watch connection limits
- Stripe handles all payment PCI compliance

## Escalation

If webhook failures spike:
1. Stripe → Developers → Webhooks → check delivery failures
2. Vercel → Logs → filter `/api/stripe/webhook`
3. Common fix: rotate `STRIPE_WEBHOOK_SECRET` after recreating endpoint

Support email (configurable): set `NEXT_PUBLIC_SUPPORT_EMAIL` in Vercel.
