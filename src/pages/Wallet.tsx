import { ArrowRight, Coins, Gift, Receipt, Wallet as WalletIcon } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { getScheme, mockPayments, mockReferralCredits, mockWallet, paymentsMockConfig, type ReferralCredit } from '@/data'
import { cn } from '@/lib/cn'
import { formatDate, formatINR } from '@/lib/format'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PaymentRow } from './Payments'

/* ------------------------------------------------------------------
   Wallet — compact by design: the balance hero, active schemes and
   recent transactions fit a single phone screen.
------------------------------------------------------------------- */

type LedgerEntry = { date: string } & ({ kind: 'payment'; payment: (typeof mockPayments)[number] } | { kind: 'referral'; credit: ReferralCredit })

export default function Wallet() {
  const { joined } = useSchemeFlow()
  const monthly = joined.reduce((sum, j) => sum + j.amount, 0)
  const paid = paymentsMockConfig.simulateEmpty ? [] : mockPayments.filter((p) => p.status === 'paid')
  const credited = mockReferralCredits.filter((c) => c.status === 'credited')
  const recent: LedgerEntry[] = [...paid.map((payment) => ({ kind: 'payment' as const, date: payment.date, payment })), ...credited.map((credit) => ({ kind: 'referral' as const, date: credit.date, credit }))]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <PageTransition>
      <PageContainer className="py-4 sm:py-6 lg:py-8">
        <StaggerContainer stagger={0.06} className="grid gap-3.5 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          <StaggerItem className="lg:col-span-7">
            <GoldCard variant="edge" padding="sm" className="relative overflow-clip sm:p-6">
              <GoldGlow className="-right-20 -top-24" size={360} intensity={0.3} />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full gold-bg text-maroon-dark sm:size-11">
                    <WalletIcon size={19} strokeWidth={1.8} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] uppercase tracking-[0.2em] text-gold-muted">Gold Wallet</p>
                    <h1 className="truncate font-display text-[19px] font-medium leading-tight text-cream sm:text-[22px]">Your accumulated gold</h1>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
                  <Stat label="Gold" compact>
                    <span className="text-gold-bright">{mockWallet.goldGrams.toFixed(3)}</span> <span className="text-[13px] text-gold-muted sm:text-[16px]">g</span>
                  </Stat>
                  <Stat label="Value" compact>
                    {formatINR(mockWallet.valueINR, { whole: true })}
                  </Stat>
                  <Stat label="Referral" compact>
                    <span className="text-gold-bright">{formatINR(mockWallet.referralEarningsINR, { whole: true })}</span>
                  </Stat>
                </div>

                <GoldDivider className="my-4 sm:my-5" />
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <p className="text-[12.5px] text-cream-muted sm:text-[13px]">
                    Monthly commitment · {joined.length} scheme{joined.length === 1 ? '' : 's'}:{' '}
                    <span className="font-medium text-gold-pale lining-nums">{formatINR(monthly, { whole: true })}</span>
                  </p>
                  <GoldButton size="sm" to={routes.joinScheme} iconRight={<ArrowRight />}>
                    Join Scheme
                  </GoldButton>
                </div>
                {mockWallet.isDemo && <p className="mt-2.5 text-[10.5px] text-cream-faint sm:text-[11px]">Demo wallet · balances will reflect live data once connected.</p>}
              </div>
            </GoldCard>
          </StaggerItem>

          <StaggerItem className="lg:col-span-5">
            <GoldCard padding="sm" className="h-full sm:p-6">
              <SectionHeading title="My Schemes" action={{ label: 'View all', to: routes.schemes }} className="mb-3" />
              {joined.length === 0 ? (
                <EmptyState icon={<Coins size={20} strokeWidth={1.5} aria-hidden />} title="No active schemes yet" text="Join a scheme and your instalments will appear here." />
              ) : (
                <ul className="flex flex-col gap-2">
                  {joined.slice(0, 3).map((j) => (
                    <li key={j.id} className="flex items-center justify-between gap-3 rounded-[12px] border border-[rgba(249,223,50,0.1)] bg-[rgba(13,0,0,0.3)] px-3.5 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-cream">{getScheme(j.schemeId)?.name ?? 'Scheme'}</p>
                        <p className="text-[11.5px] text-cream-faint lining-nums">{j.tenure} months · {j.referenceNo}</p>
                      </div>
                      <p className="shrink-0 font-display text-[16px] font-medium text-gold-bright lining-nums">{formatINR(j.amount, { whole: true })}</p>
                    </li>
                  ))}
                </ul>
              )}
            </GoldCard>
          </StaggerItem>

          <StaggerItem className="lg:col-span-12">
            <GoldCard padding="sm" className="sm:p-6">
              <SectionHeading title="Recent Transactions" action={recent.length ? { label: 'View all', to: routes.payments } : undefined} className="mb-1" />
              {recent.length === 0 ? (
                <EmptyState icon={<Receipt size={20} strokeWidth={1.5} aria-hidden />} title="No transactions yet" text="Your instalment history will be listed here." inline />
              ) : (
                <ol className="divide-y divide-[rgba(249,223,50,0.08)]" aria-label="Recent transactions">
                  {recent.map((entry, i) =>
                    entry.kind === 'payment' ? (
                      <PaymentRow key={entry.payment.id} payment={entry.payment} compact className={cn(i === 2 && 'hidden sm:flex')} />
                    ) : (
                      <ReferralRow key={entry.credit.id} credit={entry.credit} className={cn(i === 2 && 'hidden sm:flex')} />
                    ),
                  )}
                </ol>
              )}
            </GoldCard>
          </StaggerItem>
        </StaggerContainer>
      </PageContainer>
    </PageTransition>
  )
}

function Stat({ label, children, compact }: { label: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className="min-w-0 rounded-[14px] bg-[rgba(13,0,0,0.35)] px-2.5 py-2.5 sm:p-4">
      <p className="truncate text-[9px] uppercase tracking-[0.14em] text-cream-faint sm:text-[11px]">{label}</p>
      <p
        className={cn(
          'mt-1 truncate font-display font-medium leading-none text-cream lining-nums',
          compact ? 'text-[16px] sm:text-[24px]' : 'text-[24px] sm:text-[34px]',
        )}
      >
        {children}
      </p>
    </div>
  )
}

/** One referral-bonus row, styled to match PaymentRow's compact ledger entry. */
function ReferralRow({ credit, className }: { credit: ReferralCredit; className?: string }) {
  return (
    <li className={cn('flex items-center gap-3 py-2', className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold-bright/50 bg-[rgba(249,223,50,0.08)] text-gold-bright sm:size-10">
        <Gift size={16} strokeWidth={1.7} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-cream sm:text-[14px]">Referral bonus</span>
        <span className="block truncate text-[11.5px] text-cream-faint sm:text-[12px]">{credit.friendName} joined</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-display text-[15px] font-medium text-gold-bright lining-nums sm:text-[17px]">+{formatINR(credit.amount, { whole: true })}</span>
        <span className="block text-[11px] text-cream-faint lining-nums">{formatDate(credit.date)}</span>
      </span>
    </li>
  )
}

/**
 * Designed empty state. `inline` lays icon and copy side by side —
 * a single low row for sections that merely need a placeholder.
 */
export function EmptyState({ icon, title, text, inline }: { icon: React.ReactNode; title: string; text: string; inline?: boolean }) {
  return (
    <div className={cn('flex items-center', inline ? 'gap-4 px-1 py-2 text-left' : 'flex-col px-4 py-5 text-center sm:py-7')}>
      <span
        className={cn(
          'animate-float flex shrink-0 items-center justify-center rounded-full border border-dashed border-[rgba(249,223,50,0.35)] text-gold-muted',
          inline ? 'size-11' : 'mb-3 size-12 sm:size-14',
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-[16px] font-medium text-cream sm:text-[18px]">{title}</p>
        <p className={cn('mt-0.5 text-[12.5px] text-cream-muted sm:text-[13px]', !inline && 'mx-auto max-w-[32ch]')}>{text}</p>
      </div>
    </div>
  )
}
