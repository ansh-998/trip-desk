-- Row Level Security: the public form may only INSERT leads, never read them.
-- The team (any authenticated user) can read/write everything for now.
-- Stretch goal: scope leads to owner_id = auth.uid() once role-based access matters.

alter table profiles enable row level security;
alter table trips enable row level security;
alter table leads enable row level security;
alter table call_logs enable row level security;

-- Profiles: a team member can see all teammates (needed for the owner dropdown)
create policy "team can view profiles"
  on profiles for select
  using (auth.role() = 'authenticated');

create policy "user can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Trips: anyone can read OPEN trips. The team can read everything and write.
create policy "public can view open trips"
  on trips for select
  using (status = 'open');

create policy "team can view all trips"
  on trips for select
  using (auth.role() = 'authenticated');

create policy "team can manage trips"
  on trips for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Leads: anonymous travellers can INSERT only. They can never SELECT, UPDATE or DELETE.
create policy "anyone can submit a lead"
  on leads for insert
  with check (true);

create policy "team can view all leads"
  on leads for select
  using (auth.role() = 'authenticated');

create policy "team can update leads"
  on leads for update
  using (auth.role() = 'authenticated');

create policy "team can delete leads"
  on leads for delete
  using (auth.role() = 'authenticated');

-- Call logs: team only, both ways.
create policy "team can view call logs"
  on call_logs for select
  using (auth.role() = 'authenticated');

create policy "team can add call logs"
  on call_logs for insert
  with check (auth.role() = 'authenticated');
