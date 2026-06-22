'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge, BadgeTone } from '@/components/ui/Badge'

interface VibeResult {
  fit: 'high' | 'medium' | 'low'
  reason: string
}

const FIT_LABELS: Record<VibeResult['fit'], string> = {
  high: 'Strong fit',
  medium: 'Unclear fit',
  low: 'Possible mismatch',
}

const FIT_TONES: Record<VibeResult['fit'], BadgeTone> = {
  high: 'olive',
  medium: 'sand',
  low: 'rust',
}

export function VibeCheck({ leadId }: { leadId: string }) {
  const [result, setResult] = useState<VibeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheck() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/ai/vibe-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'The vibe check failed this time.')
      return
    }

    setResult(data as VibeResult)
  }

  return (
    <div className="rounded-xl border border-border bg-surface-muted/50 p-4 mb-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="text-sm font-semibold text-ink">Vibe check</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Reads the enquiry and suggests fit for slow, small-group travel.
          </p>
        </div>
        {!result && (
          <Button variant="outline" size="sm" onClick={handleCheck} disabled={loading}>
            {loading ? 'Reading…' : 'Run check'}
          </Button>
        )}
      </div>

      <p className="text-[11px] text-ink-muted italic mb-3">
        Suggestion only — never an automatic reject. You make the call.
      </p>

      {error && (
        <p className="text-red-600 text-xs rounded-lg bg-red-50 px-3 py-2">{error}</p>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge tone={FIT_TONES[result.fit]}>{FIT_LABELS[result.fit]}</Badge>
          </div>
          <p className="text-sm text-ink leading-relaxed">{result.reason}</p>
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="text-xs text-ink-muted hover:text-ink underline underline-offset-2"
          >
            {loading ? 'Re-evaluating…' : 'Re-evaluate'}
          </button>
        </div>
      )}
    </div>
  )
}
