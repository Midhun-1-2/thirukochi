import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Pencil, ShieldCheck } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { getPaymentMethod, getScheme } from '@/data'
import { useEntrance } from '@/lib/entrance'
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
  const entrance = useEntrance()
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
      <PageContainer className="py-4 sm:py-6 lg:py-8">
        <BackLink to={routes.joinScheme} label="Back" className="mb-3 sm:mb-4" />

        <div className="relative mx-auto max-w-[880px]">
          <GoldGlow className="-top-32 left-1/2 -translate-x-1/2" size={520} intensity={0.2} />

          <motion.div
            initial={entrance ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase }}
            className="relative mb-4 text-center sm:mb-6"
          >
            <p className="text-[10.5px] uppercase tracking-[0.24em] text-gold-muted sm:text-[11px]">Review &amp; confirm</p>
            <h1 className="mt-1 font-display text-[clamp(26px,4vw,38px)] font-medium leading-tight text-cream sm:mt-2">Scheme Details</h1>
            <p className="mt-1 text-[13px] text-cream-muted sm:mt-2 sm:text-[14px]">Please review your selection before proceeding.</p>
          </motion.div>

          <div className="relative grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
            <motion.div initial={entrance ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: luxuryEase, delay: 0.1 }}>
              <SchemeSummary scheme={scheme} selection={current} paymentMethod={payment} variant="full" />
            </motion.div>

            <motion.div initial={entrance ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: luxuryEase, delay: 0.25 }}>
              <GoldCard variant="default" padding="sm" className="h-full sm:p-6">
                <p className="text-[10.5px] uppercase tracking-[0.2em] text-gold-muted sm:text-[11px]">Benefits</p>
                <p className="mt-0.5 mb-3 font-display text-[17px] font-medium text-cream sm:mt-1 sm:mb-4 sm:text-[19px]">Why members choose this scheme</p>
                <SchemeBenefits benefits={scheme?.benefits ?? []} delay={entrance ? 0.5 : 0} columns={2} className="lg:grid-cols-1" />
                <p className="mt-3 text-[11px] leading-relaxed text-cream-faint sm:mt-4 sm:text-[11.5px]">
                  Benefit descriptions are illustrative for this prototype. Final terms will be provided with the scheme documentation.
                </p>
              </GoldCard>
            </motion.div>
          </div>

          <motion.div
            initial={entrance ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 1.1 }}
            className="relative mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-3 sm:mt-6 sm:flex sm:justify-end"
          >
            <GoldButton variant="secondary" size="lg" icon={<Pencil />} to={routes.joinScheme} className="h-12 px-4 sm:h-[54px] sm:min-w-[180px] sm:px-7">
              Edit Details
            </GoldButton>
            <GoldButton
              size="lg"
              loading={busy}
              loadingText="Activating…"
              icon={<ShieldCheck />}
              iconRight={<ArrowRight />}
              onClick={proceed}
              className="h-12 px-4 sm:h-[54px] sm:min-w-[200px] sm:px-7"
            >
              Proceed
            </GoldButton>
          </motion.div>
        </div>
      </PageContainer>
    </PageTransition>
  )
}
