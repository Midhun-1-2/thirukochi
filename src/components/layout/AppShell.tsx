import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { JoinSchemeCTA } from '@/components/dashboard/JoinSchemeCTA'
import { RouteFallback } from '@/components/motion/RouteFallback'
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
          {/* Crossfade: the incoming page mounts immediately while the
              outgoing one is popped out of flow and fades — a page is
              always on screen, even on slow devices. The incoming page
              is positioned so it paints above the (absolute) outgoing one. */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={location.pathname}
              className="relative z-[1] w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
            >
              <Suspense fallback={<RouteFallback />}>{outlet}</Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileBottomNav />
      <JoinSchemeCTA variant="floating" visible={showFab} />
    </div>
  )
}
