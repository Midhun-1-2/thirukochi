import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { routes } from './navigation'

/** Routes that require an authenticated session. */
export function RequireAuth() {
  const { isAuthenticated, account } = useAuth()
  if (isAuthenticated) return <Outlet />
  // First-time visitors start with registration; returning members go to login.
  return <Navigate to={account ? routes.login : routes.register} replace />
}

/** Auth screens: already-logged-in members are sent to the dashboard. */
export function RedirectIfAuthed() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  // Allow Register to be viewed even while logged in (for demos); guard Login only.
  if (isAuthenticated && location.pathname === routes.login) return <Navigate to={routes.home} replace />
  return <Outlet />
}
