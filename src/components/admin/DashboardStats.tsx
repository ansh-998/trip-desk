import { PIPELINE_STAGES } from '@/lib/constants'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface LeadRow {
  status: string
  trip_id: string | null
  tripName: string | null
}

export function DashboardStats({ leads }: { leads: LeadRow[] }) {
  const byStage = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: leads.filter((l) => l.status === stage).length,
  }))

  const byTrip = new Map<string, number>()
  for (const lead of leads) {
    const tripName = lead.tripName ?? 'No trip linked'
    byTrip.set(tripName, (byTrip.get(tripName) ?? 0) + 1)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-ink/60">Total Leads</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rust"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        
        {byStage.slice(0, 3).map(({ stage, count }) => (
          <Card key={stage}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-ink/60 capitalize">{stage.toLowerCase().replace(/_/g, ' ')}</p>
                <div className="h-2 w-2 rounded-full bg-sand"></div>
              </div>
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-display font-bold">Leads per Journey</h2>
          </CardHeader>
          <CardContent>
            {byTrip.size === 0 ? (
              <p className="text-ink/40 py-8 text-center italic text-sm">No leads to show yet.</p>
            ) : (
              <div className="space-y-4">
                {Array.from(byTrip.entries()).map(([tripName, count]) => (
                  <div key={tripName} className="flex items-center">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{tripName}</p>
                      <div className="h-1.5 w-full bg-sand/10 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-olive rounded-full" 
                          style={{ width: `${Math.min(100, (count / leads.length) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 font-bold text-sm">{count}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-display font-bold">Pipeline Distribution</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {byStage.map(({ stage, count }) => (
                <div key={stage} className="flex items-center justify-between text-sm">
                  <span className="text-ink/60 capitalize">{stage.toLowerCase().replace(/_/g, ' ')}</span>
                  <Badge tone={count > 0 ? 'olive' : 'sand'}>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
