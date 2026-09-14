import { Navigate } from 'react-router-dom'
import { routes } from '@/app/navigation'
import { useSchemeFlow } from '@/context/SchemeContext'
import { getScheme } from '@/data'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldRibbon } from '@/components/motion/GoldRibbon'
import { SchemeSuccess } from '@/components/schemes/SchemeSuccess'

export default function SchemeSuccessPage() {
  const { lastJoined } = useSchemeFlow()
  if (!lastJoined) return <Navigate to={routes.joinScheme} replace />

  return (
    <PageTransition className="relative overflow-clip">
      <GoldGlow className="-top-40 left-1/2 -translate-x-1/2" size={640} intensity={0.22} />
      <GoldRibbon variant="sweep" opacity={0.3} className="top-auto bottom-0 h-[40%]" />
      <PageContainer className="relative flex min-h-[calc(100dvh-var(--nav-height)-var(--bottom-nav-height)-48px)] items-center justify-center py-6 sm:py-10 lg:min-h-[calc(100dvh-88px-96px)]">
        <SchemeSuccess joined={lastJoined} scheme={getScheme(lastJoined.schemeId)} />
      </PageContainer>
    </PageTransition>
  )
}
