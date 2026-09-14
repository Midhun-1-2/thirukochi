import { motion } from 'framer-motion'
import { CalendarDays, CreditCard, Gem, IndianRupee, Receipt, type LucideIcon } from 'lucide-react'
import type { PaymentMethod, Scheme, SchemeSelection } from '@/data'
import { cn } from '@/lib/cn'
import { useEntrance } from '@/lib/entrance'
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
  /** strip — a single low band with the three key figures (mobile live preview). */
  variant?: 'compact' | 'full' | 'strip'
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

export function SchemeSummary({ scheme, selection, paymentMethod, variant = 'full', className, animated: animatedProp = true }: SchemeSummaryProps) {
  const entrance = useEntrance()
  const animated = animatedProp && entrance
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

  if (variant === 'strip') {
    const tiles = [
      { label: 'Monthly', value: amount ? formatINR(amount, { whole: true }) : '—', gold: true },
      { label: 'Tenure', value: tenure ? `${tenure} Months` : '—' },
      { label: 'Total', value: amount && tenure ? formatINR(total, { whole: true }) : '—' },
      { label: 'Payment', value: paymentMethod?.label ?? '—', wide: true },
    ]
    return (
      <GoldCard variant="edge" padding="sm" className={cn('overflow-clip lg:px-6', className)}>
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex items-center gap-3 lg:w-[300px] lg:shrink-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full gold-bg text-maroon-dark shadow-[0_6px_18px_rgba(249,223,50,0.25)] lg:size-10">
              <Gem size={16} strokeWidth={1.8} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-gold-muted">Your selection</p>
              <p className="truncate font-display text-[16px] font-medium leading-tight text-cream lg:text-[18px]">{scheme?.name ?? 'Choose a scheme'}</p>
              {scheme && <p className="hidden truncate text-[12px] italic text-gold-pale lg:block">{scheme.tagline}</p>}
            </div>
            <span className="shrink-0 text-[11.5px] text-cream-faint lg:hidden">{paymentMethod?.label ?? '—'}</span>
          </div>
          <dl className="grid grid-cols-3 gap-2 lg:flex-1 lg:grid-cols-4 lg:gap-3">
            {tiles.map((f) => (
              <div key={f.label} className={cn('min-w-0 rounded-[12px] bg-[rgba(13,0,0,0.35)] px-2.5 py-1.5 lg:px-3.5 lg:py-2.5', f.wide && 'hidden lg:block')}>
                <dt className="truncate text-[9.5px] uppercase tracking-[0.14em] text-cream-faint lg:text-[10.5px]">{f.label}</dt>
                <dd className={cn('truncate font-display text-[15px] font-medium lining-nums lg:text-[17px]', f.gold ? 'text-gold-bright' : 'text-cream')}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </GoldCard>
    )
  }

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
        className={cn('grid gap-x-4 sm:gap-x-6', variant === 'full' ? 'grid-cols-2' : 'grid-cols-1')}
      >
        {rows.map((r) => (
          <motion.div
            key={r.label}
            variants={rowVariants}
            className={cn(
              'flex border-b border-[rgba(249,223,50,0.08)] py-2.5 last:border-b-0 sm:py-3',
              variant === 'full'
                ? 'flex-col items-start gap-0.5 [&:nth-last-child(2)]:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4'
                : 'items-center justify-between gap-4',
              // the card header already carries the name; the row is desktop-only
              variant === 'full' && r.label === 'Scheme Name' && 'hidden sm:col-span-2 sm:flex',
            )}
          >
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
