import { clsx } from 'clsx'

export type BadgeTone = 'sand' | 'olive' | 'rust' | 'yellow' | 'ink'

export function Badge({
  children,
  tone = 'sand',
  className = '',
}: {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}) {
  const tones: Record<BadgeTone, string> = {
    sand: 'bg-sand/20 text-ink border-sand/30',
    olive: 'bg-olive/10 text-olive border-olive/20',
    rust: 'bg-rust/10 text-rust border-rust/20',
    yellow: 'bg-yellow/20 text-ink border-yellow/30',
    ink: 'bg-ink/10 text-ink border-ink/20',
  }

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rust/50 focus:ring-offset-2',
      tones[tone],
      className
    )}>
      {children}
    </span>
  )
}
