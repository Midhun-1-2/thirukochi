import { motion } from 'framer-motion'
import { ArrowRight, Gem, ShieldCheck } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { getPaymentMethod, getScheme, mockSchemes } from '@/data'
import { cn } from '@/lib/cn'
import { formatINR } from '@/lib/format'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldBadge } from '@/components/ui/GoldBadge'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from './Wallet'

export default function Schemes() {
  const { joined } = useSchemeFlow()

  return (
    <PageTransition>
      <PageContainer className="py-5 sm:py-6 lg:py-8">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="show" className="flex flex-col gap-8">
          {/* My schemes */}
          <motion.section variants={staggerItem} aria-labelledby="my-schemes">
            <SectionHeading title="My Schemes" eyebrow="Your plans" className="mb-4" />
            {joined.length === 0 ? (
              <GoldCard>
                <EmptyState icon={<Gem size={22} strokeWidth={1.5} aria-hidden />} title="No schemes joined yet" text="Pick a scheme below to begin your gold journey." />
              </GoldCard>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {joined.map((j) => {
                  const s = getScheme(j.schemeId)
                  return (
                    <li key={j.id}>
                      <GoldCard variant="edge" ornament className="h-full">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-[19px] font-medium text-cream">{s?.name ?? 'Scheme'}</p>
                            <p className="text-[12px] text-cream-faint lining-nums">Ref {j.referenceNo}</p>
                          </div>
                          <GoldBadge tone="live">Active</GoldBadge>
                        </div>
                        <dl className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
                          <div>
                            <dt className="text-cream-faint">Monthly</dt>
                            <dd className="font-display text-[17px] font-medium text-gold-bright lining-nums">{formatINR(j.amount, { whole: true })}</dd>
                          </div>
                          <div>
                            <dt className="text-cream-faint">Tenure</dt>
                            <dd className="font-display text-[17px] font-medium text-cream lining-nums">{j.tenure} mo</dd>
                          </div>
                          <div>
                            <dt className="text-cream-faint">Payment</dt>
                            <dd className="truncate text-[13px] font-medium text-cream">{getPaymentMethod(j.paymentMethodId)?.label ?? '—'}</dd>
                          </div>
                        </dl>
                      </GoldCard>
                    </li>
                  )
                })}
              </ul>
            )}
          </motion.section>

          {/* Catalogue */}
          <motion.section variants={staggerItem} aria-labelledby="available-schemes">
            <SectionHeading title="Available Schemes" eyebrow="Explore" className="mb-4" />
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {mockSchemes.map((s, i) => (
                <li key={s.id}>
                  <GoldCard
                    variant={s.accent === 'maroon' ? 'edge' : 'default'}
                    interactive
                    className={cn('relative flex h-full flex-col overflow-clip', s.accent === 'maroon' && 'bg-[linear-gradient(150deg,#6e0a0a,#2a0000)]')}
                  >
                    {i === 0 && <GoldGlow className="-right-16 -top-20" size={240} intensity={0.3} />}
                    <div className="relative flex-1">
                      <span className="flex size-11 items-center justify-center rounded-full border border-[rgba(249,223,50,0.28)] bg-[rgba(249,223,50,0.06)] text-gold-bright">
                        <Gem size={19} strokeWidth={1.6} aria-hidden />
                      </span>
                      <h3 className="mt-4 font-display text-[21px] font-medium text-cream">{s.name}</h3>
                      <p className="text-[13px] italic text-gold-pale">{s.tagline}</p>
                      <p className="mt-3 text-[13px] leading-relaxed text-cream-muted">{s.description}</p>
                      <ul className="mt-4 flex flex-col gap-1.5 text-[12.5px] text-cream-muted">
                        <li className="flex items-center gap-2 lining-nums">
                          <ShieldCheck size={14} className="text-gold-bright" aria-hidden />
                          {formatINR(s.minAmount, { whole: true })} – {formatINR(s.maxAmount, { whole: true })} per month
                        </li>
                        <li className="flex items-center gap-2 lining-nums">
                          <ShieldCheck size={14} className="text-gold-bright" aria-hidden />
                          Tenure {s.tenures.join(' / ')} months
                        </li>
                      </ul>
                    </div>
                    <div className="relative mt-5">
                      <GoldButton to={`${routes.joinScheme}?scheme=${s.id}`} variant={i === 0 ? 'primary' : 'secondary'} fullWidth iconRight={<ArrowRight />}>
                        Join this scheme
                      </GoldButton>
                    </div>
                  </GoldCard>
                </li>
              ))}
            </ul>
          </motion.section>
        </motion.div>
      </PageContainer>
    </PageTransition>
  )
}
