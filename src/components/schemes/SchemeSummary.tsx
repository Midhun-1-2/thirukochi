import { motion } from 'framer-motion'
import { CalendarDays, CreditCard, Gem, IndianRupee, Receipt, type LucideIcon } from 'lucide-react'
import type { PaymentMethod, Scheme, SchemeSelection } from '@/data'
import { cn } from '@/lib/cn'
import { formatINR } from '@/lib/format'
import { luxuryEase, staggerContainer } from '@/lib/motion'
import { GoldCard } from '@/components/ui/GoldCard'
import { GoldDivider } from '@/components/ui/GoldDivider'

/* ------------------------------------------------------------------
   SchemeSummary — a display-case summary with gold dividers.
   compact: live preview beside the form
   full:    review card on the Details page
------------------------------------------------------------------- */

interface SchemeSummaryProps {
  scheme?: Scheme
  selection: Partial<SchemeSelection>
  paymentMethod?: PaymentMethod
  variant?: 'compact' | 'full'
  className?: string
  /** Animate rows sequentially on mount. */
  animated?: boolean
}

interface Row {
  icon: LucideIcon
  label: string
  value: string
  emphasis?: boolean
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: luxuryEase } },
}

export function SchemeSummary({ scheme, selection, paymentMethod, variant = 'full', className, animated = true }: SchemeSummaryProps) {
  const amount = selection.amount ?? 0
  const tenure = selection.tenure ?? 0
  const total = amount * tenure

  const rows: Row[] = [
    { icon: Gem, label: 'Scheme Name', value: scheme?.name ?? '—' },
    { icon: IndianRupee, label: 'Amount', value: amount ? formatINR(amount, { whole: true }) : '—', emphasis: true },
    { icon: CalendarDays, label: 'Tenure', value: tenure ? `${tenure} Months` : '—' },
    { icon: Receipt, label: 'Monthly Installment', value: amount ? formatINR(amount, { whole: true }) : '—' },
    { icon: CreditCard, label: 'Payment Method', value: paymentMethod?.label ?? '—' },
  ]

  return (
    <GoldCard variant="edge" padding={variant === 'compact' ? 'sm' : 'md'} className={cn('overflow-clip', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-muted">{variant === 'compact' ? 'Your selection' : 'Scheme summary'}</p>
          <p className="mt-1 font-display text-[19px] font-medium text-cream">{scheme?.name ?? 'Choose a scheme'}</p>
          {scheme && <p className="text-[12.5px] italic text-gold-pale">{scheme.tagline}</p>}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full gold-bg text-maroon-dark shadow-[0_6px_18px_rgba(249,223,50,0.25)]">
          <Gem size={18} strokeWidth={1.8} aria-hidden />
        </span>
      </div>

      <GoldDivider ornament className="my-4" />

      <motion.dl
        variants={staggerContainer(0.07, animated ? 0.15 : 0)}
        initial={animated ? 'hidden' : false}
        animate="show"
        className={cn('grid gap-x-6', variant === 'full' ? 'sm:grid-cols-2' : 'grid-cols-1')}
      >
        {rows.map((r) => (
          <motion.div key={r.label} variants={rowVariants} className="flex items-center justify-between gap-4 border-b border-[rgba(249,223,50,0.08)] py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
            <dt className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[12.5px] text-cream-muted">
              <r.icon size={15} strokeWidth={1.6} className="text-gold-muted" aria-hidden />
              {r.label}
            </dt>
            <dd className={cn('min-w-0 text-right lining-nums', r.emphasis ? 'font-display text-[20px] font-medium text-gold-bright' : 'text-[14px] font-medium text-cream')}>
              {r.value}
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      {amount > 0 && tenure > 0 && (
        <motion.div
          variants={rowVariants}
          initial={animated ? 'hidden' : false}
          animate="show"
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center justify-between rounded-[12px] bg-[rgba(249,223,50,0.07)] px-4 py-3"
        >
          <span className="text-[12.5px] text-cream-muted">Total contribution over {tenure} months</span>
          <span className="font-display text-[18px] font-medium text-cream lining-nums">{formatINR(total, { whole: true })}</span>
        </motion.div>
      )}
    </GoldCard>
  )
}
