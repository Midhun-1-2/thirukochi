import { useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Optimistic active state for primary navigation.
 *
 * Route changes render inside a React transition, so on a slow device the
 * new page (and, with it, the router's own active link state) can land
 * a few hundred milliseconds after the tap. Recording the tapped target
 * as an urgent state update moves the indicator immediately; the value
 * is only trusted while the location is still the one it was tapped from.
 */
export function useOptimisticNav() {
  const { pathname } = useLocation()
  const [pending, setPending] = useState<{ to: string; from: string } | null>(null)
  const current = pending && pending.from === pathname ? pending.to : pathname

  const isActive = (to: string) => (to === '/' ? current === '/' : current === to || current.startsWith(`${to}/`))
  const onNavigate = (to: string) => {
    if (to !== pathname) setPending({ to, from: pathname })
  }

  return { isActive, onNavigate }
}
