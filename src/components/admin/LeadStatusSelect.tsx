'use client'

import { useState } from 'react'
import { updateLeadStatus } from '@/lib/actions/leads'
import { PIPELINE_STAGES, type PipelineStage } from '@/lib/constants'
import { clsx } from 'clsx'

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: PipelineStage }) {
  const [current, setCurrent] = useState(status)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as PipelineStage
    setCurrent(next)
    setSaving(true)
    setSaved(false)
    const result = await updateLeadStatus(leadId, next)
    setSaving(false)
    if (!result.success) {
      setCurrent(status)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <select
          value={current}
          onChange={handleChange}
          disabled={saving}
          className={clsx(
            "flex h-10 w-full rounded-md border border-sand/60 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/50 focus-visible:border-rust transition-all disabled:opacity-50",
            saved && "border-olive ring-1 ring-olive/20"
          )}
        >
          {PIPELINE_STAGES.map((stage) => (
            <option key={stage} value={stage}>{stage.toLowerCase().replace(/_/g, ' ')}</option>
          ))}
        </select>
        {saving && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-rust/20 border-t-rust rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="w-12 h-5 flex items-center">
        {saved && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-olive animate-in fade-in slide-in-from-left-2 duration-300">
            Saved
          </span>
        )}
      </div>
    </div>
  )
}
