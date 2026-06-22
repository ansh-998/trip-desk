import Link from 'next/link'
import { PipelineStatusBadge } from './PipelineStatusBadge'
import { Card, CardContent } from '@/components/ui/Card'

export function LeadTable({ leads }: { leads: any[] }) {
  if (leads.length === 0) {
    return (
      <Card variant="outline" className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-ink/50 text-sm italic">
            No leads yet. They will show up here the moment someone enquires.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand/20 bg-sand/5">
              <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Name</th>
              <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Journey</th>
              <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Pipeline Status</th>
              <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Owner</th>
              <th className="px-6 py-4 text-right font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/10">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-sand/5 transition-colors group">
                <td className="px-6 py-4">
                  <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-ink hover:text-rust transition-colors">
                    {lead.name}
                  </Link>
                  <p className="text-[10px] text-ink/40 mt-0.5">{lead.email || 'No email provided'}</p>
                </td>
                <td className="px-6 py-4 text-ink/70">
                  {lead.trips?.name ?? '—'}
                </td>
                <td className="px-6 py-4">
                  <PipelineStatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-sand/30 flex items-center justify-center text-[10px] font-bold text-ink/60">
                      {lead.profiles?.full_name?.[0] || 'U'}
                    </div>
                    <span className="text-ink/70">{lead.profiles?.full_name ?? 'Unassigned'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/admin/leads/${lead.id}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-olive opacity-0 group-hover:opacity-100 transition-opacity hover:text-rust"
                  >
                    View &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
