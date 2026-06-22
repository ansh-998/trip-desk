import { createClient } from '@/lib/supabase/server'
import { CallLogPanel } from '@/components/admin/CallLogPanel'
import { LeadStatusSelect } from '@/components/admin/LeadStatusSelect'
import { LeadOwnerSelect } from '@/components/admin/LeadOwnerSelect'
import { WhatsAppDraftButton } from '@/components/admin/WhatsAppDraftButton'
import { VibeCheck } from '@/components/admin/VibeCheck'
import { formatINR } from '@/lib/utils'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>
}) {
  const { leadId } = await params
  const supabase = await createClient()

  const { data: lead } = await supabase
    .from('leads')
    .select('*, trips(*)')
    .eq('id', leadId)
    .single()

  const { data: callLogs } = await supabase
    .from('call_logs')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  const { data: owners } = await supabase.from('profiles').select('id, full_name').order('full_name')

  if (!lead) {
    return <p className="text-ink-muted">Lead not found.</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <p className="text-ink-muted">{lead.trips?.name ?? 'No trip linked'}</p>
          </div>
          <LeadStatusSelect leadId={lead.id} status={lead.status} />
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
          <div>
            <dt className="text-ink-muted">Phone</dt>
            <dd>{lead.phone}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Email</dt>
            <dd>{lead.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Group</dt>
            <dd className="capitalize">{lead.group_type}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Preferred month</dt>
            <dd>{lead.preferred_month ?? '—'}</dd>
          </div>
          {lead.trips && (
            <div>
              <dt className="text-ink-muted">Trip price</dt>
              <dd>{formatINR(lead.trips.price_inr)}</dd>
            </div>
          )}
          <div>
            <dt className="text-ink-muted mb-1">Owner</dt>
            <dd>
              <LeadOwnerSelect leadId={lead.id} ownerId={lead.owner_id} owners={owners ?? []} />
            </dd>
          </div>
        </dl>

        {lead.trip_feel && (
          <div className="rounded-lg border border-border bg-surface-muted p-3 text-sm mb-6">
            <p className="text-ink-muted mb-1">What they are hoping this trip feels like</p>
            <p>{lead.trip_feel}</p>
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            AI assists
          </h2>
          <VibeCheck leadId={leadId} />
          <WhatsAppDraftButton leadId={lead.id} phone={lead.phone} />
        </section>
      </div>
      <CallLogPanel leadId={leadId} logs={callLogs ?? []} />
    </div>
  )
}
