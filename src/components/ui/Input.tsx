import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-ink leading-none">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'flex h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-ink-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-red-500 focus-visible:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-600 text-xs font-medium">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
