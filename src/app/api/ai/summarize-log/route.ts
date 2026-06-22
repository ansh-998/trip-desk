// POST /api/ai/summarize-log — admin-only.
// Reads the full call log for a lead and returns a single-sentence summary.
import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { generateWithGemini, GeminiError } from '@/lib/ai/gemini'

const SYSTEM_PROMPT = `Summarise this call log into exactly one sentence: where the lead currently stands, and the single next action.
Plain language, no fluff, no exclamation marks.
Output only the sentence, nothing else.`

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

  const { data: logs, error } = await supabase
    .from('call_logs')
    .select('note, next_action, created_at')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!logs || logs.length === 0) {
    return NextResponse.json({ summary: 'No touchpoints logged yet — add a call note first.' })
  }

  const prompt = logs
    .map((l) => {
      const date = new Date(l.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      })
      return `[${date}] ${l.note}${l.next_action ? ` (next: ${l.next_action})` : ''}`
    })
    .join('\n')

  try {
    const summary = await generateWithGemini(prompt, SYSTEM_PROMPT)
    return NextResponse.json({ summary })
  } catch (err) {
    const msg = err instanceof GeminiError ? err.message : 'Failed to summarise log'
    const status = err instanceof GeminiError && err.message.includes('not configured') ? 503 : 502
    return NextResponse.json({ error: msg }, { status })
  }
}
