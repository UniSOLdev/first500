-- FIRST $500 initial schema

create extension if not exists "pgcrypto";

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles(email);

-- Entitlements
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null,
  status text not null default 'inactive' check (status in ('active', 'inactive', 'refunded')),
  stripe_customer_id text,
  stripe_checkout_session_id text,
  purchased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index entitlements_user_product_active_idx
  on public.entitlements(user_id, product_key)
  where status = 'active';

create unique index entitlements_stripe_session_idx
  on public.entitlements(stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create index entitlements_user_id_idx on public.entitlements(user_id);
create index entitlements_status_idx on public.entitlements(status);

-- Challenge profiles (onboarding)
create table public.challenge_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  selected_service text,
  city_or_market text,
  starting_budget text,
  experience_level text,
  available_hours text,
  primary_goal text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index challenge_profiles_user_id_idx on public.challenge_profiles(user_id);

-- Challenge progress
create table public.challenge_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_number int not null check (day_number between 1 and 7),
  status text not null default 'locked' check (status in ('locked', 'available', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  responses jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_number)
);

create index challenge_progress_user_id_idx on public.challenge_progress(user_id);
create index challenge_progress_day_number_idx on public.challenge_progress(day_number);

-- AI conversations
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index ai_conversations_user_id_idx on public.ai_conversations(user_id);
create index ai_conversations_created_at_idx on public.ai_conversations(created_at);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger entitlements_updated_at before update on public.entitlements
  for each row execute function public.set_updated_at();

create trigger challenge_profiles_updated_at before update on public.challenge_profiles
  for each row execute function public.set_updated_at();

create trigger challenge_progress_updated_at before update on public.challenge_progress
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.challenge_profiles enable row level security;
alter table public.challenge_progress enable row level security;
alter table public.ai_conversations enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Entitlements: read-only for users (writes via service role webhook)
create policy "Users can view own entitlements"
  on public.entitlements for select
  using (auth.uid() = user_id);

-- Challenge profiles policies
create policy "Users can view own challenge profile"
  on public.challenge_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own challenge profile"
  on public.challenge_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own challenge profile"
  on public.challenge_profiles for update
  using (auth.uid() = user_id);

-- Challenge progress policies
create policy "Users can view own progress"
  on public.challenge_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.challenge_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.challenge_progress for update
  using (auth.uid() = user_id);

-- AI conversations policies
create policy "Users can view own ai conversations"
  on public.ai_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai conversations"
  on public.ai_conversations for insert
  with check (auth.uid() = user_id);
