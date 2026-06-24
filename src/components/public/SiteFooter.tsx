import Link from 'next/link'

const FOOTER_SECTIONS = [
  {
    title: 'Support',
    links: [
      { label: 'Help Centre', href: '#' },
      { label: 'Safety information', href: '#' },
      { label: 'Cancellation options', href: '#' },
    ],
  },
  {
    title: 'Trip Desk',
    links: [
      { label: 'About us', href: '#' },
      { label: 'How we travel', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & conditions', href: '#' },
      { label: 'Privacy policy', href: '#' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-[1760px] px-6 py-12 md:px-10 lg:px-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-ink">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-ink">Contact</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Questions about a journey?
              <br />
              <a href="mailto:hello@tripdesk.in" className="underline hover:text-ink">
                hello@tripdesk.in
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-ink-muted">
            &copy; {new Date().getFullYear()} Trip Desk. Smart Travel CRM.
          </p>
          <div className="flex items-center gap-4 text-sm text-ink-muted">
            <span>English (IN)</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
