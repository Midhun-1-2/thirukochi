import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Handles in-page hash links (e.g. /profile#support).
 * Top-of-page resets are done by <PageTransition> when a page mounts.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (!el) return
    const t = window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350)
    return () => window.clearTimeout(t)
  }, [pathname, hash])
  return null
}
