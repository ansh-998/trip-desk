// Shared formatting helpers used across both public and admin views.
export function formatINR(amountInRupees: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountInRupees)
}

export function formatDateRange(startISO: string, endISO: string) {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  const start = new Date(startISO).toLocaleDateString('en-IN', opts)
  const end = new Date(endISO).toLocaleDateString('en-IN', opts)
  return `${start} - ${end}`
}
