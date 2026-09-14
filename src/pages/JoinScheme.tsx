import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { defaultSchemeSelection, getPaymentMethod, getScheme, mockSchemes } from '@/data'
import type { SchemeSelection } from '@/data'
import { useEntrance } from '@/lib/entrance'
import { luxuryEase } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { SchemeHero } from '@/components/schemes/SchemeHero'
import { SchemeForm } from '@/components/schemes/SchemeForm'
import { SchemeSummary } from '@/components/schemes/SchemeSummary'
import { BackLink } from '@/components/ui/BackLink'

/* ------------------------------------------------------------------
   Join Scheme
   Desktop: [visual introduction] | [form], live summary band beneath
   Mobile : slim hero → form → summary band
------------------------------------------------------------------- */

export default function JoinScheme() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { draft, setDraft } = useSchemeFlow()
  const entrance = useEntrance()

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
      <PageContainer className="py-4 sm:py-6 lg:py-8">
        <BackLink to={routes.home} label="Back to Home" className="mb-3 sm:mb-4" />

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-6">
          {/* Visual introduction — stretches to the form's height on desktop */}
          <div className="lg:flex">
            <SchemeHero className="hidden lg:flex lg:min-h-0 lg:flex-1" />
            <SchemeHero compact className="lg:hidden" />
          </div>

          {/* Interactive form */}
          <motion.div
            initial={entrance ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase, delay: 0.15 }}
            className="surface gold-edge rounded-[var(--radius-lg)] p-4 sm:p-7"
          >
            <div className="mb-3.5 sm:mb-6">
              <h2 className="font-display text-[22px] font-medium text-cream sm:text-[24px]">Join Scheme</h2>
              <p className="mt-0.5 hidden text-[13.5px] text-cream-muted sm:mt-1 sm:block">Tell us how you would like to save.</p>
            </div>

            <SchemeForm defaultValues={initial} onSubmit={onSubmit} onValuesChange={onValuesChange} />
          </motion.div>

          {/* Live summary */}
          <SchemeSummary
            variant="strip"
            scheme={getScheme(live.schemeId)}
            selection={live}
            paymentMethod={getPaymentMethod(live.paymentMethodId)}
            animated={false}
            className="lg:col-span-2"
          />
        </div>
      </PageContainer>
    </PageTransition>
  )
}
