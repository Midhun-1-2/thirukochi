import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, CheckCircle2, CircleAlert, ReceiptIndianRupee } from 'lucide-react'
import { getPaymentMethod, getScheme, mockPayments, paymentsMockConfig, type Payment, type PaymentStatus } from '@/data'
import { cn } from '@/lib/cn'
import { useEntrance } from '@/lib/entrance'
import { formatDate, formatINR } from '@/lib/format'
import { luxuryEase, springSoft } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldBadge } from '@/components/ui/GoldBadge'
import { GoldCard } from '@/components/ui/GoldCard'
import { EmptyState } from './Wallet'

/* ------------------------------------------------------------------
   Payment History — every instalment, paid and upcoming.
   Summary strip → filter → ledger. Fits one phone screen.
------------------------------------------------------------------- */

const filters: { id: 'all' | PaymentStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'upcoming', label: 'Upcoming' },
]

export default function Payments() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const entrance = useEntrance()
  const all = paymentsMockConfig.simulateEmpty ? [] : mockPayments
  const items = filter === 'all' ? all : all.filter((p) => p.status === filter)

  const paid = all.filter((p) => p.status === 'paid')
  const totalPaid = paid.reduce((s, p) => s + p.amount, 0)
  const next = all.filter((p) => p.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))[0]
  const plan = paid[0]

  return (
    <PageTransition>
      <PageContainer className="py-4 sm:py-6 lg:py-8">
        <div className="mx-auto max-w-[860px]">
          <motion.div
            initial={entrance ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: luxuryEase }}
            className="mb-3 flex items-baseline gap-3 sm:mb-5 sm:block"
          >
            <h1 className="font-display text-[clamp(24px,4vw,34px)] font-medium leading-tight text-cream sm:mt-1">Payment History</h1>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-muted sm:order-first">Instalments</p>
          </motion.div>

          {/* summary */}
          <dl className="mb-3 grid grid-cols-3 gap-2 sm:mb-5 sm:gap-3">
            <Stat label="Total paid" value={formatINR(totalPaid, { whole: true })} gold />
            <Stat label="Instalments" value={plan ? `${paid.length} of ${plan.ofInstallments}` : '—'} />
            <Stat label="Next due" value={next ? formatDate(next.date) : '—'} sub={next ? formatINR(next.amount, { whole: true }) : undefined} />
          </dl>

          <div role="tablist" aria-label="Filter payments" className="scrollbar-none -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:mb-5 sm:px-0">
            {filters.map((f) => {
              const active = f.id === filter
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'relative h-9 shrink-0 rounded-full border px-3.5 text-[12px] font-medium transition-colors sm:h-10 sm:px-4 sm:text-[12.5px]',
                    active ? 'border-transparent text-maroon-dark' : 'border-[rgba(249,223,50,0.2)] text-cream-muted hover:text-cream',
                  )}
                >
                  {active && <motion.span layoutId="payments-filter" transition={springSoft} className="absolute inset-0 rounded-full gold-bg" />}
                  <span className="relative">{f.label}</span>
                </button>
              )
            })}
          </div>

          <GoldCard padding="none">
            {items.length === 0 ? (
              <div className="p-4 sm:p-6">
                <EmptyState icon={<ReceiptIndianRupee size={20} strokeWidth={1.5} aria-hidden />} title="No payments yet" text="Your instalments will be listed here once a scheme is active." />
              </div>
            ) : (
              <ol className="divide-y divide-[rgba(249,223,50,0.08)] p-1.5 sm:p-2" aria-label="Payments">
                {items.map((p) => (
                  <PaymentRow key={p.id} payment={p} />
                ))}
              </ol>
            )}
          </GoldCard>

          {paymentsMockConfig.isDemo && <p className="mt-3 text-center text-[11px] text-cream-faint">Demo ledger · live payments will appear here once connected.</p>}
        </div>
      </PageContainer>
    </PageTransition>
  )
}

function Stat({ label, value, sub, gold }: { label: string; value: string; sub?: string; gold?: boolean }) {
  return (
    <div className="min-w-0 rounded-[14px] border border-[rgba(249,223,50,0.1)] bg-[rgba(38,0,0,0.5)] px-3 py-2.5 sm:px-4 sm:py-3">
      <dt className="truncate text-[10px] uppercase tracking-[0.16em] text-cream-faint sm:text-[10.5px]">{label}</dt>
      <dd className={cn('mt-0.5 truncate font-display text-[16px] font-medium leading-tight lining-nums sm:text-[19px]', gold ? 'text-gold-bright' : 'text-cream')}>
        {value}
      </dd>
      {sub && <dd className="truncate text-[11px] text-gold-pale lining-nums">{sub}</dd>}
    </div>
  )
}

const statusMeta: Record<PaymentStatus, { icon: typeof CheckCircle2; label: string; tone: 'live' | 'outline' | 'muted' }> = {
  paid: { icon: CheckCircle2, label: 'Paid', tone: 'live' },
  upcoming: { icon: CalendarClock, label: 'Upcoming', tone: 'outline' },
  failed: { icon: CircleAlert, label: 'Failed', tone: 'muted' },
}

/** One ledger row; also reused by the Wallet's recent-transactions card. */
export function PaymentRow({ payment: p, compact, className }: { payment: Payment; compact?: boolean; className?: string }) {
  const meta = statusMeta[p.status]
  const Icon = meta.icon
  const upcoming = p.status === 'upcoming'
  return (
    <li className={cn('flex items-center gap-3', compact ? 'py-2' : 'px-2 py-2.5 sm:px-3 sm:py-3', className)}>
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full border sm:size-10',
          upcoming ? 'border-[rgba(249,223,50,0.28)] text-gold-muted' : 'border-gold-bright/50 bg-[rgba(249,223,50,0.08)] text-gold-bright',
        )}
      >
        <Icon size={17} strokeWidth={1.7} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-cream sm:text-[14px]">{getScheme(p.schemeId)?.name ?? 'Scheme'}</span>
        <span className="block truncate text-[11.5px] text-cream-faint lining-nums sm:text-[12px]">
          Instalment {p.installmentNo} of {p.ofInstallments} · {getPaymentMethod(p.paymentMethodId)?.label ?? '—'}
          {!compact && <span className="hidden sm:inline"> · {p.referenceNo}</span>}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className={cn('block font-display text-[15px] font-medium lining-nums sm:text-[17px]', upcoming ? 'text-cream' : 'text-gold-bright')}>
          {formatINR(p.amount, { whole: true })}
        </span>
        <span className="flex items-center justify-end gap-1.5 text-[11px] text-cream-faint lining-nums">
          {upcoming ? 'Due ' : ''}
          {formatDate(p.date)}
          {!compact && upcoming && (
            <GoldBadge tone={meta.tone} className="hidden h-5 px-2 text-[9.5px] sm:inline-flex">
              {meta.label}
            </GoldBadge>
          )}
        </span>
      </span>
    </li>
  )
}
