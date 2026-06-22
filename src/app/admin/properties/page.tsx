import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatINR } from '@/lib/utils'

export default async function AdminPropertiesPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-ink tracking-tight">Properties</h1>
          <p className="text-ink/50 mt-1">Manage accommodations and hotels for your journeys.</p>
        </div>
        <Link href="/admin/properties/new">
          <Button>Add Property</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand/20 bg-sand/5">
                <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Name</th>
                <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Location</th>
                <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Type</th>
                <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Price/Night</th>
                <th className="px-6 py-4 text-left font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-6 py-4 text-right font-display font-bold text-ink/70 uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/10">
              {!properties?.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink/40 italic">
                    No properties added yet.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="hover:bg-sand/5 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/admin/properties/${property.id}/edit`} className="font-semibold text-ink hover:text-rust transition-colors">
                        {property.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-ink/70">
                      {property.location}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone="sand" className="capitalize">
                        {property.property_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatINR(property.price_per_night)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={property.status === 'active' ? 'olive' : 'rust'} className="capitalize">
                        {property.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-[10px] font-bold uppercase tracking-widest text-olive opacity-0 group-hover:opacity-100 transition-opacity hover:text-rust"
                      >
                        Edit &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
