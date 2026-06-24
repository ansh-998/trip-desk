import { PropertyForm } from '@/components/admin/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-ink tracking-tight">New Property</h1>
        <p className="text-ink/50 mt-1">Add a new accommodation to the Trip Desk.</p>
      </div>
      <PropertyForm />
    </div>
  )
}
