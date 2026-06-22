'use server'

// Server actions for the properties CMS.
// Properties represent accommodation (hotels, homestays, guesthouses) that
// Nomichi partners with. Only team members can create or modify them.
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { propertySchema, type PropertyInput } from '@/lib/validations/property'

type ActionResult = { success: true; propertyId?: string } | { success: false; error: string }

export async function createProperty(input: PropertyInput): Promise<ActionResult> {
  const parsed = propertySchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid property details' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .insert({
      name: parsed.data.name,
      location: parsed.data.location,
      description: parsed.data.description,
      property_type: parsed.data.propertyType,
      price_per_night: parsed.data.pricePerNight,
      status: parsed.data.status,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/properties')
  return { success: true, propertyId: data.id }
}

export async function updateProperty(propertyId: string, input: PropertyInput): Promise<ActionResult> {
  const parsed = propertySchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid property details' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('properties')
    .update({
      name: parsed.data.name,
      location: parsed.data.location,
      description: parsed.data.description,
      property_type: parsed.data.propertyType,
      price_per_night: parsed.data.pricePerNight,
      status: parsed.data.status,
    })
    .eq('id', propertyId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/properties')
  revalidatePath(`/admin/properties/${propertyId}/edit`)
  return { success: true }
}

export async function deleteProperty(propertyId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('properties').delete().eq('id', propertyId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/properties')
  return { success: true }
}
