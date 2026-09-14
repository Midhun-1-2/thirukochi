import { Link } from 'react-router-dom'
import { ArrowRight, Gem, ShieldCheck } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { getPaymentMethod, getScheme, mockSchemes } from '@/data'
import type { Scheme } from '@/data'
import { useIsTablet } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { formatINR } from '@/lib/format'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldBadge } from '@/components/ui/GoldBadge'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from './Wallet'

/* ------------------------------------------------------------------
   Schemes
   Mobile : "My Schemes" as a compact list; catalogue as a featured
            card followed by rich rows (no side-scrolling).
   md+    : catalogue grid (2 → 3 columns).
------------------------------------------------------------------- */

export default function Schemes() {
  const { joined } = useSchemeFlow()
  const tablet = useIsTablet()

  return (
    <PageTransition>
      <PageContainer className="py-4 sm:py-6 lg:py-8">
        <StaggerContainer stagger={0.06} className="flex flex-col gap-5 sm:gap-8">
          {/* My schemes */}
          <StaggerItem as="section" aria-labelledby="my-schemes">
            <SectionHeading title="My Schemes" eyebrow="Your plans" className="mb-3 sm:mb-4" />
            {joined.length === 0 ? (
              <GoldCard padding="sm" className="sm:p-6">
                <EmptyState icon={<Gem size={20} strokeWidth={1.5} aria-hidden />} title="No schemes joined yet" text="Pick a scheme below to begin your gold journey." inline />
              </GoldCard>
            ) : (
              <ul className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {joined.map((j) => {
                  const s = getScheme(j.schemeId)
                  return (
                    <li key={j.id}>
                      <GoldCard variant="edge" ornament padding="sm" className="h-full sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-display text-[17px] font-medium text-cream sm:text-[19px]">{s?.name ?? 'Scheme'}</p>
                            <p className="text-[11.5px] text-cream-faint lining-nums">Ref {j.referenceNo}</p>
                          </div>
                          <GoldBadge tone="live">Active</GoldBadge>
                        </div>
                        <dl className="mt-3 grid grid-cols-3 gap-3 text-[11.5px] sm:mt-4 sm:text-[12px]">
                          <div>
                            <dt className="text-cream-faint">Monthly</dt>
                            <dd className="font-display text-[16px] font-medium text-gold-bright lining-nums sm:text-[17px]">{formatINR(j.amount, { whole: true })}</dd>
                          </div>
                          <div>
                            <dt className="text-cream-faint">Tenure</dt>
                            <dd className="font-display text-[16px] font-medium text-cream lining-nums sm:text-[17px]">{j.tenure} mo</dd>
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
          </StaggerItem>

          {/* Catalogue */}
          <StaggerItem as="section" aria-labelledby="available-schemes">
            <SectionHeading title="Available Schemes" eyebrow="Explore" className="mb-3 sm:mb-4" />
            {tablet ? (
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {mockSchemes.map((s, i) => (
                  <li key={s.id}>
                    <SchemeCard scheme={s} featured={i === 0} />
                  </li>
                ))}
              </ul>
            ) : (
              /* phones: the lead scheme as a full card, the rest as rich rows */
              <ul className="flex flex-col gap-3">
                {mockSchemes.map((s, i) => (
                  <li key={s.id}>{i === 0 ? <SchemeCard scheme={s} featured /> : <SchemeRow scheme={s} />}</li>
                ))}
              </ul>
            )}
          </StaggerItem>
        </StaggerContainer>
      </PageContainer>
    </PageTransition>
  )
}

/** Full catalogue card (featured = gold glow + primary action). */
function SchemeCard({ scheme: s, featured }: { scheme: Scheme; featured?: boolean }) {
  return (
    <GoldCard
      variant={s.accent === 'maroon' ? 'edge' : 'default'}
      interactive
      padding="sm"
      className={cn('relative flex h-full flex-col overflow-clip sm:p-6', s.accent === 'maroon' && 'bg-[linear-gradient(150deg,#6e0a0a,#2a0000)]')}
    >
      {featured && <GoldGlow className="-right-16 -top-20" size={240} intensity={0.3} />}
      <div className="relative flex-1">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[rgba(249,223,50,0.28)] bg-[rgba(249,223,50,0.06)] text-gold-bright sm:size-11">
            <Gem size={18} strokeWidth={1.6} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-[18px] font-medium leading-tight text-cream sm:text-[21px]">{s.name}</h3>
            <p className="truncate text-[12px] italic text-gold-pale sm:text-[13px]">{s.tagline}</p>
          </div>
          {featured && (
            <span className="ml-auto hidden shrink-0 rounded-full border border-[rgba(249,223,50,0.3)] bg-[rgba(249,223,50,0.08)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-gold-bright xs:inline-flex md:hidden xl:inline-flex">
              Popular
            </span>
          )}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-cream-muted sm:text-[13px]">{s.description}</p>
        <ul className="mt-3 flex flex-col gap-1 text-[12px] text-cream-muted sm:mt-4 sm:gap-1.5 sm:text-[12.5px]">
          <li className="flex items-center gap-2 lining-nums">
            <ShieldCheck size={14} className="shrink-0 text-gold-bright" aria-hidden />
            {formatINR(s.minAmount, { whole: true })} – {formatINR(s.maxAmount, { whole: true })} per month
          </li>
          <li className="flex items-center gap-2 lining-nums">
            <ShieldCheck size={14} className="shrink-0 text-gold-bright" aria-hidden />
            Tenure {s.tenures.join(' / ')} months
          </li>
        </ul>
      </div>
      <div className="relative mt-4 sm:mt-5">
        <GoldButton to={`${routes.joinScheme}?scheme=${s.id}`} variant={featured ? 'primary' : 'secondary'} size="sm" fullWidth iconRight={<ArrowRight />} className="sm:h-12 sm:text-[14px]">
          Join this scheme
        </GoldButton>
      </div>
    </GoldCard>
  )
}

/** Compact catalogue row for phones — the whole row opens the scheme. */
function SchemeRow({ scheme: s }: { scheme: Scheme }) {
  return (
    <Link
      to={`${routes.joinScheme}?scheme=${s.id}`}
      aria-label={`Join ${s.name}`}
      className={cn(
        'group relative flex items-center gap-3 overflow-clip rounded-[var(--radius-lg)] p-3.5 transition-colors',
        s.accent === 'maroon'
          ? 'gold-edge bg-[linear-gradient(150deg,#6e0a0a,#2a0000)]'
          : 'surface hover:bg-[rgba(110,10,10,0.35)]',
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[rgba(249,223,50,0.28)] bg-[rgba(249,223,50,0.06)] text-gold-bright">
        <Gem size={18} strokeWidth={1.6} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[17px] font-medium leading-tight text-cream">{s.name}</span>
        <span className="block truncate text-[12px] italic text-gold-pale">{s.tagline}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-cream-muted lining-nums">
          <span className="text-gold-pale">{formatINR(s.minAmount, { whole: true })} – {formatINR(s.maxAmount, { whole: true })}</span>
          <span aria-hidden className="text-gold-muted">·</span>
          <span>{s.tenures.join(' / ')} months</span>
        </span>
      </span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full gold-bg text-maroon-dark shadow-[0_6px_18px_rgba(249,223,50,0.25)] transition-transform group-hover:translate-x-0.5 group-active:scale-95">
        <ArrowRight size={16} strokeWidth={2.4} aria-hidden />
      </span>
    </Link>
  )
}
