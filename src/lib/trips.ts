// Data-fetching helpers for trips.
// Both functions fall back to local demo data when Supabase isn't configured,
// so the public site is explorable without a database connection.
import { createClient } from '@/lib/supabase/server'
import { DEMO_TRIPS } from '@/lib/demo-trips'
import type { Trip } from '@/types'

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function getOpenTrips(): Promise<Trip[]> {
  if (!hasSupabaseConfig()) {
    return DEMO_TRIPS.filter((t) => t.status === 'open')
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('status', 'open')
      .order('start_date', { ascending: true })

    if (error || !data?.length) {
      return DEMO_TRIPS.filter((t) => t.status === 'open')
    }
    return data as Trip[]
  } catch {
    return DEMO_TRIPS.filter((t) => t.status === 'open')
  }
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  if (!hasSupabaseConfig()) {
    return DEMO_TRIPS.find((t) => t.id === tripId) ?? null
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single()

    if (error || !data) {
      return DEMO_TRIPS.find((t) => t.id === tripId) ?? null
    }
    return data as Trip
  } catch {
    return DEMO_TRIPS.find((t) => t.id === tripId) ?? null
  }
}
