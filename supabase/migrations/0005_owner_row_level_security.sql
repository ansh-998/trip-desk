-- Migration 0005: Enforce Owner-Level Row-Level Security on leads

-- 1. Helper function to check the role of a given user
create or replace function public.get_user_role(user_id uuid)
returns text as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = user_id;
  return user_role;
end;
$$ language plpgsql security definer;

-- 2. Drop existing leads select/update/delete policies
drop policy if exists "team can view all leads" on public.leads;
drop policy if exists "team can update leads" on public.leads;
drop policy if exists "team can delete leads" on public.leads;
drop policy if exists "travellers can view own leads" on public.leads;

-- 3. Create fine-grained, owner-level policies

-- SELECT
create policy "leads_select_policy"
  on public.leads for select
  using (
    -- Managers/Leads see all leads
    public.get_user_role(auth.uid()) = 'lead'
    
    -- Associates see leads they own, or unassigned leads so they can claim them
    or (
      public.get_user_role(auth.uid()) = 'associate'
      and (owner_id = auth.uid() or owner_id is null)
    )
    
    -- Travellers see only their own leads
    or (
      public.get_user_role(auth.uid()) = 'traveller'
      and traveller_id = auth.uid()
    )
  );

-- UPDATE
create policy "leads_update_policy"
  on public.leads for update
  using (
    -- Managers/Leads can update all leads
    public.get_user_role(auth.uid()) = 'lead'
    
    -- Associates can update leads they own, or unassigned leads (to claim them)
    or (
      public.get_user_role(auth.uid()) = 'associate'
      and (owner_id = auth.uid() or owner_id is null)
    )
  )
  with check (
    public.get_user_role(auth.uid()) = 'lead'
    or (
      public.get_user_role(auth.uid()) = 'associate'
      and (owner_id = auth.uid() or owner_id is null)
    )
  );

-- DELETE
create policy "leads_delete_policy"
  on public.leads for delete
  using (
    -- Managers/Leads can delete any lead
    public.get_user_role(auth.uid()) = 'lead'
    
    -- Associates can only delete leads they own
    or (
      public.get_user_role(auth.uid()) = 'associate'
      and owner_id = auth.uid()
    )
  );
