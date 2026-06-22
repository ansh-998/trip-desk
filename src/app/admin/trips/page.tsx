// Trips CMS: list with edit links, and the entry point to creating a new trip.
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminTripsPage() {
  const supabase = await createClient()
  const { data: trips } = await supabase.from('trips').select('*').order('start_date')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trips</h1>
        <Link href="/admin/trips/new" className="bg-rust text-cream rounded px-3 py-2">
          New trip
        </Link>
      </div>
      {/* TODO: table of trips - name, dates, seats booked / total, status toggle */}
      <ul className="divide-y divide-sand/40">
        {trips?.map((trip) => (
          <li key={trip.id} className="py-3 flex justify-between">
            <span>{trip.name}</span>
            <Link href={`/admin/trips/${trip.id}/edit`} className="text-rust text-sm">
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
