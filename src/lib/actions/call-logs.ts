'use server'

// Server action for adding a call log entry.
// Logs are append-only by design — there are no edit or delete operations.
// A call log is a record of what actually happened, not a scratchpad.
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

export async function addCallLog(
  leadId: string,
  note: string,
  nextAction: string
): Promise<ActionResult> {
  if (!note.trim()) {
    return { success: false, error: 'Note cannot be empty' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('call_logs').insert({
    lead_id: leadId,
    author_id: user?.id ?? null,
    note: note.trim(),
    next_action: nextAction.trim() || null,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/leads/${leadId}`)
  revalidatePath('/admin')
  return { success: true }
}
