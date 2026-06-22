import { getOpenTrips } from '@/lib/trips'
import { TripListingSection } from '@/components/public/TripListingSection'

export default async function HomePage() {
  const trips = await getOpenTrips()

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-ink py-20 lg:py-28">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_bg.png"
            alt="Serene mountains of Spiti Valley"
            className="h-full w-full object-cover object-center opacity-45 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1760px] px-6 md:px-10 lg:px-20 text-white">
          <span className="inline-block rounded-full bg-rust/90 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-cream mb-4">
            Travel that finds you
          </span>
          <h1 className="max-w-3xl text-[36px] font-bold leading-none tracking-tight sm:text-[54px] lg:text-[64px] font-display text-white">
            Small-group journeys <br />across India
          </h1>
          <p className="mt-4 max-w-xl text-base text-cream/80 sm:text-lg leading-relaxed font-sans">
            Slow pace. Real places. Run by people who have actually walked these paths.
          </p>
        </div>
      </section>

      <TripListingSection trips={trips} />
    </main>
  )
}
