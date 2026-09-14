import type { FormEvent } from 'react'

/** Strip non-digits as the user types (keeps uncontrolled inputs clean). */
export function digitsOnly(e: FormEvent<HTMLInputElement>) {
  const el = e.currentTarget
  const cleaned = el.value.replace(/\D/g, '')
  if (cleaned !== el.value) el.value = cleaned
}
