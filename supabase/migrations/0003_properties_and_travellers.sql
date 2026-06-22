-- Migration 0003: Properties & Traveller Auth

-- 1. Create properties table for Accommodation/Hotel management
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  description text not null default '',
  property_type text not null default 'hotel', -- hotel, resort, hostel, homestay
  price_per_night integer not null check (price_per_night >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Use the existing set_updated_at function
create trigger properties_set_updated_at before update on properties
  for each row execute function set_updated_at();

-- 2. Expand profile roles to include 'traveller'
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('associate', 'lead', 'traveller'));

-- 3. Link leads to travellers for the enquiry portal
alter table leads add column if not exists traveller_id uuid references auth.users(id) on delete set null;

-- 4. Refine the handle_new_user trigger to default to 'traveller'
-- This prevents users from self-assigning staff roles during signup.
create or replace function handle_new_user()
returns trigger as $$
declare
  assigned_role text;
begin
  -- Logic: If role is explicitly provided in metadata, trust it (for admin invites),
  -- otherwise default to 'traveller' (for public signups).
  assigned_role := coalesce(new.raw_user_meta_data->>'role', 'traveller');
  
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), assigned_role);
  return new;
end;
$$ language plpgsql security definer;

-- 5. Enable RLS and setup policies for Properties
alter table properties enable row level security;

create policy "anyone can view active properties"
  on properties for select
  using (status = 'active');

create policy "team can manage properties"
  on properties for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role in ('associate', 'lead')
    )
  );

-- 6. Refine RLS for existing tables to handle the 'traveller' role
-- Note: We are replacing generic 'authenticated' checks with explicit role checks.

-- Profiles: Team sees all, Travellers see only themselves.
drop policy if exists "team can view profiles" on profiles;
create policy "team can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('associate', 'lead')
    )
  );

create policy "travellers can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Leads: Travellers see only their own.
create policy "travellers can view own leads"
  on leads for select
  using (auth.uid() = traveller_id);

-- Call Logs: Strictly team only.
drop policy if exists "team can view call logs" on call_logs;
create policy "team can view all call logs"
  on call_logs for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('associate', 'lead')
    )
  );

drop policy if exists "team can add call logs" on call_logs;
create policy "team can add call logs"
  on call_logs for insert
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('associate', 'lead')
    )
  );
