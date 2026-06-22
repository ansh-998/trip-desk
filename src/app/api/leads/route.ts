// POST /api/leads - public endpoint, called from the enquiry form.
// No auth required by design, but RLS still restricts this to INSERT only.
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enquirySchema } from '@/lib/validations/lead'

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = enquirySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let travellerId = parsed.data.travellerId || null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role === 'traveller') {
      travellerId = user.id
    }
  }

  const { error } = await supabase.from('leads').insert({
    trip_id: parsed.data.tripId,
    traveller_id: travellerId,
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    group_type: parsed.data.groupType,
    preferred_month: parsed.data.preferredMonth,
    trip_feel: parsed.data.tripFeel || null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
