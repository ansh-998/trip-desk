'use client'

import { clsx } from 'clsx'

export type TripCategory = 'all' | 'mountains' | 'forest' | 'desert' | 'coastal'

const CATEGORIES: { id: TripCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All journeys', icon: '🌍' },
  { id: 'mountains', label: 'Mountains', icon: '🏔️' },
  { id: 'forest', label: 'Forests', icon: '🌲' },
  { id: 'desert', label: 'Desert', icon: '🏜️' },
  { id: 'coastal', label: 'Coastal', icon: '🌊' },
]

export function getTripCategory(destination: string, name: string): TripCategory {
  const text = `${destination} ${name}`.toLowerCase()
  if (text.includes('spiti') || text.includes('himachal') || text.includes('meghalaya')) {
    return text.includes('meghalaya') ? 'forest' : 'mountains'
  }
  if (text.includes('coorg') || text.includes('coffee') || text.includes('northeast')) {
    return 'forest'
  }
  if (text.includes('kutch') || text.includes('desert') || text.includes('gujarat')) {
    return 'desert'
  }
  return 'all'
}

export function CategoryBar({
  active,
  onChange,
}: {
  active: TripCategory
  onChange: (category: TripCategory) => void
}) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-[1760px] px-6 md:px-10 lg:px-20">
        <div className="scrollbar-hide flex gap-8 overflow-x-auto py-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={clsx(
                'flex shrink-0 flex-col items-center gap-1 border-b-2 pb-3 text-xs font-medium transition-colors',
                active === cat.id
                  ? 'border-ink text-ink opacity-100'
                  : 'border-transparent text-ink-muted opacity-70 hover:opacity-100 hover:border-border'
              )}
            >
              <span className="text-2xl" aria-hidden>
                {cat.icon}
              </span>
              <span className="whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
