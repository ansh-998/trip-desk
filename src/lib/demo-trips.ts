import type { Trip } from '@/types'

// Fallback trips so the public site works before Supabase is configured.
export const DEMO_TRIPS: Trip[] = [
  {
    id: 'demo-spiti',
    name: 'Spiti in Winter',
    destination: 'Spiti Valley, Himachal Pradesh',
    start_date: '2026-12-10',
    end_date: '2026-12-18',
    price_inr: 42000,
    total_seats: 12,
    seats_booked: 9,
    status: 'open',
    description:
      'Frozen rivers, mud-brick villages, and slow mornings at altitude. No itinerary rush. We walk the same paths local monks have walked for centuries, stopping when something catches our eye.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-coorg',
    name: 'Coffee Country',
    destination: 'Coorg, Karnataka',
    start_date: '2026-09-05',
    end_date: '2026-09-09',
    price_inr: 18500,
    total_seats: 10,
    seats_booked: 4,
    status: 'open',
    description:
      'Plantation walks, small-batch coffee, and quiet evenings with people who notice things. Mornings start with mist over the hills; afternoons are unhurried.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-meghalaya',
    name: 'Northeast Backroads',
    destination: 'Meghalaya',
    start_date: '2026-10-20',
    end_date: '2026-10-28',
    price_inr: 35000,
    total_seats: 8,
    seats_booked: 6,
    status: 'open',
    description:
      'Living root bridges and villages most maps skip. Built for people who like to walk. Rainforest trails, local guides, and nights in homestays that feel like home.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-kutch',
    name: 'Desert Light',
    destination: 'Kutch, Gujarat',
    start_date: '2026-08-01',
    end_date: '2026-08-06',
    price_inr: 22000,
    total_seats: 12,
    seats_booked: 12,
    status: 'closed',
    description:
      'White desert at dusk and a handicraft trail run by the artisans themselves. Golden hour stretches forever out here.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
