'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types'
import { propertySchema } from '@/lib/validations/property'
import { createProperty, updateProperty } from '@/lib/actions/properties'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

const PROPERTY_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'resort', label: 'Resort' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'homestay', label: 'Homestay' },
  { value: 'camp', label: 'Campsite' },
]

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter()
  const isEdit = Boolean(property)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [name, setName] = useState(property?.name ?? '')
  const [location, setLocation] = useState(property?.location ?? '')
  const [propertyType, setPropertyType] = useState(property?.property_type ?? 'hotel')
  const [pricePerNight, setPricePerNight] = useState(property?.price_per_night?.toString() ?? '')
  const [status, setStatus] = useState<'active' | 'inactive'>(property?.status ?? 'active')
  const [description, setDescription] = useState(property?.description ?? '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const parsed = propertySchema.safeParse({
      name,
      location,
      propertyType,
      pricePerNight,
      status,
      description,
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
    const result = isEdit 
      ? await updateProperty(property!.id, parsed.data) 
      : await createProperty(parsed.data)
    setSubmitting(false)

    if (!result.success) {
      setFormError(result.error)
      return
    }
    router.push('/admin/properties')
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <h2 className="text-xl font-display font-bold">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </h2>
        <p className="text-sm text-ink/60">Manage details for accommodations and hotels.</p>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Property Name"
            placeholder="e.g., Mountain View Resort"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
          />
          
          <Input
            label="Location"
            placeholder="e.g., Old Manali, HP"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={fieldErrors.location}
          />

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <Input
              label="Price per Night (INR)"
              type="number"
              placeholder="e.g., 4500"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              error={fieldErrors.pricePerNight}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="flex h-10 w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
            >
              <option value="active">Active (Available for trips)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe the property, amenities, and vibe."
              className="flex w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
            />
            {fieldErrors.description && (
              <p className="text-red-600 text-[10px] sm:text-xs font-medium">{fieldErrors.description}</p>
            )}
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-red-600 text-sm font-medium">{formError}</p>
            </div>
          )}

          <div className="pt-4 flex items-center gap-4">
            <Button type="submit" size="lg" disabled={submitting} className="min-w-[140px]">
              {submitting ? 'Saving...' : isEdit ? 'Update Property' : 'Add Property'}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="lg" 
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
