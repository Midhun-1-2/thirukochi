const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** ₹14,125.00 */
export function formatINR(value: number, opts: { whole?: boolean } = {}): string {
  return (opts.whole ? inrWhole : inr).format(value)
}

/** Signed change with symbol, e.g. "↓ ₹30.00" */
export function formatChange(value: number): { text: string; direction: 'up' | 'down' | 'flat' } {
  if (value === 0) return { text: formatINR(0), direction: 'flat' }
  const direction = value > 0 ? 'up' : 'down'
  return { text: formatINR(Math.abs(value)), direction }
}

/** Mask a phone number: +91 98765 43210 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10)
  if (digits.length !== 10) return phone
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

/** 00:45 */
export function formatSeconds(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${pad2(m)}:${pad2(s)}`
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
