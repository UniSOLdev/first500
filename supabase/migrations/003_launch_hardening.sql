-- Launch hardening: webhook dedup, analytics events, AI usage tracking

-- Stripe webhook event deduplication
create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  processed_at timestamptz not null default now()
);

create index if not exists stripe_webhook_events_type_idx
  on public.stripe_webhook_events(event_type);

alter table public.stripe_webhook_events enable row level security;

-- Analytics events (internal funnel tracking)
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid references auth.users(id) on delete set null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_idx on public.analytics_events(event_name);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at);
create index if not exists analytics_events_user_id_idx on public.analytics_events(user_id);

alter table public.analytics_events enable row level security;

-- AI usage counter per user (server-managed)
create table if not exists public.ai_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  message_count int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.ai_usage enable row level security;

create policy "Users can view own ai usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);

-- Revoke public access to webhook/analytics tables (service role only)
revoke all on public.stripe_webhook_events from anon, authenticated;
revoke all on public.analytics_events from anon, authenticated;
revoke all on public.ai_usage from anon, authenticated;

grant select on public.ai_usage to authenticated;
