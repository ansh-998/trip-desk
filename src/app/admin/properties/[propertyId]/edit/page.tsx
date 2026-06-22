import { createClient } from '@/lib/supabase/server'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { notFound } from 'next/navigation'

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>
}) {
  const { propertyId } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single()

  if (!property) {
    return notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-ink tracking-tight">Edit Property</h1>
        <p className="text-ink/50 mt-1">Update details for {property.name}.</p>
      </div>
      <PropertyForm property={property} />
    </div>
  )
}
