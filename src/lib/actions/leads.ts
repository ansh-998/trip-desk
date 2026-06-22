'use server'

// Server actions for moving a lead through the sales pipeline and assigning
// an owner. These are targeted one-field updates, so a dedicated API route
// would be overkill — they're called directly from client components.
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { PIPELINE_STAGES, type PipelineStage } from '@/lib/constants'

type ActionResult = { success: true } | { success: false; error: string }

export async function updateLeadStatus(leadId: string, status: PipelineStage): Promise<ActionResult> {
  if (!PIPELINE_STAGES.includes(status)) {
    return { success: false, error: 'Not a valid pipeline stage' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ status }).eq('id', leadId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
  revalidatePath('/admin')
  return { success: true }
}

export async function assignLeadOwner(leadId: string, ownerId: string | null): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ owner_id: ownerId }).eq('id', leadId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
  return { success: true }
}
