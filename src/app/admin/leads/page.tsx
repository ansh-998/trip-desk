// Lead list: search + filters by status, trip, owner, all read from the
// URL and applied server-side. The screen the team opens first every morning.
import { createClient } from '@/lib/supabase/server'
import { LeadTable } from '@/components/admin/LeadTable'
import { LeadFilters } from '@/components/admin/LeadFilters'

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; trip?: string; owner?: string }>
}) {
  const { q, status, trip, owner } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select('*, trips(id, name), profiles(id, full_name)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (trip) query = query.eq('trip_id', trip)
  if (owner === 'unassigned') query = query.is('owner_id', null)
  else if (owner) query = query.eq('owner_id', owner)
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`)

  const { data: leads } = await query
  const { data: trips } = await supabase.from('trips').select('id, name').order('name')
  const { data: owners } = await supabase.from('profiles').select('id, full_name').order('full_name')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leads</h1>
      <LeadFilters trips={trips ?? []} owners={owners ?? []} />
      <LeadTable leads={leads ?? []} />
    </div>
  )
}
