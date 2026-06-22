'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Trip } from '@/types'
import { enquirySchema } from '@/lib/validations/lead'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

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

export function EnquiryForm({ trip }: { trip: Trip | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [travellerId, setTravellerId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [groupType, setGroupType] = useState('')
  const [preferredMonth, setPreferredMonth] = useState('')
  const [tripFeel, setTripFeel] = useState('')

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setTravellerId(user.id)
        // Optionally pre-fill name/email if we have them in auth
        if (user.email) setEmail(user.email)
        if (user.user_metadata?.full_name) setName(user.user_metadata.full_name)
      }
    }
    getUser()
  }, [supabase])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    if (!trip) {
      setFormError('This trip is no longer available.')
      return
    }

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
      body: JSON.stringify({ ...parsed.data, travellerId }),
    })
    setSubmitting(false)

    if (!res.ok) {
      setFormError('Something did not go through. Try again in a moment.')
      return
    }
    router.push('/enquiry/success')
  }

  return (
    <Card className="shadow-lg border-sand/20">
      <CardHeader className="bg-sand/5">
        <h3 className="text-2xl font-display font-bold text-ink">Tell us about your journey</h3>
        <p className="text-sm text-ink/60 mt-1">We take our trips slowly. We take our conversations seriously too.</p>
      </CardHeader>
      <CardContent className="pt-8 pb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Your name"
              placeholder="How should we address you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
            />
            <Input
              label="Phone number"
              placeholder="For a quick chat over WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldErrors.phone}
            />
          </div>
          
          <Input
            label="Email (optional)"
            placeholder="If you prefer long-form writing"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Who is travelling?</label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
              >
                <option value="">Select one</option>
                {GROUP_TYPES.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {fieldErrors.groupType && (
                <p className="text-red-600 text-[10px] sm:text-xs font-medium">{fieldErrors.groupType}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Preferred month</label>
              <select
                value={preferredMonth}
                onChange={(e) => setPreferredMonth(e.target.value)}
                className="flex h-10 w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
              >
                <option value="">Select a month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {fieldErrors.preferredMonth && (
                <p className="text-red-600 text-[10px] sm:text-xs font-medium">{fieldErrors.preferredMonth}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">
              What are you hoping this trip feels like?
            </label>
            <textarea
              value={tripFeel}
              onChange={(e) => setTripFeel(e.target.value)}
              rows={4}
              placeholder="A few honest words are enough. What kind of stillness are you looking for?"
              className="flex w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
            />
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-red-600 text-sm font-medium">{formError}</p>
            </div>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full sm:w-auto sm:px-12" 
              size="lg"
              disabled={submitting || !trip}
            >
              {submitting ? 'Sending...' : 'Send enquiry'}
            </Button>
            <p className="text-[10px] text-ink/40 mt-4 text-center sm:text-left">
              We usually respond within 24 hours. No spam, just travel.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
