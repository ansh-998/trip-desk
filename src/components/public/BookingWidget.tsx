'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Trip } from '@/types'
import { enquirySchema } from '@/lib/validations/lead'
import { formatINR, formatDateRange } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const GROUP_TYPES = [
  { value: 'solo', label: 'Solo' },
  { value: 'friends', label: 'Friends' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
] as const

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function BookingWidget({ trip }: { trip: Trip }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [groupType, setGroupType] = useState('')
  const [preferredMonth, setPreferredMonth] = useState('')
  const [tripFeel, setTripFeel] = useState('')

  const seatsLeft = trip.total_seats - trip.seats_booked

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const parsed = enquirySchema.safeParse({
      name,
      phone,
      email,
      tripId: trip.id,
      groupType,
      preferredMonth,
      tripFeel,
    })

    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        errors[String(issue.path[0])] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    setSubmitting(false)

    if (!res.ok) {
      try {
        const errData = await res.json()
        setFormError(errData.error || 'Something did not go through. Try again in a moment.')
      } catch {
        setFormError('Something did not go through. Try again in a moment.')
      }
      return
    }
    router.push('/enquiry/success')
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-6 flex items-baseline justify-between">
        <p>
          <span className="text-2xl font-semibold">{formatINR(trip.price_inr)}</span>
          <span className="text-ink-muted"> / person</span>
        </p>
        <div className="flex items-center gap-1 text-sm">
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          4.92 · 28 reviews
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-2 border-b border-border">
          <div className="border-r border-border p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink">Dates</p>
            <p className="text-sm text-ink-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
          </div>
          <div className="p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink">Group</p>
            <p className="text-sm text-ink-muted">Up to {trip.total_seats} travellers</p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-ink">Availability</p>
          <div className="text-sm text-ink-muted">
            {seatsLeft > 0 ? (
              <>
                <span className="font-medium text-olive">{seatsLeft} seats left</span>
                {seatsLeft <= 3 && ' — book soon'}
              </>
            ) : (
              <span className="text-brand">Fully booked</span>
            )}
          </div>
          {/* Seating Progress Bar */}
          <div className="h-1.5 w-full bg-sand/20 dark:bg-sand/10 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-rust rounded-full transition-all duration-1000" 
              style={{ width: `${(trip.seats_booked / trip.total_seats) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {!expanded ? (
        <Button
          type="button"
          className="w-full rounded-lg"
          size="lg"
          onClick={() => setExpanded(true)}
          disabled={seatsLeft <= 0}
        >
          {seatsLeft > 0 ? 'Check availability' : 'Join waitlist'}
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your name"
            placeholder="How should we address you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
          />
          <Input
            label="Phone"
            placeholder="WhatsApp preferred"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fieldErrors.phone}
          />
          <Input
            label="Email (optional)"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink">Travelling as</label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="h-11 rounded-lg border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <option value="">Select</option>
                {GROUP_TYPES.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {fieldErrors.groupType && (
                <p className="text-xs text-red-600">{fieldErrors.groupType}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink">Preferred month</label>
              <select
                value={preferredMonth}
                onChange={(e) => setPreferredMonth(e.target.value)}
                className="h-11 rounded-lg border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <option value="">Select</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {fieldErrors.preferredMonth && (
                <p className="text-xs text-red-600">{fieldErrors.preferredMonth}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink">
              What are you hoping this trip feels like?
            </label>
            <textarea
              value={tripFeel}
              onChange={(e) => setTripFeel(e.target.value)}
              rows={3}
              placeholder="A few honest words are enough..."
              className="rounded-lg border border-border px-3 py-2 text-sm placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
          )}

          <Button type="submit" className="w-full rounded-lg" size="lg" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send enquiry'}
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-xs text-ink-muted">
        You won&apos;t be charged yet · We respond within 24 hours
      </p>
    </div>
  )
}
