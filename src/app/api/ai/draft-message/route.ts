// POST /api/ai/draft-message — admin-only.
// Generates a first WhatsApp outreach message for a lead, written in Nomichi's voice.
import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { generateWithGemini, GeminiError } from '@/lib/ai/gemini'

const SYSTEM_PROMPT = `You write the first WhatsApp message a Nomichi travel associate sends to a new lead.

Voice: warm, honest, specific, still. Second person. Short sentences.
Never use exclamation marks or em-dashes.
Never use words like "unlock", "elevate", or "embark".
Reference one concrete detail from what the traveller said.
Keep it under 60 words.
Output only the message text, nothing else.`

export async function POST(request: Request) {
  const { supabase, unauthorized } = await requireAdminSession()
  if (unauthorized) return unauthorized

  let leadId: string
  try {
    const body = await request.json()
    leadId = body.leadId
    if (!leadId || typeof leadId !== 'string') {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*, trips(name, destination, start_date, end_date)')
    .eq('id', leadId)
    .single()

  if (error || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  const trip = lead.trips as {
    name: string
    destination: string
    start_date: string
    end_date: string
  } | null

  const prompt = `Traveller: ${lead.name}
Trip: ${trip?.name ?? 'Not specified'} (${trip?.destination ?? 'unknown destination'})
Dates: ${trip ? `${trip.start_date} to ${trip.end_date}` : 'not specified'}
Group type: ${lead.group_type}
Preferred month: ${lead.preferred_month ?? 'not specified'}
What they're hoping the trip feels like: ${lead.trip_feel ?? 'not shared'}`

  try {
    const message = await generateWithGemini(prompt, SYSTEM_PROMPT)
    return NextResponse.json({ message })
  } catch (err) {
    const msg = err instanceof GeminiError ? err.message : 'Failed to draft message'
    const status = err instanceof GeminiError && err.message.includes('not configured') ? 503 : 502
    return NextResponse.json({ error: msg }, { status })
  }
}
