-- Migration 0004: Secure RLS Policies using is_team_member helper function

-- 1. Helper function to check if a user is a staff/team member (associate or lead)
-- Marked as security definer to bypass RLS checks on the profiles table
create or replace function public.is_team_member(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role in ('associate', 'lead')
  );
end;
$$ language plpgsql security definer;

-- 2. Drop existing insecure policies checking only 'authenticated'
drop policy if exists "team can view all trips" on public.trips;
drop policy if exists "team can manage trips" on public.trips;
drop policy if exists "team can view all leads" on public.leads;
drop policy if exists "team can update leads" on public.leads;
drop policy if exists "team can delete leads" on public.leads;

-- Also drop other subquery-based team policies to consolidate them
drop policy if exists "team can view all profiles" on public.profiles;
drop policy if exists "team can view all call logs" on public.call_logs;
drop policy if exists "team can add call logs" on public.call_logs;
drop policy if exists "team can manage properties" on public.properties;


-- 3. Create secure policies checking for 'associate' or 'lead' role via helper function

-- TRIPS Table
create policy "team can view all trips"
  on public.trips for select
  using (public.is_team_member(auth.uid()));

create policy "team can manage trips"
  on public.trips for all
  using (public.is_team_member(auth.uid()))
  with check (public.is_team_member(auth.uid()));

-- LEADS Table
create policy "team can view all leads"
  on public.leads for select
  using (public.is_team_member(auth.uid()));

create policy "team can update leads"
  on public.leads for update
  using (public.is_team_member(auth.uid()));

create policy "team can delete leads"
  on public.leads for delete
  using (public.is_team_member(auth.uid()));

-- PROFILES Table
create policy "team can view all profiles"
  on public.profiles for select
  using (public.is_team_member(auth.uid()));

-- CALL_LOGS Table
create policy "team can view all call logs"
  on public.call_logs for select
  using (public.is_team_member(auth.uid()));

create policy "team can add call logs"
  on public.call_logs for insert
  with check (public.is_team_member(auth.uid()));

-- PROPERTIES Table
create policy "team can manage properties"
  on public.properties for all
  using (public.is_team_member(auth.uid()))
  with check (public.is_team_member(auth.uid()));
