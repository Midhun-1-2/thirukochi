import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { defaultSchemeSelection, getPaymentMethod, getScheme, mockSchemes } from '@/data'
import type { SchemeSelection } from '@/data'
import { luxuryEase } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { SchemeHero } from '@/components/schemes/SchemeHero'
import { SchemeForm } from '@/components/schemes/SchemeForm'
import { SchemeSummary } from '@/components/schemes/SchemeSummary'
import { BackLink } from '@/components/ui/BackLink'

/* ------------------------------------------------------------------
   Join Scheme
   Desktop: [visual introduction] | [form + live summary]
   Mobile : hero → form → summary → CTA (inside form)
------------------------------------------------------------------- */

export default function JoinScheme() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { draft, setDraft } = useSchemeFlow()

  const preselect = params.get('scheme')
  const initial: Partial<SchemeSelection> = draft ?? {
    ...(preselect && mockSchemes.some((s) => s.id === preselect) ? { schemeId: preselect } : { schemeId: defaultSchemeSelection.schemeId }),
  }

  const [live, setLive] = useState<Partial<SchemeSelection>>(initial)
  const onValuesChange = useCallback((v: Partial<SchemeSelection>) => setLive(v), [])

  const onSubmit = (values: SchemeSelection) => {
    setDraft(values)
    navigate(routes.schemeDetails)
  }

  return (
    <PageTransition>
      <PageContainer className="py-5 sm:py-6 lg:py-8">
        <BackLink to={routes.home} label="Back to Home" className="mb-4" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Visual introduction */}
          <div className="lg:sticky lg:top-[112px]">
            <SchemeHero className="hidden lg:flex" />
            <SchemeHero compact className="lg:hidden" />
          </div>

          {/* Interactive form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.15 }}
            className="surface gold-edge rounded-[var(--radius-lg)] p-5 sm:p-7"
          >
            <div className="mb-6">
              <h2 className="font-display text-[24px] font-medium text-cream">Join Scheme</h2>
              <p className="mt-1 text-[13.5px] text-cream-muted">Tell us how you would like to save.</p>
            </div>

            <SchemeForm defaultValues={initial} onSubmit={onSubmit} onValuesChange={onValuesChange} />

            <div className="mt-6">
              <SchemeSummary
                variant="compact"
                scheme={getScheme(live.schemeId)}
                selection={live}
                paymentMethod={getPaymentMethod(live.paymentMethodId)}
                animated={false}
              />
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </PageTransition>
  )
}
