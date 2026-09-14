import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { shakeVariants, springSnappy } from '@/lib/motion'

/* ------------------------------------------------------------------
   OTPInput — 6 premium boxes. Auto-advance, backspace, arrows,
   paste, SMS autofill. Digit pop, gold glow, error shake.
------------------------------------------------------------------- */

type Status = 'idle' | 'error' | 'success'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (code: string) => void
  onComplete?: (code: string) => void
  status?: Status
  disabled?: boolean
  autoFocus?: boolean
  label?: string
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  status = 'idle',
  disabled,
  autoFocus = true,
  label = 'One-time password',
}: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [focused, setFocused] = useState<number | null>(null)
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const update = (next: string[]) => {
    const code = next.join('')
    onChange(code)
    if (code.length === length && !next.includes('')) onComplete?.(code)
  }

  const focusAt = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))]
    el?.focus()
    el?.select()
  }

  const handleInput = (i: number, raw: string) => {
    const clean = raw.replace(/\D/g, '')
    if (!clean) {
      const next = [...digits]
      next[i] = ''
      update(next)
      return
    }
    // Multiple chars (autofill / fast typing) — distribute forward
    const next = [...digits]
    let cursor = i
    for (const ch of clean) {
      if (cursor >= length) break
      next[cursor] = ch
      cursor++
    }
    update(next)
    focusAt(Math.min(cursor, length - 1))
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...digits]
      if (next[i]) {
        next[i] = ''
        update(next)
      } else if (i > 0) {
        next[i - 1] = ''
        update(next)
        focusAt(i - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(i - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(i + 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusAt(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusAt(length - 1)
    }
  }

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    handleInput(i, text)
  }

  return (
    <motion.div
      role="group"
      aria-label={label}
      variants={shakeVariants}
      animate={status === 'error' ? 'shake' : 'idle'}
      className="flex items-center justify-between gap-2 xs:gap-2.5 sm:gap-3"
    >
      {digits.map((d, i) => {
        const filled = d !== ''
        const isFocused = focused === i
        return (
          <div key={i} className="relative flex-1">
            <input
              ref={(el) => {
                refs.current[i] = el
              }}
              value={d}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              onFocus={(e) => {
                setFocused(i)
                e.target.select()
              }}
              onBlur={() => setFocused(null)}
              disabled={disabled}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${i + 1} of ${length}`}
              aria-invalid={status === 'error' || undefined}
              className={cn(
                'peer h-14 w-full rounded-[14px] border bg-[rgba(38,0,0,0.6)] text-center font-display text-[24px] font-medium text-transparent caret-gold-bright outline-none',
                'transition-[border-color,box-shadow,background-color] duration-300 lining-nums xs:h-[60px] sm:h-16',
                status === 'error'
                  ? 'border-rose/70 shadow-[0_0_0_3px_rgba(240,160,140,0.12)]'
                  : status === 'success'
                    ? 'border-gold-bright bg-[rgba(249,223,50,0.08)] shadow-[0_0_0_3px_rgba(249,223,50,0.14),0_0_24px_rgba(249,223,50,0.25)]'
                    : filled
                      ? 'border-gold/80 shadow-[0_0_14px_rgba(249,223,50,0.12)]'
                      : 'border-[rgba(249,223,50,0.22)]',
                isFocused && status !== 'error' && 'border-gold-bright shadow-[0_0_0_3px_rgba(249,223,50,0.14),0_0_22px_rgba(249,223,50,0.2)]',
                disabled && 'opacity-60',
              )}
            />
            {/* visible digit with pop animation (input text is transparent) */}
            <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[24px] font-medium lining-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                {filled && (
                  <motion.span
                    key={`${i}-${d}`}
                    initial={{ scale: 0.4, opacity: 0, y: 6 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={springSnappy}
                    className={cn(status === 'success' ? 'text-gold-bright' : status === 'error' ? 'text-rose' : 'text-cream')}
                  >
                    {d}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            {/* idle placeholder dot */}
            {!filled && !isFocused && (
              <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(249,223,50,0.28)]" />
            )}
          </div>
        )
      })}
    </motion.div>
  )
}
