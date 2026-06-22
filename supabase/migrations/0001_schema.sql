-- Nomichi Trip Desk: core schema
-- Run via the Supabase SQL editor, or `supabase db push`.

create extension if not exists "pgcrypto";

-- Team members (sales associates, leads owners). One row per auth user.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'associate' check (role in ('associate', 'lead')),
  created_at timestamptz not null default now()
);

-- Trips are content. Created and edited by the team, never by travellers.
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  price_inr integer not null check (price_inr > 0), -- in rupees, GST included
  total_seats integer not null check (total_seats > 0),
  seats_booked integer not null default 0,
  status text not null default 'open' check (status in ('open', 'closed')),
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Leads come from the public enquiry form, or are entered manually by the team.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  group_type text not null check (group_type in ('solo', 'friends', 'couple', 'family')),
  preferred_month text,
  trip_feel text, -- "what are you hoping this trip feels like"
  status text not null default 'NEW' check (
    status in ('NEW', 'CONTACTED', 'QUALIFIED', 'VIBE_CHECK_SENT', 'CONFIRMED', 'NOT_A_FIT')
  ),
  owner_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Call log / touchpoints against a lead. Append-only by design.
create table if not exists call_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  note text not null,
  next_action text,
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_trip_id on leads(trip_id);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_owner_id on leads(owner_id);
create index if not exists idx_call_logs_lead_id on call_logs(lead_id);

-- Keep updated_at fresh on trips/leads
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trips_set_updated_at before update on trips
  for each row execute function set_updated_at();

create trigger leads_set_updated_at before update on leads
  for each row execute function set_updated_at();

-- Auto-create a profile row when a team member signs up via Supabase Auth
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
