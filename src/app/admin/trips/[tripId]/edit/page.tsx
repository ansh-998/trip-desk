import { createClient } from '@/lib/supabase/server'
import { TripForm } from '@/components/admin/TripForm'

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params
  const supabase = await createClient()
  const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit trip</h1>
      <TripForm trip={trip ?? undefined} />
    </div>
  )
}
