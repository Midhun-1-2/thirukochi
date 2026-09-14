import { motion } from 'framer-motion'
import { ArrowRight, Coins, Receipt, Wallet as WalletIcon } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { getScheme, mockWallet } from '@/data'
import { formatINR } from '@/lib/format'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default function Wallet() {
  const { joined } = useSchemeFlow()
  const monthly = joined.reduce((sum, j) => sum + j.amount, 0)

  return (
    <PageTransition>
      <PageContainer className="py-5 sm:py-6 lg:py-8">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="show" className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <motion.div variants={staggerItem} className="lg:col-span-7">
            <GoldCard variant="edge" className="relative overflow-clip">
              <GoldGlow className="-right-20 -top-24" size={360} intensity={0.3} />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full gold-bg text-maroon-dark">
                    <WalletIcon size={20} strokeWidth={1.8} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gold-muted">Gold Wallet</p>
                    <h1 className="font-display text-[22px] font-medium text-cream">Your accumulated gold</h1>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[14px] bg-[rgba(13,0,0,0.35)] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cream-faint">Gold balance</p>
                    <p className="mt-1 font-display text-[34px] font-medium leading-none text-gold-bright lining-nums">
                      {mockWallet.goldGrams.toFixed(3)} <span className="text-[18px] text-gold-muted">g</span>
                    </p>
                  </div>
                  <div className="rounded-[14px] bg-[rgba(13,0,0,0.35)] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cream-faint">Indicative value</p>
                    <p className="mt-1 font-display text-[34px] font-medium leading-none text-cream lining-nums">{formatINR(mockWallet.valueINR, { whole: true })}</p>
                  </div>
                </div>

                <GoldDivider className="my-5" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[13px] text-cream-muted">
                    Monthly commitment across {joined.length} scheme{joined.length === 1 ? '' : 's'}:{' '}
                    <span className="font-medium text-gold-pale lining-nums">{formatINR(monthly, { whole: true })}</span>
                  </p>
                  <GoldButton size="sm" to={routes.joinScheme} iconRight={<ArrowRight />}>
                    Join Scheme
                  </GoldButton>
                </div>
                {mockWallet.isDemo && <p className="mt-3 text-[11px] text-cream-faint">Demo wallet · balances will reflect live data once connected.</p>}
              </div>
            </GoldCard>
          </motion.div>

          <motion.div variants={staggerItem} className="lg:col-span-5">
            <GoldCard className="h-full">
              <SectionHeading title="My Schemes" action={{ label: 'View all', to: routes.schemes }} className="mb-4" />
              {joined.length === 0 ? (
                <EmptyState icon={<Coins size={22} strokeWidth={1.5} aria-hidden />} title="No active schemes yet" text="Join a scheme and your instalments will appear here." />
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {joined.slice(0, 3).map((j) => (
                    <li key={j.id} className="flex items-center justify-between rounded-[12px] border border-[rgba(249,223,50,0.1)] bg-[rgba(13,0,0,0.3)] px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-cream">{getScheme(j.schemeId)?.name ?? 'Scheme'}</p>
                        <p className="text-[12px] text-cream-faint lining-nums">{j.tenure} months · {j.referenceNo}</p>
                      </div>
                      <p className="font-display text-[17px] font-medium text-gold-bright lining-nums">{formatINR(j.amount, { whole: true })}</p>
                    </li>
                  ))}
                </ul>
              )}
            </GoldCard>
          </motion.div>

          <motion.div variants={staggerItem} className="lg:col-span-12">
            <GoldCard>
              <SectionHeading title="Recent Transactions" className="mb-4" />
              {mockWallet.transactions.length === 0 ? (
                <EmptyState icon={<Receipt size={22} strokeWidth={1.5} aria-hidden />} title="No transactions yet" text="Your instalment history will be listed here." />
              ) : null}
            </GoldCard>
          </motion.div>
        </motion.div>
      </PageContainer>
    </PageTransition>
  )
}

export function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <motion.span
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-3 flex size-14 items-center justify-center rounded-full border border-dashed border-[rgba(249,223,50,0.35)] text-gold-muted"
      >
        {icon}
      </motion.span>
      <p className="font-display text-[18px] font-medium text-cream">{title}</p>
      <p className="mt-1 max-w-[32ch] text-[13px] text-cream-muted">{text}</p>
    </div>
  )
}
