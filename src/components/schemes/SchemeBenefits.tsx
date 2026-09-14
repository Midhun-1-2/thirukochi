import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { luxuryEase, staggerContainer } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ------------------------------------------------------------------
   SchemeBenefits — benefit list with animated, drawn-in gold checks.
   Copy is placeholder; no financial promises are made here.
------------------------------------------------------------------- */

interface SchemeBenefitsProps {
  benefits: string[]
  className?: string
  delay?: number
  columns?: 1 | 2
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: luxuryEase } },
}

export function SchemeBenefits({ benefits, className, delay = 0, columns = 1 }: SchemeBenefitsProps) {
  const reduced = useReducedMotion()
  return (
    <motion.ul
      variants={staggerContainer(0.12, delay)}
      initial="hidden"
      animate="show"
      className={cn('grid gap-3', columns === 2 && 'sm:grid-cols-2', className)}
      aria-label="Benefits"
    >
      {benefits.map((b, i) => (
        <motion.li key={b} variants={itemVariants} className="flex items-center gap-3 rounded-[12px] border border-[rgba(249,223,50,0.1)] bg-[rgba(13,0,0,0.3)] px-3.5 py-3">
          <span className="relative flex size-7 shrink-0 items-center justify-center">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-gold-bright/60 bg-[rgba(249,223,50,0.08)]"
              initial={reduced ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22, delay: delay + 0.12 * i + 0.1 }}
            />
            <svg viewBox="0 0 24 24" className="relative size-4 text-gold-bright" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <motion.path
                d="M5 12.5l4.2 4.2L19 7"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: luxuryEase, delay: delay + 0.12 * i + 0.25 }}
              />
            </svg>
          </span>
          <span className="text-[14px] text-cream">{b}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}
