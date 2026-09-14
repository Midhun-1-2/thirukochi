import { forwardRef, useCallback, useId, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleAlert, Phone } from 'lucide-react'
import { cn } from '@/lib/cn'
import { digitsOnly } from '@/lib/inputs'
import { shakeVariants, springSnappy } from '@/lib/motion'

/* ------------------------------------------------------------------
   PhoneInput — the Indian mobile number field used for registration
   and login. A gold "+91" country chip, spaced tabular digits, a gold
   progress line that fills as the ten digits are typed, and a check
   once the number is complete. Uncontrolled (react-hook-form ready).
------------------------------------------------------------------- */

const DIGITS = 10

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'prefix'> {
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { label = 'Phone Number', error, hint, id, className, containerClassName, onInput, onChange, disabled, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `phone-${autoId}`
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const [digits, setDigits] = useState(0)
  const complete = digits === DIGITS

  // Forward the ref, then read the value the form library may have just set (default values).
  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      if (typeof ref === 'function') ref(el)
      else if (ref) ref.current = el
      if (el) setDigits(el.value.replace(/\D/g, '').length)
    },
    [ref],
  )

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    digitsOnly(e)
    setDigits(e.currentTarget.value.length)
    onInput?.(e as Parameters<NonNullable<typeof onInput>>[0])
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDigits(e.currentTarget.value.length)
    onChange?.(e)
  }

  return (
    <motion.div className={cn('group/field w-full', containerClassName)} variants={shakeVariants} animate={error ? 'shake' : 'idle'}>
      <div
        className={cn(
          'relative flex h-[58px] items-center overflow-clip rounded-[14px] border pl-4 pr-3 transition-[border-color,box-shadow] duration-300',
          'bg-[rgba(38,0,0,0.55)]',
          error
            ? 'border-rose/70 shadow-[0_0_0_3px_rgba(240,160,140,0.12)]'
            : cn(
                'border-[rgba(249,223,50,0.22)] hover:border-[rgba(249,223,50,0.38)]',
                'group-focus-within/field:border-gold-bright/80 group-focus-within/field:shadow-[0_0_0_3px_rgba(249,223,50,0.12),0_8px_30px_rgba(249,223,50,0.08)]',
                complete && 'border-[rgba(249,223,50,0.45)]',
              ),
          disabled && 'opacity-60',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'shrink-0 text-gold-muted transition-[color,transform] duration-300 group-focus-within/field:-translate-x-0.5 group-focus-within/field:text-gold-bright',
            error && 'text-rose',
          )}
        >
          <Phone size={19} strokeWidth={1.7} />
        </span>

        {/* country chip */}
        <span
          aria-hidden
          className={cn(
            'ml-3 flex h-8 shrink-0 items-center gap-1.5 rounded-[9px] border px-2.5 font-display text-[14px] font-medium tracking-[0.04em] transition-colors duration-300 lining-nums',
            'border-[rgba(249,223,50,0.22)] bg-[rgba(249,223,50,0.06)] text-gold-pale',
            'group-focus-within/field:border-[rgba(249,223,50,0.45)] group-focus-within/field:text-gold-bright',
          )}
        >
          <span className="size-1.5 rounded-full gold-bg shadow-[0_0_6px_rgba(249,223,50,0.8)]" />
          +91
        </span>
        <span aria-hidden className="mx-3 h-6 w-px shrink-0 bg-[rgba(249,223,50,0.16)]" />

        <div className="relative h-full min-w-0 flex-1">
          <input
            ref={setRef}
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={DIGITS}
            placeholder=" "
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            onInput={handleInput}
            onChange={handleChange}
            className={cn(
              'peer h-full w-full bg-transparent pt-5 pb-1 text-[16px] font-medium tracking-[0.1em] text-cream outline-none lining-nums',
              'placeholder-transparent caret-gold-bright',
              className,
            )}
            {...rest}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'pointer-events-none absolute left-0 top-1/2 origin-left -translate-y-1/2 text-[14.5px] tracking-normal text-cream-faint',
              'transition-[transform,color,top] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'peer-focus:top-[17px] peer-focus:scale-[0.78] peer-focus:text-gold-muted',
              'peer-[:not(:placeholder-shown)]:top-[17px] peer-[:not(:placeholder-shown)]:scale-[0.78] peer-[:not(:placeholder-shown)]:text-gold-muted',
              error && 'peer-[:not(:placeholder-shown)]:text-rose peer-focus:text-rose',
            )}
          >
            {label}
          </label>
        </div>

        {/* completion check */}
        <span className="ml-2 flex size-7 shrink-0 items-center justify-center" aria-hidden>
          <AnimatePresence>
            {complete && !error && (
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={springSnappy}
                className="flex size-6 items-center justify-center rounded-full gold-bg text-maroon-dark shadow-[0_4px_14px_rgba(249,223,50,0.35)]"
              >
                <Check size={13} strokeWidth={2.8} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* gold progress line: fills as the ten digits are typed */}
        <span aria-hidden className="pointer-events-none absolute inset-x-4 bottom-0 h-[2px] overflow-clip rounded-full bg-[rgba(249,223,50,0.1)]">
          <span
            className={cn('block h-full w-full origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]', error ? 'bg-rose' : 'gold-bg')}
            style={{ transform: `scaleX(${Math.min(digits, DIGITS) / DIGITS})` }}
          />
        </span>
      </div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="error"
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5 overflow-clip pl-1 text-[12.5px] text-rose"
          >
            <CircleAlert size={14} className="mt-[7px] shrink-0 self-start" aria-hidden />
            <span className="pt-1.5">{error}</span>
          </motion.p>
        ) : hint ? (
          <motion.p key="hint" id={hintId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pl-1 pt-1.5 text-[12px] text-cream-faint">
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
})
