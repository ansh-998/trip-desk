import Link from 'next/link'
import type { Trip } from '@/types'
import { formatINR, formatDateRange } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getTripCoverImage } from '@/lib/trip-images'

export function TripCard({ trip }: { trip: Trip }) {
  const seatsLeft = trip.total_seats - trip.seats_booked

  return (
    <Link href={`/trips/${trip.id}`} className="group block outline-none">
      <Card className="h-full transition-all duration-300 group-hover:border-rust/40 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-rust/50 flex flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/10">
          <img
            src={trip.cover_image || getTripCoverImage(trip.name)}
            alt={trip.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {seatsLeft > 0 && seatsLeft <= 3 && (
            <div className="absolute left-3 top-3">
              <Badge tone="rust" className="animate-pulse">
                {seatsLeft} left
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6 flex flex-col h-full flex-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-bold text-ink group-hover:text-rust transition-colors">
              {trip.name}
            </h3>
          </div>
          
          <div className="space-y-1 mb-6">
            <p className="text-sm font-medium text-ink/80">{trip.destination}</p>
            <p className="text-xs text-ink/50 uppercase tracking-wider">
              {formatDateRange(trip.start_date, trip.end_date)}
            </p>
          </div>

          <p className="text-sm text-ink/70 line-clamp-3 mb-8 flex-1 leading-relaxed">
            {trip.description}
          </p>

          <div className="pt-4 border-t border-sand/10 flex items-center justify-between">
            <p className="text-base font-bold text-ink">
              {formatINR(trip.price_inr)}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-olive group-hover:translate-x-1 transition-transform">
              View Journey &rarr;
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
