import Link from 'next/link'

export default function EnquirySuccessPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
        <svg className="h-10 w-10 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-[28px] font-semibold text-ink">We have your note</h1>
      <p className="mt-3 text-base text-ink-muted leading-relaxed">
        Someone from our team will reach out within a day — usually on WhatsApp,
        sometimes over a proper phone call.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to journeys
      </Link>
    </main>
  )
}
