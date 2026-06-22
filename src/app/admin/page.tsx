// Dashboard overview: total leads, count by pipeline stage, leads per trip.
import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/admin/DashboardStats'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('leads').select('status, trip_id, trips(name)')

  // Without generated Database types, the Supabase client can't tell this
  // is a many-to-one embed, so it types `trips` as an array defensively.
  // At runtime it's a single object (each lead has one trip), so we
  // normalise to a flat tripName here rather than fight the inferred type.
  const leads = (data ?? []).map((lead) => {
    const trip = Array.isArray(lead.trips) ? lead.trips[0] : lead.trips
    return {
      status: lead.status,
      trip_id: lead.trip_id,
      tripName: trip?.name ?? null,
    }
  })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-display font-bold text-ink tracking-tight">Morning glance</h1>
        <p className="text-ink/50 mt-1">Here is how the journeys are finding people today.</p>
      </div>
      <DashboardStats leads={leads} />
    </div>
  )
}
