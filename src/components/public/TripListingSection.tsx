'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Trip } from '@/types'
import { formatINR, formatDateRange } from '@/lib/utils'
import { getTripCoverImage } from '@/lib/trip-images'
import { CategoryBar, getTripCategory, type TripCategory } from './CategoryBar'
import { SearchBar } from './SearchBar'

function TripCard({ trip }: { trip: Trip }) {
  const seatsLeft = trip.total_seats - trip.seats_booked
  const cover = trip.cover_image || getTripCoverImage(trip.name)

  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <article>
        <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-sand/10">
          <img
            src={cover}
            alt={trip.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {seatsLeft > 0 && seatsLeft <= 3 && (
            <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
              Only {seatsLeft} left
            </span>
          )}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity group-hover:opacity-100 hover:scale-110"
            aria-label="Save journey"
          >
            <svg className="h-[18px] w-[18px] text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ink line-clamp-1">{trip.destination}</h3>
            <span className="flex shrink-0 items-center gap-0.5 text-sm">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              4.9
            </span>
          </div>
          <p className="text-sm text-ink-muted line-clamp-1">{trip.name}</p>
          <p className="text-sm text-ink-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
          <p className="pt-0.5 text-sm">
            <span className="font-semibold text-ink">{formatINR(trip.price_inr)}</span>
            <span className="text-ink-muted"> per person</span>
          </p>
        </div>
      </article>
    </Link>
  )
}

export function TripListingSection({ trips }: { trips: Trip[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<TripCategory>('all')

  const filtered = useMemo(() => {
    return trips.filter((trip) => {
      const matchesCategory =
        category === 'all' || getTripCategory(trip.destination, trip.name) === category
      const q = query.toLowerCase().trim()
      const matchesQuery =
        !q ||
        trip.name.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q) ||
        trip.description.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [trips, query, category])

  return (
    <>
      <section className="bg-cream pb-6 pt-8">
        <div className="mx-auto max-w-[1760px] px-6 md:px-10 lg:px-20">
          <SearchBar onSearch={setQuery} />
        </div>
      </section>

      <CategoryBar active={category} onChange={setCategory} />

      <section className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
        <h2 className="mb-6 text-[22px] font-semibold text-ink">
          {filtered.length} journey{filtered.length === 1 ? '' : 's'} available
        </h2>

        {!filtered.length ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-ink-muted">No journeys match your search. Try a different destination.</p>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
