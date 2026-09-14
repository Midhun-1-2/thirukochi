import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/cn'
import { springSoft } from '@/lib/motion'

/* ------------------------------------------------------------------
   GoldCard — a jewellery display case: deep maroon, metallic edge,
   soft inner glow. Variants keep the family related, not identical.
------------------------------------------------------------------- */

type Variant = 'default' | 'edge' | 'glass' | 'deep' | 'plain'
type Padding = 'none' | 'sm' | 'md' | 'lg'

export interface GoldCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: Variant
  padding?: Padding
  /** Subtle lift on hover. */
  interactive?: boolean
  /** Decorative gold corner ornament. */
  ornament?: boolean
  children?: ReactNode
}

const paddings: Record<Padding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

const variants: Record<Variant, string> = {
  default: 'surface',
  edge: 'surface gold-edge',
  glass: 'surface-glass',
  deep: 'surface-deep',
  plain: 'bg-[rgba(38,0,0,0.5)] border border-[rgba(249,223,50,0.1)]',
}

export const GoldCard = forwardRef<HTMLDivElement, GoldCardProps>(function GoldCard(
  { variant = 'default', padding = 'md', interactive, ornament, className, children, ...rest },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      whileHover={interactive ? { y: -3 } : undefined}
      transition={springSoft}
      className={cn('relative rounded-[var(--radius-lg)]', variants[variant], paddings[padding], className)}
      {...rest}
    >
      {ornament && <CornerOrnament />}
      {children}
    </motion.div>
  )
})

function CornerOrnament() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-3 top-3 h-10 w-10 text-gold-bright/40"
      viewBox="0 0 40 40"
      fill="none"
    >
      <path d="M2 38V14a12 12 0 0 1 12-12h24" stroke="url(#corner-grad)" strokeWidth="1" />
      <circle cx="38" cy="2" r="1.6" fill="currentColor" />
      <circle cx="2" cy="38" r="1.6" fill="currentColor" />
      <defs>
        <linearGradient id="corner-grad" x1="2" y1="38" x2="38" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9DF32" stopOpacity="0" />
          <stop offset="0.5" stopColor="#F9DF32" stopOpacity="0.8" />
          <stop offset="1" stopColor="#F9DF32" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
