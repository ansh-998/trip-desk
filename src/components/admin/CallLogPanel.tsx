'use client'

import { useState } from 'react'
import type { CallLog } from '@/types'
import { addCallLog } from '@/lib/actions/call-logs'
import { Button } from '@/components/ui/Button'

export function CallLogPanel({ leadId, logs }: { leadId: string; logs: CallLog[] }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [summarizing, setSummarizing] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const [note, setNote] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSummarize() {
    setSummarizing(true)
    setSummaryError(null)

    const res = await fetch('/api/ai/summarize-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    })

    const data = await res.json().catch(() => ({}))
    setSummarizing(false)

    if (!res.ok) {
      setSummaryError(data.error ?? 'Could not summarise the log right now.')
      return
    }

    setSummary(data.summary ?? null)
  }

  async function handleAddNote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const result = await addCallLog(leadId, note, nextAction)
    setSaving(false)

    if (!result.success) {
      setError(result.error)
      return
    }
    setNote('')
    setNextAction('')
    setSummary(null)
  }

  return (
    <aside className="rounded-xl border border-border bg-white p-4 h-fit">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h2 className="font-semibold text-sm text-ink">Call log</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Append-only touchpoints. Summarise into one line when you need the picture fast.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSummarize}
          className="shrink-0 text-xs font-medium text-brand hover:underline disabled:opacity-40 disabled:no-underline"
          disabled={summarizing}
        >
          {summarizing ? 'Summarising…' : 'Summarise'}
        </button>
      </div>

      {summaryError && (
        <p className="text-red-600 text-xs mb-3 rounded-lg bg-red-50 px-3 py-2">{summaryError}</p>
      )}

      {summary && (
        <div className="mb-4 rounded-lg border border-brand/20 bg-brand/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand mb-1">
            Where this stands
          </p>
          <p className="text-sm text-ink leading-relaxed">{summary}</p>
        </div>
      )}

      <form onSubmit={handleAddNote} className="flex flex-col gap-2 mb-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was said"
          rows={2}
          required
          className="rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <input
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          placeholder="Next action (optional)"
          className="rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <Button type="submit" disabled={saving || !note.trim()} size="sm" className="self-start">
          {saving ? 'Adding…' : 'Add note'}
        </Button>
      </form>

      <ul className="space-y-3">
        {logs.length === 0 && (
          <p className="text-ink-muted text-sm">No touchpoints yet.</p>
        )}
        {logs.map((log) => (
          <li key={log.id} className="text-sm border-t border-border pt-3">
            <p className="text-ink">{log.note}</p>
            {log.next_action && (
              <p className="text-ink-muted mt-1">Next: {log.next_action}</p>
            )}
            <p className="text-ink-light text-xs mt-1">
              {new Date(log.created_at).toLocaleString('en-IN')}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  )
}
