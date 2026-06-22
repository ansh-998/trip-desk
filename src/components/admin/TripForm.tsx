'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Trip } from '@/types'
import { tripSchema } from '@/lib/validations/trip'
import { createTrip, updateTrip } from '@/lib/actions/trips'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

export function TripForm({ trip }: { trip?: Trip }) {
  const router = useRouter()
  const isEdit = Boolean(trip)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [name, setName] = useState(trip?.name ?? '')
  const [destination, setDestination] = useState(trip?.destination ?? '')
  const [startDate, setStartDate] = useState(trip?.start_date ?? '')
  const [endDate, setEndDate] = useState(trip?.end_date ?? '')
  const [priceInr, setPriceInr] = useState(trip?.price_inr?.toString() ?? '')
  const [totalSeats, setTotalSeats] = useState(trip?.total_seats?.toString() ?? '')
  const [status, setStatus] = useState<'open' | 'closed'>(trip?.status ?? 'open')
  const [description, setDescription] = useState(trip?.description ?? '')
  const [coverImage, setCoverImage] = useState(trip?.cover_image ?? '')
  const [galleryImages, setGalleryImages] = useState(trip?.gallery_images?.join(', ') ?? '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const supabase = createClient()

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('trip-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('trip-images').getPublicUrl(filePath)
      setCoverImage(data.publicUrl)
    } catch (err: any) {
      alert(`Upload failed: ${err.message}. Make sure you have created a public storage bucket named "trip-images" in your Supabase dashboard.`)
    } finally {
      setUploadingCover(false)
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingGallery(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `gallery/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('trip-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('trip-images').getPublicUrl(filePath)
        urls.push(data.publicUrl)
      }

      const currentUrls = galleryImages ? galleryImages.split(',').map((u) => u.trim()).filter(Boolean) : []
      setGalleryImages([...currentUrls, ...urls].join(', '))
    } catch (err: any) {
      alert(`Upload failed: ${err.message}. Make sure you have created a public storage bucket named "trip-images" in your Supabase dashboard.`)
    } finally {
      setUploadingGallery(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const parsed = tripSchema.safeParse({
      name,
      destination,
      startDate,
      endDate,
      priceInr,
      totalSeats,
      status,
      description,
      coverImage,
      galleryImages,
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
    const result = isEdit ? await updateTrip(trip!.id, parsed.data) : await createTrip(parsed.data)
    setSubmitting(false)

    if (!result.success) {
      setFormError(result.error)
      return
    }
    router.push('/admin/trips')
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <h2 className="text-xl font-display font-bold">
          {isEdit ? 'Edit Journey' : 'Create New Journey'}
        </h2>
        <p className="text-sm text-ink/60">Fill in the details for the travel that finds you.</p>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Journey Name"
            placeholder="e.g., The Slow Roads of Spiti"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
          />
          
          <Input
            label="Destination"
            placeholder="e.g., Himachal Pradesh, India"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            error={fieldErrors.destination}
          />

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={fieldErrors.startDate}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={fieldErrors.endDate}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Price (INR)"
              type="number"
              placeholder="GST included"
              value={priceInr}
              onChange={(e) => setPriceInr(e.target.value)}
              error={fieldErrors.priceInr}
            />
            <Input
              label="Total Seats"
              type="number"
              placeholder="e.g., 12"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              error={fieldErrors.totalSeats}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">Journey Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'open' | 'closed')}
              className="flex h-10 w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
            >
              <option value="open">Open for booking</option>
              <option value="closed">Closed / Fully Booked</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
            <Input
              label="Cover Image URL"
              placeholder="e.g., https://images.unsplash.com/photo-..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              error={fieldErrors.coverImage}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink/60">Or upload local photo</label>
              <label className="flex items-center justify-center h-10 px-4 rounded-md border border-sand/60 hover:bg-sand/10 cursor-pointer text-sm font-medium transition-colors">
                {uploadingCover ? 'Uploading...' : 'Choose File'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-medium text-ink/80">Gallery Image URLs (comma-separated)</label>
              <label className="text-xs font-bold text-rust hover:underline cursor-pointer">
                {uploadingGallery ? 'Uploading...' : 'Upload files from disk'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={galleryImages}
              onChange={(e) => setGalleryImages(e.target.value)}
              rows={3}
              placeholder="e.g., https://image1.com, https://image2.com"
              className="flex w-full rounded-md border border-sand/60 bg-transparent px-3 py-2 text-sm placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all"
            />
            {fieldErrors.galleryImages && (
              <p className="text-red-600 text-[10px] sm:text-xs font-medium">{fieldErrors.galleryImages}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="What makes this journey special? Focus on concrete details."
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
              {submitting ? 'Saving...' : isEdit ? 'Update Journey' : 'Create Journey'}
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
