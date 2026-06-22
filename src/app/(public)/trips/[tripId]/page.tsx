import { getTripById } from '@/lib/trips'
import { TripGallery } from '@/components/public/TripGallery'
import { BookingWidget } from '@/components/public/BookingWidget'
import { formatDateRange } from '@/lib/utils'
import Link from 'next/link'

const HIGHLIGHTS = [
  { icon: '👥', title: 'Small groups', desc: 'Max 12 travellers per journey' },
  { icon: '🚶', title: 'Slow travel', desc: 'No checklist tourism' },
  { icon: '🏡', title: 'Local stays', desc: 'Homestays and guesthouses' },
  { icon: '🍽️', title: 'Home-cooked meals', desc: 'Regional food, not buffet lines' },
]

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params
  const trip = await getTripById(tripId)

  if (!trip || trip.status === 'closed') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center md:px-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
          <svg className="h-8 w-8 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-ink">This journey isn&apos;t available</h1>
        <p className="mt-2 text-ink-muted">It may be fully booked or no longer open for enquiries.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          Browse open journeys
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1120px] px-6 pb-24 pt-6 md:px-10">
      <TripGallery trip={trip} />

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <div className="border-b border-border pb-6">
            <h1 className="text-[26px] font-semibold text-ink sm:text-[32px]">{trip.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <span className="flex items-center gap-1 font-medium text-ink">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                4.92
              </span>
              <span>·</span>
              <span className="underline">{trip.destination}</span>
              <span>·</span>
              <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
            </div>
          </div>

          <div className="border-b border-border py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
                N
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">Hosted by Nomichi</h2>
                <p className="text-sm text-ink-muted">
                  Curated journeys · {trip.total_seats} seats · GST included
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-border py-8">
            <p className="text-base leading-relaxed text-ink">{trip.description}</p>
          </div>

          <div className="py-8">
            <h2 className="mb-6 text-[22px] font-semibold text-ink">What this journey offers</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-2xl" aria-hidden>{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <p className="text-sm text-ink-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border p-6">
            <h2 className="mb-4 text-[22px] font-semibold text-ink">Good to know</h2>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li className="flex gap-3">
                <span className="text-ink">✓</span>
                Free cancellation up to 30 days before departure
              </li>
              <li className="flex gap-3">
                <span className="text-ink">✓</span>
                All accommodation and most meals included
              </li>
              <li className="flex gap-3">
                <span className="text-ink">✓</span>
                Local guides who live in the region
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget trip={trip} />
        </div>
      </div>
    </main>
  )
}
