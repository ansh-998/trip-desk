'use server'

// Server actions for the trips CMS.
// Called directly from TripForm (a client component) — no separate API route
// needed since these mutations are admin-only and carry no sensitive logic.
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { tripSchema, type TripInput } from '@/lib/validations/trip'

type ActionResult = { success: true; tripId?: string } | { success: false; error: string }

export async function createTrip(input: TripInput): Promise<ActionResult> {
  // Re-validate server-side. The client already validated, but never trust the client alone.
  const parsed = tripSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid trip details' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trips')
    .insert({
      name: parsed.data.name,
      destination: parsed.data.destination,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      price_inr: parsed.data.priceInr,
      total_seats: parsed.data.totalSeats,
      status: parsed.data.status,
      description: parsed.data.description,
      cover_image: parsed.data.coverImage || null,
      gallery_images: parsed.data.galleryImages
        ? parsed.data.galleryImages.split(',').map((u) => u.trim()).filter(Boolean)
        : null,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/trips')
  revalidatePath('/')
  return { success: true, tripId: data.id }
}

export async function updateTrip(tripId: string, input: TripInput): Promise<ActionResult> {
  const parsed = tripSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid trip details' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('trips')
    .update({
      name: parsed.data.name,
      destination: parsed.data.destination,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      price_inr: parsed.data.priceInr,
      total_seats: parsed.data.totalSeats,
      status: parsed.data.status,
      description: parsed.data.description,
      cover_image: parsed.data.coverImage || null,
      gallery_images: parsed.data.galleryImages
        ? parsed.data.galleryImages.split(',').map((u) => u.trim()).filter(Boolean)
        : null,
    })
    .eq('id', tripId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/trips')
  revalidatePath(`/trips/${tripId}`)
  revalidatePath('/')
  return { success: true }
}
