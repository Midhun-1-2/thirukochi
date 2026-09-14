import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'
import { shakeVariants } from '@/lib/motion'

/* ------------------------------------------------------------------
   GoldInput — floating-label field on a dark maroon surface.
   Gold icon, gold focus ring, animated error message.
   Works uncontrolled with react-hook-form `register`.
------------------------------------------------------------------- */

export interface GoldInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  icon?: ReactNode
  /** Right-side slot (e.g. visibility toggle). */
  trailing?: ReactNode
  /** Left-side fixed text, e.g. currency symbol or "+91". */
  prefix?: string
  error?: string
  hint?: string
  containerClassName?: string
}

export const GoldInput = forwardRef<HTMLInputElement, GoldInputProps>(function GoldInput(
  { label, icon, trailing, prefix, error, hint, id, className, containerClassName, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `input-${autoId}`
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const hasIcon = Boolean(icon)

  return (
    <motion.div
      className={cn('group/field w-full', containerClassName)}
      variants={shakeVariants}
      animate={error ? 'shake' : 'idle'}
    >
      <div
        className={cn(
          'relative flex h-[58px] items-center rounded-[14px] transition-[border-color,box-shadow,background-color] duration-300',
          'bg-[rgba(38,0,0,0.55)] border',
          error
            ? 'border-rose/70 shadow-[0_0_0_3px_rgba(240,160,140,0.12)]'
            : 'border-[rgba(249,223,50,0.22)] group-focus-within/field:border-gold-bright/80 group-focus-within/field:shadow-[0_0_0_3px_rgba(249,223,50,0.12),0_8px_30px_rgba(249,223,50,0.08)] hover:border-[rgba(249,223,50,0.38)]',
        )}
      >
        {hasIcon && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-[color,transform] duration-300',
              'text-gold-muted group-focus-within/field:text-gold-bright group-focus-within/field:-translate-x-0.5 [&>svg]:size-[19px]',
              error && 'text-rose',
            )}
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'peer h-full w-full bg-transparent pt-5 pb-1 text-[15px] text-cream outline-none',
            'placeholder-transparent caret-gold-bright',
            hasIcon ? 'pl-[46px]' : 'pl-4',
            trailing ? 'pr-12' : 'pr-4',
            prefix && (hasIcon ? 'pl-[76px]' : 'pl-[42px]'),
            className,
          )}
          {...rest}
        />

        {prefix && (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-[29px] text-[15px] font-medium text-gold-muted opacity-0 transition-opacity duration-200',
              'peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100',
              hasIcon ? 'left-[46px]' : 'left-4',
            )}
          >
            {prefix}
          </span>
        )}

        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 origin-left text-[14.5px] text-cream-faint',
            'transition-[transform,color,top] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            hasIcon ? 'left-[46px]' : 'left-4',
            'peer-focus:top-[17px] peer-focus:scale-[0.78] peer-focus:text-gold-muted',
            'peer-[:not(:placeholder-shown)]:top-[17px] peer-[:not(:placeholder-shown)]:scale-[0.78] peer-[:not(:placeholder-shown)]:text-gold-muted',
            error && 'peer-[:not(:placeholder-shown)]:text-rose peer-focus:text-rose',
          )}
        >
          {label}
        </label>

        {trailing && <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</span>}
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
          <motion.p
            key="hint"
            id={hintId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pl-1 pt-1.5 text-[12px] text-cream-faint"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
})
