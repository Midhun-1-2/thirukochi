import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { authPaths } from '@/app/navigation'
import { cn } from '@/lib/cn'
import { EntranceContext, markGroupMounted, shouldPlayEntrance } from '@/lib/entrance'
import { pageVariants } from '@/lib/motion'

/**
 * Root of every routed page.
 *
 * - Decides (once, at mount) whether entrance choreography plays and
 *   shares that with descendants via <EntranceContext>. The auth flow
 *   always plays it — each step is a distinct moment. Inside the app,
 *   only the first page after login does; later navigations show
 *   content immediately behind the layout's cross-fade.
 * - Scrolls to the top when the incoming page mounts (unless a hash
 *   anchor is being targeted).
 */
interface PageTransitionProps {
  children: ReactNode
  className?: string
  /** Never animate the root itself (the page choreographs its own blocks). */
  still?: boolean
}

export function PageTransition({ children, className, still }: PageTransitionProps) {
  const { pathname, hash } = useLocation()
  const group = authPaths.has(pathname) ? 'auth' : 'app'
  const [entrance] = useState(() => group === 'auth' || shouldPlayEntrance(group))

  useEffect(() => {
    markGroupMounted(group)
  }, [group])

  useLayoutEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [hash])

  return (
    <EntranceContext.Provider value={entrance}>
      {entrance && !still ? (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className={cn('w-full', className)}>
          {children}
        </motion.div>
      ) : (
        <div className={cn('w-full', className)}>{children}</div>
      )}
    </EntranceContext.Provider>
  )
}
