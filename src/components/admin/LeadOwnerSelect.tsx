'use client'

// "Assign an owner to a lead, so it is clear who is responsible." Owners
// are team members from `profiles`, passed in rather than fetched here
// since the parent page already has them.
import { useState } from 'react'
import { assignLeadOwner } from '@/lib/actions/leads'

interface Owner {
  id: string
  full_name: string
}

export function LeadOwnerSelect({
  leadId,
  ownerId,
  owners,
}: {
  leadId: string
  ownerId: string | null
  owners: Owner[]
}) {
  const [current, setCurrent] = useState(ownerId ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setCurrent(next)
    setSaving(true)
    setSaved(false)
    const result = await assignLeadOwner(leadId, next || null)
    setSaving(false)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={current}
        onChange={handleChange}
        disabled={saving}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Unassigned</option>
        {owners.map((owner) => (
          <option key={owner.id} value={owner.id}>{owner.full_name}</option>
        ))}
      </select>
      {saved && <span className="text-xs text-olive">Saved</span>}
    </div>
  )
}
