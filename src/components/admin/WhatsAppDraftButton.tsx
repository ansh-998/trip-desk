'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function WhatsAppDraftButton({
  leadId,
  phone,
}: {
  leadId: string
  phone: string
}) {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDraft() {
    setLoading(true)
    setError(null)
    setCopied(false)

    const res = await fetch('/api/ai/draft-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Could not draft a message right now.')
      return
    }

    setMessage(data.message ?? null)
  }

  async function handleCopy() {
    if (!message) return
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappUrl = message
    ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    : null

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-semibold text-sm text-ink">First WhatsApp message</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            AI draft using trip details and what they told us. Warm, short, in our voice.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDraft}
          disabled={loading}
        >
          {loading ? 'Drafting…' : message ? 'Redraft' : 'Draft'}
        </Button>
      </div>

      {error && (
        <p className="text-red-600 text-xs mb-2 rounded-lg bg-red-50 px-3 py-2">{error}</p>
      )}

      {message && (
        <div className="space-y-3">
          <p className="text-sm whitespace-pre-wrap leading-relaxed bg-surface-muted rounded-lg p-3 border border-border">
            {message}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center rounded-lg bg-[#25D366] px-3 text-xs font-semibold text-white hover:bg-[#20bd5a] transition-colors"
              >
                Open in WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
