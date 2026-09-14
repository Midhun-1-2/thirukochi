import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Delete, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { springSnappy, staggerContainer } from '@/lib/motion'

/* ------------------------------------------------------------------
   NumericKeypad — custom premium keypad (no browser keypad).
   1 2 3 / 4 5 6 / 7 8 9 / ⌫ 0 ✕
   Physical keyboard digits/backspace/escape also work.
------------------------------------------------------------------- */

interface NumericKeypadProps {
  onDigit: (d: string) => void
  onBackspace: () => void
  onClear: () => void
  disabled?: boolean
  className?: string
  /** Listen to the physical keyboard as well. */
  keyboard?: boolean
}

type Key = { kind: 'digit'; value: string } | { kind: 'backspace' } | { kind: 'clear' }

const layout: Key[] = [
  { kind: 'digit', value: '1' },
  { kind: 'digit', value: '2' },
  { kind: 'digit', value: '3' },
  { kind: 'digit', value: '4' },
  { kind: 'digit', value: '5' },
  { kind: 'digit', value: '6' },
  { kind: 'digit', value: '7' },
  { kind: 'digit', value: '8' },
  { kind: 'digit', value: '9' },
  { kind: 'backspace' },
  { kind: 'digit', value: '0' },
  { kind: 'clear' },
]

const keyVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
}

export function NumericKeypad({ onDigit, onBackspace, onClear, disabled, className, keyboard = true }: NumericKeypadProps) {
  useEffect(() => {
    if (!keyboard || disabled) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (/^\d$/.test(e.key)) onDigit(e.key)
      else if (e.key === 'Backspace') onBackspace()
      else if (e.key === 'Escape') onClear()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keyboard, disabled, onDigit, onBackspace, onClear])

  return (
    <motion.div
      role="group"
      aria-label="Numeric keypad"
      variants={staggerContainer(0.03, 0.2)}
      initial="hidden"
      animate="show"
      className={cn('grid grid-cols-3 gap-2.5 sm:gap-3', className)}
    >
      {layout.map((k, i) => {
        const isDigit = k.kind === 'digit'
        const label = isDigit ? k.value : k.kind === 'backspace' ? 'Backspace' : 'Clear'
        return (
          <motion.button
            key={i}
            type="button"
            variants={keyVariants}
            whileTap={disabled ? undefined : { scale: 0.92 }}
            transition={springSnappy}
            disabled={disabled}
            aria-label={isDigit ? undefined : label}
            onClick={() => {
              if (k.kind === 'digit') onDigit(k.value)
              else if (k.kind === 'backspace') onBackspace()
              else onClear()
            }}
            className={cn(
              'flex h-[52px] select-none items-center justify-center rounded-[16px] outline-none sm:h-[56px]',
              'transition-[border-color,box-shadow,background-color,color] duration-200',
              isDigit
                ? cn(
                    'border border-[rgba(249,223,50,0.16)] bg-[linear-gradient(180deg,rgba(84,0,0,0.55),rgba(38,0,0,0.75))] font-display text-[24px] font-medium text-cream',
                    'shadow-[inset_0_1px_0_rgba(249,223,50,0.08),0_6px_16px_rgba(0,0,0,0.35)]',
                    'hover:border-[rgba(249,223,50,0.4)] hover:text-gold-bright active:border-gold-bright active:bg-[rgba(249,223,50,0.1)]',
                    'focus-visible:border-gold-bright focus-visible:shadow-[0_0_0_3px_rgba(249,223,50,0.16)]',
                  )
                : cn(
                    'text-gold-muted hover:text-gold-bright hover:bg-[rgba(249,223,50,0.06)] active:bg-[rgba(249,223,50,0.1)]',
                    'focus-visible:shadow-[0_0_0_3px_rgba(249,223,50,0.16)]',
                  ),
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {isDigit ? (
              <span className="lining-nums">{k.value}</span>
            ) : k.kind === 'backspace' ? (
              <Delete size={22} strokeWidth={1.6} aria-hidden />
            ) : (
              <X size={20} strokeWidth={1.8} aria-hidden />
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
