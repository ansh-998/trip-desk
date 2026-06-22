'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [expanded, setExpanded] = useState(false)
  const [destination, setDestination] = useState('')
  const [month, setMonth] = useState('')

  function handleSearch() {
    const parts = [destination, month].filter(Boolean)
    onSearch(parts.join(' '))
    setExpanded(false)
  }

  return (
    <div className={clsx('relative z-10', className)}>
      <div
        className={clsx(
          'mx-auto flex max-w-[850px] items-center rounded-full border border-border bg-surface transition-all',
          expanded ? 'shadow-search' : 'shadow-sm hover:shadow-md'
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex flex-1 flex-col px-6 py-3 text-left rounded-full hover:bg-surface-muted transition-colors"
        >
          <span className="text-xs font-semibold text-ink">Where</span>
          <input
            type="text"
            placeholder="Search destinations"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value)
              onSearch([e.target.value, month].filter(Boolean).join(' '))
            }}
            onFocus={() => setExpanded(true)}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-light outline-none"
          />
        </button>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="hidden flex-1 flex-col px-6 py-3 text-left sm:flex rounded-full hover:bg-surface-muted transition-colors"
        >
          <span className="text-xs font-semibold text-ink">When</span>
          <input
            type="text"
            placeholder="Add month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value)
              onSearch([destination, e.target.value].filter(Boolean).join(' '))
            }}
            onFocus={() => setExpanded(true)}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-light outline-none"
          />
        </button>

        <div className="p-2">
          <button
            type="button"
            onClick={handleSearch}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark transition-colors"
            aria-label="Search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
