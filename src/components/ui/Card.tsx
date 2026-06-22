import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const base = 'rounded-xl overflow-hidden'
  const variants = {
    default: 'bg-surface shadow-sm border border-sand/30',
    outline: 'border border-sand bg-transparent',
    ghost: 'bg-cream/50 border border-transparent'
  }

  return (
    <div className={clsx(base, variants[variant], className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-4 border-b border-sand/20', className)}>{children}</div>
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-4 border-t border-sand/20 bg-cream/20', className)}>{children}</div>
}
