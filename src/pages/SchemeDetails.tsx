import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Pencil, ShieldCheck } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { getPaymentMethod, getScheme } from '@/data'
import { luxuryEase } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { SchemeSummary } from '@/components/schemes/SchemeSummary'
import { SchemeBenefits } from '@/components/schemes/SchemeBenefits'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { BackLink } from '@/components/ui/BackLink'

export default function SchemeDetails() {
  const { draft, confirmDraft } = useSchemeFlow()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  // Snapshot the draft at mount so the page keeps rendering during its exit
  // transition after the draft has been confirmed (and cleared) in context.
  const [current] = useState(draft)

  if (!current) return <Navigate to={routes.joinScheme} replace />

  const scheme = getScheme(current.schemeId)
  const payment = getPaymentMethod(current.paymentMethodId)

  const proceed = async () => {
    setBusy(true)
    const joined = await confirmDraft()
    if (joined) navigate(routes.schemeSuccess, { replace: true })
    else setBusy(false)
  }

  return (
    <PageTransition className="relative overflow-clip">
      <PageContainer className="py-5 sm:py-6 lg:py-8">
        <BackLink to={routes.joinScheme} label="Back" className="mb-4" />

        <div className="relative mx-auto max-w-[880px]">
          <GoldGlow className="-top-32 left-1/2 -translate-x-1/2" size={520} intensity={0.2} />

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: luxuryEase }} className="relative mb-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-gold-muted">Review &amp; confirm</p>
            <h1 className="mt-2 font-display text-[clamp(28px,4vw,38px)] font-medium leading-tight text-cream">Scheme Details</h1>
            <p className="mt-2 text-[14px] text-cream-muted">Please review your selection before proceeding.</p>
          </motion.div>

          <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: luxuryEase, delay: 0.1 }}>
              <SchemeSummary scheme={scheme} selection={current} paymentMethod={payment} variant="full" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: luxuryEase, delay: 0.25 }}>
              <GoldCard variant="default" className="h-full">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold-muted">Benefits</p>
                <p className="mt-1 mb-4 font-display text-[19px] font-medium text-cream">Why members choose this scheme</p>
                <SchemeBenefits benefits={scheme?.benefits ?? []} delay={0.5} />
                <p className="mt-4 text-[11.5px] leading-relaxed text-cream-faint">
                  Benefit descriptions are illustrative for this prototype. Final terms will be provided with the scheme documentation.
                </p>
              </GoldCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 1.1 }}
            className="relative mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
          >
            <GoldButton variant="secondary" size="lg" icon={<Pencil />} to={routes.joinScheme} className="sm:min-w-[180px]">
              Edit Details
            </GoldButton>
            <GoldButton size="lg" loading={busy} loadingText="Activating…" icon={<ShieldCheck />} iconRight={<ArrowRight />} onClick={proceed} className="sm:min-w-[200px]">
              Proceed
            </GoldButton>
          </motion.div>
        </div>
      </PageContainer>
    </PageTransition>
  )
}
