import { cloneElement } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { JoinSchemeCTA } from '@/components/dashboard/JoinSchemeCTA'
import { useKeyboardOpen } from '@/hooks/useKeyboardOpen'
import { cn } from '@/lib/cn'
import { DesktopSidebar } from './DesktopSidebar'
import { Header } from './Header'
import { MobileBottomNav } from './MobileBottomNav'

/* ------------------------------------------------------------------
   AppShell — authenticated frame.
   Desktop: sidebar + header + content.  Mobile: header + content +
   bottom navigation + floating Join Scheme action.
------------------------------------------------------------------- */

export function AppShell() {
  const outlet = useOutlet()
  const location = useLocation()
  const keyboardOpen = useKeyboardOpen()
  const inSchemeFlow = location.pathname.startsWith('/schemes/')
  const showFab = !inSchemeFlow && !keyboardOpen

  return (
    <div className="bg-cinematic relative min-h-dvh">
      <DesktopSidebar />

      <div className={cn('relative flex min-h-dvh flex-col', 'lg:pl-[88px] xl:pl-[264px]')}>
        <Header />

        <main
          id="main"
          className={cn(
            'relative flex-1 overflow-x-clip',
            'pb-[calc(var(--bottom-nav-height)+var(--safe-bottom)+24px)] lg:pb-12',
          )}
        >
          <AnimatePresence mode="wait">{outlet && cloneElement(outlet, { key: location.pathname })}</AnimatePresence>
        </main>
      </div>

      <MobileBottomNav />
      <JoinSchemeCTA variant="floating" visible={showFab} />
    </div>
  )
}
