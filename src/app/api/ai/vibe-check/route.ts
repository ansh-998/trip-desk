// POST /api/ai/vibe-check — admin-only.
// Assesses how well a lead's travel style fits Nomichi's slow-travel philosophy.
import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { generateWithGemini, GeminiError, parseJsonFromModel } from '@/lib/ai/gemini'

const SYSTEM_PROMPT = `You are a travel expert at Nomichi, a company that runs slow-paced, small group journeys.

Based on the traveller's enquiry, assess if they are a good fit for this philosophy.

Nomichi vibe: slow, honest, specific, still, deep connection, concrete details.
NOT Nomichi: checklist travel, "must-see" rushing, luxury-only, "elevate/embark" fluff.

This is a suggestion for the sales associate only. It must never be treated as an automatic rejection.

Output exactly one JSON object, no markdown:
{
  "fit": "high" | "medium" | "low",
  "reason": "one sentence explanation why"
}

Be honest and specific. No exclamation marks.`

type VibeResult = { fit: 'high' | 'medium' | 'low'; reason: string }

function normalizeVibeResult(raw: unknown): VibeResult {
  const obj = raw as Partial<VibeResult>
  const fit = obj.fit === 'high' || obj.fit === 'medium' || obj.fit === 'low' ? obj.fit : 'medium'
  const reason =
    typeof obj.reason === 'string' && obj.reason.trim()
      ? obj.reason.trim()
      : 'Could not definitively assess the vibe from the shared details.'
  return { fit, reason }
}

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
    .select('*, trips(name, description)')
    .eq('id', leadId)
    .single()

  if (error || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  const trip = lead.trips as { name: string; description: string } | null

  const prompt = `Traveller name: ${lead.name}
Trip interested in: ${trip?.name ?? 'Not specified'}
Trip description: ${trip?.description ?? 'Not available'}
Group type: ${lead.group_type}
Preferred month: ${lead.preferred_month ?? 'Not specified'}
What they hope the trip feels like: ${lead.trip_feel ?? 'Not shared'}`

  try {
    const responseText = await generateWithGemini(prompt, SYSTEM_PROMPT)
    const result = normalizeVibeResult(parseJsonFromModel(responseText))
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({
        fit: 'medium',
        reason: 'Could not definitively assess the vibe from the shared details.',
      })
    }
    const msg = err instanceof GeminiError ? err.message : 'Failed to run vibe check'
    const status = err instanceof GeminiError && err.message.includes('not configured') ? 503 : 502
    return NextResponse.json({ error: msg }, { status })
  }
}
