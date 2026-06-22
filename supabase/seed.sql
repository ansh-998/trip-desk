-- Seed data: enough to demo the full pipeline on first load.
-- Run after the schema + RLS migrations, or paste into the Supabase SQL editor.

insert into trips (name, destination, start_date, end_date, price_inr, total_seats, status, description)
values
  ('Spiti in Winter', 'Spiti Valley, Himachal Pradesh', '2026-12-10', '2026-12-18', 42000, 12, 'open',
   'Frozen rivers, mud-brick villages, and slow mornings at altitude. No itinerary rush.'),
  ('Coffee Country', 'Coorg, Karnataka', '2026-09-05', '2026-09-09', 18500, 10, 'open',
   'Plantation walks, small-batch coffee, and quiet evenings with people who notice things.'),
  ('Northeast Backroads', 'Meghalaya', '2026-10-20', '2026-10-28', 35000, 8, 'open',
   'Living root bridges and villages most maps skip. Built for people who like to walk.'),
  ('Desert Light', 'Kutch, Gujarat', '2026-08-01', '2026-08-06', 22000, 12, 'closed',
   'White desert at dusk and a handicraft trail run by the artisans themselves.');

-- A handful of leads across the pipeline, against the trips above.
insert into leads (trip_id, name, phone, email, group_type, preferred_month, trip_feel, status)
select id, 'Ananya Rao', '9845011223', 'ananya.rao@example.com', 'friends', 'December',
       'Somewhere quiet where we are not checking phones every five minutes.', 'NEW'
from trips where name = 'Spiti in Winter';

insert into leads (trip_id, name, phone, email, group_type, preferred_month, trip_feel, status)
select id, 'Karan Mehta', '9900112233', 'karan.m@example.com', 'solo', 'September',
       'I want to actually talk to people, not just see places.', 'CONTACTED'
from trips where name = 'Coffee Country';

insert into leads (trip_id, name, phone, email, group_type, preferred_month, trip_feel, status)
select id, 'Priya & Dev', '9811122334', 'priya.dev@example.com', 'couple', 'October',
       'Something slow. Our last trip felt like a checklist.', 'QUALIFIED'
from trips where name = 'Northeast Backroads';

insert into leads (trip_id, name, phone, email, group_type, preferred_month, trip_feel, status)
select id, 'The Iyer Family', '9876543210', null, 'family', 'December',
       'Easy pace, our kids are 8 and 11.', 'VIBE_CHECK_SENT'
from trips where name = 'Spiti in Winter';
