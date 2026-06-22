'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { PIPELINE_STAGES } from '@/lib/constants'

interface LeadFiltersProps {
  trips: { id: string; name: string }[]
  owners: { id: string; full_name: string }[]
}

export function LeadFilters({ trips, owners }: LeadFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const selectClasses = "flex h-10 rounded-md border border-sand/60 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"

  return (
    <div className="flex flex-wrap gap-4 mb-8 items-end">
      <div className="flex-1 min-w-[240px] flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-ink/40 ml-1">Search</label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="search"
            placeholder="Name or phone..."
            defaultValue={searchParams.get('q') ?? ''}
            onChange={(e) => updateParam('q', e.target.value)}
            className={`${selectClasses} w-full pl-9`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-ink/40 ml-1">Status</label>
        <select
          value={searchParams.get('status') ?? ''}
          onChange={(e) => updateParam('status', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Statuses</option>
          {PIPELINE_STAGES.map((stage) => (
            <option key={stage} value={stage}>{stage.toLowerCase().replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-ink/40 ml-1">Journey</label>
        <select
          value={searchParams.get('trip') ?? ''}
          onChange={(e) => updateParam('trip', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Journeys</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>{trip.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-ink/40 ml-1">Owner</label>
        <select
          value={searchParams.get('owner') ?? ''}
          onChange={(e) => updateParam('owner', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Owners</option>
          <option value="unassigned">Unassigned</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>{owner.full_name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
